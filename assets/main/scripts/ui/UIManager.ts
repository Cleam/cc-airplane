import { _decorator, Component, Input, EventTouch, log } from "cc";
import { Const } from "../base/Const";
import { Global } from "../Global";
import { GameManager } from "../GameManager";

const { ccclass, property } = _decorator;

@ccclass("UIManager")
export class UIManager extends Component {
  public planeSpeed: number = 5;

  private _gameManager: GameManager = null;

  start() {
    log("【 UIManager start 】");
    this._gameManager = Global.instance.gameManager.getComponent(GameManager);

    this.node.on(Input.EventType.TOUCH_START, this._touchStart, this);
    this.node.on(Input.EventType.TOUCH_MOVE, this._touchMove, this);
    this.node.on(Input.EventType.TOUCH_END, this._touchEnd, this);
    // 开始界面
    Global.instance.gameStartPage.active = true;
  }

  update(deltaTime: number) {}

  private _touchStart() {
    if (Global.instance.gamePage.active) {
      this._gameManager.isShooting(true);
    } else if (Global.instance.gameStartPage.active) {
      this._gameManager.playAudio("button");
      Global.instance.gameStartPage.active = false;
      Global.instance.gamePage.active = true;
      this._gameManager.gameStart();
    }
  }

  private _touchEnd() {
    if (!Global.instance.gamePage.active) {
      return;
    }

    this._gameManager.isShooting(false);
  }

  private _touchMove(event: EventTouch) {
    if (!Global.instance.gamePage.active) {
      return;
    }

    const delta = event.getDelta();
    let { x, y, z } = Global.instance.selfPlane.node.position;
    x = x + delta.x * this.planeSpeed * 0.01;
    z = z - delta.y * this.planeSpeed * 0.01;
    if (x < -Const.boundary.x) {
      x = -Const.boundary.x;
    } else if (x > Const.boundary.x) {
      x = Const.boundary.x;
    }
    Global.instance.selfPlane.node.setPosition(x, y, z);
  }
}
