import {
  _decorator,
  Component,
  Node,
  Input,
  EventTouch,
  log,
  Prefab,
  find,
} from "cc";
import { Const } from "../base/Const";
import { AudioManager } from "../base/AudioManager";
import { Global } from "../Global";
import { GameManager } from "../GameManager";

const { ccclass, property } = _decorator;

@ccclass("UIManager")
export class UIManager extends Component {
  public planeSpeed: number = 4;

  private _gameManager: GameManager = null;

  // private _gameStartPage: Node = null;
  // private _gamePage: Node = null;
  // private _gameOverPage: Node = null;
  // private _volumeWrap: Node = null;
  private _volume: Node = null;
  private _mute: Node = null;

  // 音效
  private _audioManager: AudioManager = null;

  private _initNode() {
    this._gameManager = Global.gameManager.getComponent(GameManager);
    this._volume = Global.volumeWrap.getChildByName("volume");
    this._mute = Global.volumeWrap.getChildByName("mute");
  }

  start() {
    log("【 UIManager start 】");
    this._initNode();

    this.node.on(Input.EventType.TOUCH_START, this._touchStart, this);
    this.node.on(Input.EventType.TOUCH_MOVE, this._touchMove, this);
    this.node.on(Input.EventType.TOUCH_END, this._touchEnd, this);
    // 开始界面
    Global.gameStartPage.active = true;
  }

  update(deltaTime: number) {}

  // 再来一局
  public restart() {
    this._gameManager.playAudio("button");
    Global.gamePage.active = true;
    Global.gameOverPage.active = false;
    this._gameManager.gameStart();
  }

  // 返回主页
  public returnMain() {
    this._gameManager.playAudio("button");
    Global.gameStartPage.active = true;
    Global.gameOverPage.active = false;
    Global.selfPlane.resetPos();
  }

  private _touchStart() {
    if (Global.gamePage.active) {
      this._gameManager.isShooting(true);
    } else if (Global.gameStartPage.active) {
      this._gameManager.playAudio("button");
      Global.gameStartPage.active = false;
      Global.gamePage.active = true;
      this._gameManager.gameStart();
    }
  }

  private _touchEnd() {
    if (!Global.gamePage.active) {
      return;
    }

    this._gameManager?.isShooting(false);
  }

  private _touchMove(event: EventTouch) {
    if (!Global.gamePage.active) {
      return;
    }

    const delta = event.getDelta();
    let { x, y, z } = Global.selfPlane.node.position;
    x = x + delta.x * this.planeSpeed * 0.01;
    z = z - delta.y * this.planeSpeed * 0.01;
    if (x < -Const.boundary.x) {
      x = -Const.boundary.x;
    } else if (x > Const.boundary.x) {
      x = Const.boundary.x;
    }
    Global.selfPlane.node.setPosition(x, y, z);
  }

  // 播放声音
  public music() {
    this._audioManager.music();
    this._volume.active = true;
    this._mute.active = false;
  }

  // 静音
  public stop() {
    this._audioManager.stop();
    this._volume.active = false;
    this._mute.active = true;
  }
}
