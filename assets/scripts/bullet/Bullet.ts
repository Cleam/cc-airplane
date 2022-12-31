import { _decorator, Component, Node, Prefab } from "cc";
const { ccclass, property } = _decorator;

const OUT_RANGE = 30;

@ccclass("bullet")
export class bullet extends Component {
  @property
  bulletSpeed = 1;
  start() {}

  update(deltaTime: number) {
    const { x, y, z } = this.node.position;
    const moveZ = z - this.bulletSpeed;
    this.node.setPosition(x, y, moveZ);

    if (Math.abs(moveZ) > OUT_RANGE) {
      this.node.destroy();
      console.log("bullet destroy");
    }
  }
}
