import { _decorator, Component, Node, assetManager } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Load")
export class Load extends Component {
  start() {
    assetManager.loadBundle("ab-game", null, (err, bundle) => {
      console.log("bundle :>> ", bundle);
    });
  }

  update(deltaTime: number) {}
}
