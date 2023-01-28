import {
  _decorator,
  Component,
  Node,
  Input,
  EventTouch,
  AudioSource,
  log,
  Prefab,
} from "cc";
import { GameManager } from "../GameManager";
import { Const } from "../base/Const";
import { AudioManager } from "../base/AudioManager";
import { PoolManager } from "../base/PoolManager";

const { ccclass, property } = _decorator;

@ccclass("UIManager")
export class UIManager extends Component {
  @property
  public planeSpeed: number = 4;

  @property(Prefab)
  public gameManagerPre: Prefab = null;
  private _gameManager: GameManager = null;

  @property(Prefab)
  public gameStartPagePre: Prefab = null;
  private _gameStartPage: Node = null;
  @property(Prefab)
  public gamePagePre: Prefab = null;
  private _gamePage: Node = null;
  @property(Prefab)
  public gameOverPagePre: Prefab = null;
  private _gameOverPage: Node = null;
  @property(Prefab)
  public volumePre: Prefab = null;
  private _volume: Node = null;

  // 音效
  @property(Prefab)
  public audioManagerPre: Prefab = null;
  // 音效
  private _audioManager: AudioManager = null;

  // private _bgmSource: AudioSource = null;

  private _initNode() {
    const gn = PoolManager.instance.getNode;
    this._gameManager = PoolManager.instance
      .getNode(this.gameManagerPre, this.node)
      .getComponent(GameManager);

    this._gameStartPage = gn(this.gameStartPagePre, this.node);
    this._gamePage = gn(this.gamePagePre, this.node);
    this._volume = gn(this.volumePre, this.node);
    this._gamePage = gn(this.gamePagePre, this.node);

    // 音乐管理组件
    this._audioManager = gn(this.audioManagerPre, this.node)
      .getChildByName("effect")
      .getComponent(AudioManager);
  }

  start() {
    log("canvas started!!!");
    this._initNode();

    this.node.on(Input.EventType.TOUCH_START, this._touchStart, this);
    this.node.on(Input.EventType.TOUCH_MOVE, this._touchMove, this);
    this.node.on(Input.EventType.TOUCH_END, this._touchEnd, this);
    // 开始界面
    this._gameStartPage.active = true;
  }

  update(deltaTime: number) {}

  // 再来一局
  public restart() {
    this._gameManager.playAudio("button");
    this._gamePage.active = true;
    this._gameOverPage.active = false;
    this._gameManager.gameStart();
  }

  // 返回主页
  public returnMain() {
    this._gameManager.playAudio("button");
    this._gameStartPage.active = true;
    this._gameOverPage.active = false;
    this._gameManager.playerPlane.resetPos();
  }

  private _touchStart() {
    if (this._gamePage.active) {
      this._gameManager?.isShooting(true);
    } else if (this._gameStartPage.active) {
      this._gameManager.playAudio("button");
      this._gameStartPage.active = false;
      this._gamePage.active = true;
      this._gameManager.gameStart();
    }
  }

  private _touchEnd() {
    if (!this._gamePage.active) {
      return;
    }

    this._gameManager?.isShooting(false);
  }

  private _touchMove(event: EventTouch) {
    if (!this._gamePage.active) {
      return;
    }

    const delta = event.getDelta();
    let { x, y, z } = this._gameManager.playerPlane.node.position;
    x = x + delta.x * this.planeSpeed * 0.01;
    z = z - delta.y * this.planeSpeed * 0.01;
    if (x < -Const.boundary.x) {
      x = -Const.boundary.x;
    } else if (x > Const.boundary.x) {
      x = Const.boundary.x;
    }
    this._gameManager.playerPlane.node.setPosition(x, y, z);
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
