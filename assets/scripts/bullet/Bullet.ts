import { _decorator, Component, Collider, ITriggerEvent } from "cc";
import { Const } from "../framework/Const";
const { ccclass } = _decorator;

const OUT_RANGE = 30;

@ccclass("bullet")
export class bullet extends Component {
  private _bulletSpeed = 1;
  private _isEnemyBullet = false;
  // 子弹方向
  private _direction = Const.direction.MIDDLE;

  onEnable() {
    const collider = this.node.getComponent(Collider);
    collider.on("onTriggerEnter", this._onTriggerEnter, this);
  }

  onDisable() {
    const collider = this.node.getComponent(Collider);
    collider.off("onTriggerEnter", this._onTriggerEnter, this);
  }

  private _onTriggerEnter(event: ITriggerEvent) {
    this.node.destroy();
  }

  update(deltaTime: number) {
    const { x, y, z } = this.node.position;
    let moveZ = z;

    if (this._isEnemyBullet) {
      moveZ = z + this._bulletSpeed;
      this.node.setPosition(x, y, moveZ);
    } else {
      moveZ = z - this._bulletSpeed;
      // 判断玩家子弹方向（针对发散性子弹）
      if (this._direction === Const.direction.LEFT) {
        this.node.setPosition(x - this._bulletSpeed * 0.2, y, moveZ);
      } else if (this._direction === Const.direction.RIGHT) {
        this.node.setPosition(x + this._bulletSpeed * 0.2, y, moveZ);
      } else {
        this.node.setPosition(x, y, moveZ);
      }
    }

    if (Math.abs(moveZ) > OUT_RANGE) {
      this.node.destroy();
      console.log("bullet destroy");
    }
  }

  show(
    bulletSpeed: number,
    isEnemyBullet: boolean,
    direction = Const.direction.MIDDLE
  ) {
    this._bulletSpeed = bulletSpeed;
    this._isEnemyBullet = isEnemyBullet;
    this._direction = direction;
  }
}
