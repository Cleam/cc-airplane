import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Test")
export class Test extends Component {
  private _count: number = 0;

  onLoad() {
    console.log("【test onLoad】", this._count);
  }
  onEnable() {
    console.log("【test onEnable】", this._count);
  }
  start() {
    console.log("【test start】", this._count);
  }

  update(deltaTime: number) {
    if (this._count < 10) {
      console.log("【test update count】", this._count);
    }
    this._count++;
  }
}
