import { _decorator, Component, Node, math, Collider, ITriggerEvent } from "cc";
import { Const } from "../framework/Const";
import { GameManager } from "../framework/GameManager";
const { ccclass, property } = _decorator;

const OUT_OF_BOUND = 30;

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

      this.node.destroy();
    }
  }

  update(deltaTime: number) {
    const { x, y, z } = this.node.position;
    // const randomX = math.randomRangeInt(-12, 13);
    const moveZ = z + this._bulletPropSpeed;
    let moveX = x;
    if (Math.abs(x) > 12) {
      this._bulletPropXSpeed = -this._bulletPropXSpeed;
    }
    this.node.setPosition(moveX + this._bulletPropXSpeed, y, moveZ);

    if (moveZ > OUT_OF_BOUND) {
      this.node.destroy();
      console.log("BulletProp destroy!!!");
    }
  }

  show(gameManager: GameManager, speed: number) {
    this._gameManager = gameManager;
    this._bulletPropSpeed = speed;
  }
}
