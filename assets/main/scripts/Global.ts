import { _decorator, Node, find, Prefab } from "cc";
import { AudioManager } from "./base/AudioManager";
import { GameManager } from "./GameManager";
import { SelfPlane } from "./npc/SelfPlane";
import { UIManager } from "./ui/UIManager";
import { Volume } from "./ui/Volume";
const { ccclass, property } = _decorator;

export class Global {
  private static _instance: Global = null;
  public static get instance() {
    if (!this._instance) {
      this._instance = new Global();
    }

    return this._instance;
  }

  // 子弹
  public bullet01: Prefab = null;
  public bullet02: Prefab = null;
  public bullet03: Prefab = null;
  public bullet04: Prefab = null;
  public bullet05: Prefab = null;

  // 敌机
  public enemy01: Prefab = null; // plane02
  public enemy02: Prefab = null; // plane03

  // 道具
  public bulletPropS: Prefab = null;
  public bulletPropH: Prefab = null;
  public bulletPropM: Prefab = null;

  // 敌机爆炸特效
  public enemyExplodePrefab: Prefab = null;

  public gameManager: Node = null;
  public uiManager: Node = null;
  public audioManager: AudioManager = null;
  public volumeWrap: Node = null;
  public gamePage: Node = null;
  public gameStartPage: Node = null;
  public gameOverPage: Node = null;

  public selfPlane: SelfPlane = null;
  public bulletManager: Node = null;

  public init() {
    this.selfPlane = find("self-plane").getComponent(SelfPlane);
    this.bulletManager = find("bullet-manager");

    const uiRoot = find("Canvas");
    // const ch = uiRoot.children;
    // console.log("ch :>> ", ch);
    this.gameManager = uiRoot.getChildByName("game-manager");
    this.uiManager = uiRoot.getChildByName("ui-manager");
    this.audioManager = this.uiManager
      .getChildByName("audio-manager")
      .getChildByName("effect")
      .getComponent(AudioManager);
    this.volumeWrap = this.uiManager.getChildByName("volume-wrap");
    this.gamePage = this.uiManager.getChildByName("game");
    this.gameStartPage = this.uiManager.getChildByName("game-start");
    this.gameOverPage = this.uiManager.getChildByName("game-over");

    // 添加脚本组件
    this.gameManager.addComponent(GameManager);
    this.uiManager.addComponent(UIManager);
    this.volumeWrap.addComponent(Volume);
  }

  public setPrefab(data: Prefab) {
    // console.log("88888888 data.name :>> ", data.name);
    switch (data.name) {
      case "bullet01":
        this.bullet01 = data;
        break;
      case "bullet02":
        this.bullet02 = data;
        break;
      case "bullet03":
        this.bullet03 = data;
        break;
      case "bullet04":
        this.bullet04 = data;
        break;
      case "bullet05":
        this.bullet05 = data;
        break;
      case "bulletPropH":
        this.bulletPropH = data;
        break;
      case "bulletPropM":
        this.bulletPropM = data;
        break;
      case "bulletPropS":
        this.bulletPropS = data;
        break;
      case "plane02":
        this.enemy01 = data;
        break;
      case "plane03":
        this.enemy02 = data;
        break;
      case "explodeSmall":
        this.enemyExplodePrefab = data;
        break;

      default:
        break;
    }
  }
}
