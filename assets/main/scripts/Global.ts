import {
  _decorator,
  Component,
  Node,
  find,
  Game,
  Prefab,
  assetManager,
} from "cc";
import { AudioManager } from "./base/AudioManager";
import { GameManager } from "./GameManager";
import { SelfPlane } from "./npc/SelfPlane";
import { UIManager } from "./ui/UIManager";
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
  public static bullet01: Prefab = null;
  public static bullet02: Prefab = null;
  public static bullet03: Prefab = null;
  public static bullet04: Prefab = null;
  public static bullet05: Prefab = null;

  // 敌机
  public static enemy01: Prefab = null; // plane02
  public static enemy02: Prefab = null; // plane03

  // 道具
  public static bulletPropS: Prefab = null;
  public static bulletPropH: Prefab = null;
  public static bulletPropM: Prefab = null;

  // 敌机爆炸特效
  public static enemyExplodePrefab: Prefab = null;

  public static gameManager: Node = null;
  public static uiManager: Node = null;
  public static audioManager: AudioManager = null;
  public static volumeWrap: Node = null;
  public static gamePage: Node = null;
  public static gameStartPage: Node = null;
  public static gameOverPage: Node = null;

  public static selfPlane: SelfPlane = null;
  public static bulletManager: Node = null;

  public static init() {
    this.selfPlane = find("self-plane").getComponent(SelfPlane);
    this.bulletManager = find("bullet-manager");

    const uiRoot = find("Canvas");
    // const ch = uiRoot.children;
    // console.log("ch :>> ", ch);
    this.audioManager = find("audio-manager", uiRoot)
      .getChildByName("effect")
      .getComponent(AudioManager);
    this.volumeWrap = find("volume-wrap", uiRoot);
    this.gamePage = find("game", uiRoot);
    this.gameStartPage = find("game-start", uiRoot);
    this.gameOverPage = find("game-over", uiRoot);
    this.gameManager = find("game-manager", uiRoot);
    this.uiManager = find("ui-manager", uiRoot);

    // 添加脚本组件
    this.gameManager.addComponent(GameManager);
    this.uiManager.addComponent(UIManager);
  }

  public static setPrefab(data: Prefab) {
    // console.log("88888888 data.name :>> ", data.name);
    switch (data.name) {
      case "bullet01":
        Global.bullet01 = data;
        break;
      case "bullet02":
        Global.bullet02 = data;
        break;
      case "bullet03":
        Global.bullet03 = data;
        break;
      case "bullet04":
        Global.bullet04 = data;
        break;
      case "bullet05":
        Global.bullet05 = data;
        break;
      case "bulletPropH":
        Global.bulletPropH = data;
        break;
      case "bulletPropM":
        Global.bulletPropM = data;
        break;
      case "bulletPropS":
        Global.bulletPropS = data;
        break;
      case "plane02":
        Global.enemy01 = data;
        break;
      case "plane03":
        Global.enemy02 = data;
        break;
      case "explodeSmall":
        Global.enemyExplodePrefab = data;
        break;

      default:
        break;
    }
  }
}
