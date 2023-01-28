import { _decorator, Component, Node, math, Collider, ITriggerEvent } from "cc";
import { Const } from "../base/Const";
import { GameManager } from "../GameManager";
import { PoolManager } from "../base/PoolManager";
const { ccclass, property } = _decorator;

@ccclass("BulletProp")
export class BulletProp extends Component {
  private _bulletPropSpeed = 0.05;
  private _bulletPropXSpeed = 0.1;
  private _gameManager: GameManager = null;

  onEnable() {
    const collider = this.node.getComponent(Collider);
    collider.on("onTriggerEnter", this._onTriggerEnter, this);
  }

  onDisable() {
    const collider = this.node.getComponent(Collider);
    collider.off("onTriggerEnter", this._onTriggerEnter, this);
  }

  private _onTriggerEnter(event: ITriggerEvent) {
    const otherColliderGroup = event.otherCollider.getGroup();
    // 道具与玩家飞机碰撞
    if (otherColliderGroup === Const.collisionType.SELF_PLANE) {
      //   // 销毁
      //   this.node.destroy();
      //   console.log("bullet prop destroy!!");
      // 判断道具类型
      const propType = event.selfCollider.node.name;
      if (propType === "bulletPropS") {
        this._gameManager.changeBulletType(Const.propType.S);
      } else if (propType === "bulletPropH") {
        this._gameManager.changeBulletType(Const.propType.H);
      } else {
        this._gameManager.changeBulletType(Const.propType.M);
      }

      // this.node.destroy();
      PoolManager.instance.putNode(this.node);
    }
  }

  update(deltaTime: number) {
    const { x, y, z } = this.node.position;
    // const randomX = math.randomRangeInt(-Const.boundary.x, Const.boundary.x + 1);
    const moveZ = z + this._bulletPropSpeed;
    let moveX = x;
    if (Math.abs(x) > Const.boundary.x) {
      this._bulletPropXSpeed = -this._bulletPropXSpeed;
    }
    this.node.setPosition(moveX + this._bulletPropXSpeed, y, moveZ);

    // 超出屏幕销毁
    if (moveZ > Const.outOfScreen.z) {
      // this.node.destroy();
      PoolManager.instance.putNode(this.node);
    }
  }

  show(gameManager: GameManager, speed: number) {
    this._gameManager = gameManager;
    this._bulletPropSpeed = speed;
  }
}
