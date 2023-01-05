import { _decorator, Component, Node, Prefab } from "cc";
const { ccclass, property } = _decorator;

const OUT_RANGE = 30;

@ccclass("bullet")
export class bullet extends Component {
  private _bulletSpeed = 1;
  private _isEnemyBullet = false;

  start() {}

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
