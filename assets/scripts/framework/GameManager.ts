import {
  _decorator,
  Component,
  Node,
  Prefab,
  instantiate,
  sys,
  math,
} from "cc";
import { bullet } from "../bullet/Bullet";
import { EnemyPlane } from "../plane/EnemyPlane";
import { Const } from "./Const";
const { ccclass, property } = _decorator;

// if (sys.Platform.WECHAT_GAME) {
//   console.log("[Platform]", sys.Platform);
//   wx.onShow((options) => {
//     console.log("[onShow] options :>> ", options);
//   });
// }

@ccclass("GameManager")
export class GameManager extends Component {
  @property(Node)
  public playerPlane: Node | null = null;

  @property(Prefab)
  public bullet01: Prefab | null = null;
  @property(Prefab)
  public bullet02: Prefab | null = null;
  @property(Prefab)
  public bullet03: Prefab | null = null;
  @property(Prefab)
  public bullet04: Prefab | null = null;
  @property(Prefab)
  public bullet05: Prefab | null = null;

  @property(Node)
  public bulletManager: Node | null = null;
  @property
  public shootTime = 0.3;
  @property
  public bulletSpeed = 1;

  // 敌机
  @property(Prefab)
  public enemy01: Prefab | null = null;
  @property(Prefab)
  public enemy02: Prefab | null = null;
  @property
  public enemyTime = 3;
  @property
  public enemy1Speed = 0.3;
  @property
  public enemy2Speed = 0.5;

  private _curShootTime = 0;
  private _curEnemyTime = 0;
  private _isShooting = false;
  private _combinationInterval = Const.combination.TYPE1;

  start() {
    this._init();
  }

  update(deltaTime: number) {
    if (this._isShooting) {
      this._curShootTime += deltaTime;
      if (this._curShootTime > this.shootTime) {
        this.createBullet();
        this._curShootTime = 0;
      }
    }
    if (this._combinationInterval === Const.combination.TYPE1) {
      this._curEnemyTime += deltaTime;
      if (this._curEnemyTime > this.enemyTime) {
        this.createEnemy();
        this._curEnemyTime = 0;
      }
    } else if (this._combinationInterval === Const.combination.TYPE2) {
    } else {
    }
  }

  private _init() {
    this._curShootTime = this.shootTime;
    this._changeCombination();
  }

  public isShooting(v: boolean) {
    this._isShooting = v;
  }

  // 更新组合状态
  private _changeCombination() {
    // 10s更新一次
    this.schedule(() => {
      this._combinationInterval++;
      if (this._combinationInterval > Const.combination.TYPE3) {
        this._combinationInterval = Const.combination.TYPE1;
      }
    }, 10);
  }

  public createBullet() {
    const bulletNode = instantiate(this.bullet01);
    const pos = this.playerPlane.position;
    bulletNode.setPosition(pos.x, pos.y, pos.z - 2.5);

    const bulletComp = bulletNode.getComponent(bullet);
    bulletComp.bulletSpeed = this.bulletSpeed;
    bulletNode.setParent(this.bulletManager);
  }

  public createEnemy() {
    // 获取随机数
    const whichEnemy = math.randomRangeInt(1, 3);
    let enemyNode: Node | null = null;
    let speed = 0;
    if (whichEnemy === Const.enemyType.TYPE1) {
      enemyNode = instantiate(this.enemy01);
      speed = this.enemy1Speed;
    } else {
      enemyNode = instantiate(this.enemy02);
      speed = this.enemy2Speed;
    }
    const x = math.randomRangeInt(-12, 13);
    enemyNode.setPosition(x, 0, -27);
    const enemyPlaneComp = enemyNode.getComponent(EnemyPlane);
    enemyPlaneComp.show(speed);
    enemyNode.setParent(this.node);
  }
}
