import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("bg")
export class bg extends Component {
  @property(Node)
  public bg01: Node | null = null;

  @property(Node)
  public bg02: Node | null = null;

  _bgSpeed: number = 5;

  _bgHeight: number = 50;

  start() {}

  update(deltaTime: number) {
    if (this.bg01 && this.bg02) {
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
}
