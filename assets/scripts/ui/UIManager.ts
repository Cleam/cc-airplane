import { _decorator, Component, Node, input, Input, EventTouch } from "cc";
import { GameManager } from "../framework/GameManager";
import { SelfPlane } from "../plane/SelfPlane";

const { ccclass, property } = _decorator;

@ccclass("UIManager")
export class UIManager extends Component {
  @property
  public planeSpeed: number = 4;

  @property(SelfPlane)
  public playerPlane: SelfPlane = null;

  @property(GameManager)
  public gameManager: GameManager = null;

  @property(Node)
  public gameStartPage: Node = null;
  @property(Node)
  public gamePage: Node = null;
  @property(Node)
  public gameOverPage: Node = null;

  start() {
    this.node.on(Input.EventType.TOUCH_START, this._touchStart, this);
    this.node.on(Input.EventType.TOUCH_MOVE, this._touchMove, this);
    this.node.on(Input.EventType.TOUCH_END, this._touchEnd, this);
    // 开始界面
    this.gameStartPage.active = true;
  }

  update(deltaTime: number) {}

  // 再来一局
  public restart() {
    this.gameManager.playAudio("button");
    this.gamePage.active = true;
    this.gameOverPage.active = false;
    this.gameManager.gameStart();
  }

  // 返回主页
  public returnMain() {
    this.gameManager.playAudio("button");
    this.gameStartPage.active = true;
    this.gameOverPage.active = false;
    this.playerPlane.resetPos();
  }

  private _touchStart() {
    if (this.gamePage.active) {
      this.gameManager?.isShooting(true);
    } else if (this.gameStartPage.active) {
      this.gameManager.playAudio("button");
      this.gameStartPage.active = false;
      this.gamePage.active = true;
      this.gameManager.gameStart();
    }
  }

  private _touchEnd() {
    if (!this.gamePage.active) {
      return;
    }

    this.gameManager?.isShooting(false);
  }

  private _touchMove(event: EventTouch) {
    if (!this.gamePage.active) {
      return;
    }

    const delta = event.getDelta();
    const { x, y, z } = this.playerPlane.node.position;
    this.playerPlane.node.setPosition(
      x + delta.x * this.planeSpeed * 0.01,
      y,
      z - delta.y * this.planeSpeed * 0.01
    );
  }
}
