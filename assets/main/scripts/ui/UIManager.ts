import {
  _decorator,
  Component,
  Node,
  input,
  Input,
  EventTouch,
  AudioSource,
} from "cc";
import { GameManager } from "../framework/GameManager";
import { SelfPlane } from "../../../ab-game/scripts/plane/SelfPlane";
import { Const } from "../../../ab-game/scripts/Const";
import { AudioManager } from "../framework/AudioManager";

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
  @property(Node)
  public volume: Node = null;
  @property(Node)
  public mute: Node = null;

  // 音效
  @property(AudioManager)
  public audioEffect: AudioManager = null;

  private _bgmSource: AudioSource = null;

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
    let { x, y, z } = this.playerPlane.node.position;
    x = x + delta.x * this.planeSpeed * 0.01;
    z = z - delta.y * this.planeSpeed * 0.01;
    if (x < -Const.boundary.x) {
      x = -Const.boundary.x;
    } else if (x > Const.boundary.x) {
      x = Const.boundary.x;
    }
    this.playerPlane.node.setPosition(x, y, z);
  }

  // 播放声音
  public music() {
    this.audioEffect.music();
    this.volume.active = true;
    this.mute.active = false;
  }

  // 静音
  public stop() {
    this.audioEffect.stop();
    this.volume.active = false;
    this.mute.active = true;
  }
}
