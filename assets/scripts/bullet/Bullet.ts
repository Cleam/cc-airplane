import { _decorator, Component, Collider, ITriggerEvent } from "cc";
const { ccclass } = _decorator;

const OUT_RANGE = 30;

@ccclass("bullet")
export class bullet extends Component {
  private _bulletSpeed = 1;
  private _isEnemyBullet = false;

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
    const moveZ = this._isEnemyBullet
      ? z + this._bulletSpeed
      : z - this._bulletSpeed;
    this.node.setPosition(x, y, moveZ);

    if (Math.abs(moveZ) > OUT_RANGE) {
      this.node.destroy();
      console.log("bullet destroy");
    }
  }

  show(bulletSpeed: number, isEnemyBullet: boolean) {
    this._bulletSpeed = bulletSpeed;
    this._isEnemyBullet = isEnemyBullet;
  }
}
