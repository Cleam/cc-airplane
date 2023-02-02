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
import { Global } from "./Global";
// import { Test } from "./Test";
const { ccclass, property } = _decorator;

@ccclass("Loading")
export class Loading extends Component {
  @property(ProgressBar)
  public progressBar: ProgressBar = null;

  @property(Label)
  public progressLabel: Label = null;

  // @property(Node)
  // public test: Node = null;

  private _canvas: Node = null;
  private _scene: Scene = null;

  onLoad() {
    // this.test.addComponent(Test);
  }

  start() {
    this._canvas = this.node.parent;
    this._scene = this.node.scene;
    assetManager.loadBundle("ab-game", null, (err, bundle) => {
      if (err) {
        log("【资源加载出错】");
        throw err;
      }

      this._loadPrefabs();
    });
  }

  private _loadPrefabs() {
    const prefabs = [
      // 3d
      "prefab/d3/bg",
      "prefab/d3/self-plane",
      "prefab/d3/bullet-manager",
      // ui
      // "prefab/ui/audio-manager",
      // "prefab/ui/volume-wrap",
      // "prefab/ui/game-start",
      // "prefab/ui/game",
      // "prefab/ui/game-over",
      "prefab/ui/game-manager",
      "prefab/ui/ui-manager",
      // npc
      "prefab/npc/bullet01",
      "prefab/npc/bullet02",
      "prefab/npc/bullet03",
      "prefab/npc/bullet04",
      "prefab/npc/bullet05",
      "prefab/npc/bulletPropH",
      "prefab/npc/bulletPropM",
      "prefab/npc/bulletPropS",
      "prefab/npc/explodeSmall",
      "prefab/npc/plane02",
      "prefab/npc/plane03",
    ];

    // let progress = 0;

    let count = 0;
    const progress = () => {
      count++;
      const p = count / prefabs.length;
      this.progressBar.progress = p;
      this.progressLabel.string = Math.floor(p * 100) + "%";
      if (p >= 1) {
        // this.test.addComponent(Test);
        Global.instance.init();
        this.node.destroy();
      }
    };

    for (let i = 0; i < prefabs.length; i++) {
      const p = prefabs[i];
      assetManager.getBundle("ab-game").load(
        p,
        Prefab,
        // (finished, total, item) => {
        //   // console.log("finished / total :>> ", finished + "/" + total);
        //   const progress = finished / total;
        //   this.progressBar.progress = progress;
        //   this.progressLabel.string = Math.floor(progress * 100) + "%";
        // },
        (err, data) => {
          console.log(p, data);
          if (p.startsWith("prefab/d3")) {
            this._scene.addChild(instantiate(data));
          } else if (p.startsWith("prefab/ui")) {
            this._canvas.addChild(instantiate(data));
          } else {
            Global.instance.setPrefab(data);
          }
          progress();
        }
      );
    }
  }

  update(deltaTime: number) {}
}
