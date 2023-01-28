import {
  _decorator,
  Component,
  Node,
  assetManager,
  log,
  Prefab,
  ProgressBar,
  Label,
  instantiate,
  Scene,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("Loading")
export class Loading extends Component {
  @property(ProgressBar)
  public progressBar: ProgressBar = null;

  @property(Label)
  public progressLabel: Label = null;

  // private _canvas: Node = null;
  // private _scene: Scene = null;

  start() {
    // this._canvas = this.node.parent;
    // this._scene = this.node.scene;
    assetManager.loadBundle("ab-game", null, (err, bundle) => {
      if (err) {
        log("【资源加载出错】");
        throw err;
      }

      assetManager.getBundle("ab-game").load(
        "prefab/bg",
        Prefab,
        (finished, total, item) => {
          // console.log("finished / total :>> ", finished + "/" + total);
          const progress = finished / total;
          this.progressBar.progress = progress;
          this.progressLabel.string = Math.floor(progress * 100) + "%";
        },
        (err, data) => {
          console.log("data :>> ", data);
          const bg = instantiate(data);
          this.node.scene.addChild(bg);
          this.node.destroy();
        }
      );
    });
  }

  update(deltaTime: number) {}
}
