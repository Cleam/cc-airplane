import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

const OUT_OF_BOUND = 30;

@ccclass("EnemyPlane")
export class EnemyPlane extends Component {
  @property
  public enemySpeed = 0.2;
  start() {}

  update(deltaTime: number) {
    const { x, y, z } = this.node.position;
    const moveZ = z + this.enemySpeed;
    // console.log("moveZ :>> ", moveZ);
    this.node.setPosition(x, y, moveZ);

    // 超出屏幕边界则销毁
    if (this.node.position.z > OUT_OF_BOUND) {
      this.node.destroy();
      console.log("enemy plane destroy!");
    }
  }
}
