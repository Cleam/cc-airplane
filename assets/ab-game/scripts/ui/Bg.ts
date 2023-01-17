import { _decorator, Component, Node, Prefab } from "cc";
// import { GameManager } from "../GameManager";
const { ccclass, property } = _decorator;

@ccclass("bg")
export class bg extends Component {
  @property(Node)
  public bg01: Node = null;

  @property(Node)
  public bg02: Node = null;

  // @property(Prefab)
  // public gameManager: Prefab = null;

  _bgSpeed: number = 5;

  _bgHeight: number = 50;

  start() {}

  update(deltaTime: number) {
    // if (!this.gameManager.isGameStart) {
    //   return;
    // }

    const { z: z1 } = this.bg01.position;
    const { z: z2 } = this.bg02.position;
    const dist = this._bgSpeed * deltaTime;
    this.bg01.setPosition(0, 0, z1 + dist);
    this.bg02.setPosition(0, 0, z2 + dist);

    if (this.bg01.position.z >= this._bgHeight) {
      this.bg01.setPosition(0, 0, this.bg02.position.z - this._bgHeight);
    } else if (this.bg02.position.z >= this._bgHeight) {
      this.bg02.setPosition(0, 0, this.bg01.position.z - this._bgHeight);
    }
  }
}
