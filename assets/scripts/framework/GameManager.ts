import {
  _decorator,
  Component,
  Node,
  Prefab,
  math,
  Vec3,
  BoxCollider,
  macro,
  Label,
  Animation,
} from "cc";
import { bullet } from "../bullet/Bullet";
import { BulletProp } from "../bullet/BulletProp";
import { EnemyPlane } from "../plane/EnemyPlane";
import { SelfPlane } from "../plane/SelfPlane";
import { AudioManager } from "./AudioManager";
import { Const } from "./Const";
import { PoolManager } from "./PoolManager";
const { ccclass, property } = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
  @property(SelfPlane)
  public playerPlane: SelfPlane = null;

  @property(Prefab)
  public bullet01: Prefab = null;
  @property(Prefab)
  public bullet02: Prefab = null;
  @property(Prefab)
  public bullet03: Prefab = null;
  @property(Prefab)
  public bullet04: Prefab = null;
  @property(Prefab)
  public bullet05: Prefab = null;

  @property(Node)
  public bulletManager: Node = null;
  @property
  public shootTime = 0.1;
  @property
  public bulletSpeed = 1;

  // 敌机
  @property(Prefab)
  public enemy01: Prefab = null;
  @property(Prefab)
  public enemy02: Prefab = null;
  @property
  public enemyTime = 3;
  @property
  public enemy1Speed = 0.3;
  @property
  public enemy2Speed = 0.5;
  @property
  public enemyBulletSpeed = 0.6;

  // 道具
  @property(Prefab)
  public bulletPropS: Prefab = null;
  @property(Prefab)
  public bulletPropH: Prefab = null;
  @property(Prefab)
  public bulletPropM: Prefab = null;
  @property
  public bulletPropSSpeed = 0.13;
  @property
  public bulletPropHSpeed = 0.12;
  @property
  public bulletPropMSpeed = 0.1;

  // 游戏状态
  public isGameStart = false;

  // 游戏分数
  @property(Label)
  public gameScore: Label = null;
  @property(Label)
  public gameOverScore: Label = null;

  // 游戏UI界面
  @property(Node)
  public gameStartPage: Node = null;
  @property(Node)
  public gameOverPage: Node = null;
  @property(Node)
  public gamePage: Node = null;

  // 结束动画
  @property(Animation)
  public overAnim: Animation = null;

  // 音效
  @property(AudioManager)
  public audioEffect: AudioManager = null;

  private _curShootTime = 0;
  private _curEnemyTime = 0;
  private _isShooting = false;
  private _combinationInterval = Const.combination.TYPE1;
  // 当前子弹道具类型
  private _bulletPropType = Const.propType.M;
  // 玩家得分
  private _score = 0;

  // start() {
  // this._init();
  // }

  update(deltaTime: number) {
    if (!this.isGameStart) {
      return;
    }

    if (this.playerPlane.isDead) {
      this.gameOver();
      return;
    }

    if (this._isShooting) {
      this._curShootTime += deltaTime;
      if (this._curShootTime > this.shootTime) {
        if (this._bulletPropType === Const.propType.S) {
          this.createBulletS();
        } else if (this._bulletPropType === Const.propType.H) {
          this.createBulletH();
        } else {
          this.createBulletM();
        }
        this._curShootTime = 0;

        // 播放子弹音效
        const name = "bullet" + ((this._bulletPropType % 2) + 1);
        this.playAudio(name);
      }
    }
    this._curEnemyTime += deltaTime;
    if (this._combinationInterval === Const.combination.TYPE1) {
      if (this._curEnemyTime > this.enemyTime) {
        this.createEnemy();
        this._curEnemyTime = 0;
      }
    } else if (this._combinationInterval === Const.combination.TYPE2) {
      if (this._curEnemyTime > this.enemyTime * 1.2) {
        const whichType = math.randomRangeInt(1, 3);
        // 组合1和2
        if (whichType === Const.combination.TYPE1) {
          this.createCombination1();
        } else {
          this.createEnemy();
        }
        this._curEnemyTime = 0;
      }
    } else {
      if (this._curEnemyTime > this.enemyTime * 1.4) {
        const whichType = math.randomRangeInt(1, 4);
        // 组合1和2
        if (whichType === Const.combination.TYPE1) {
          this.createCombination2();
        } else if (whichType === Const.combination.TYPE2) {
          this.createCombination1();
        } else {
          this.createEnemy();
        }
        this._curEnemyTime = 0;
      }
    }
  }

  // 游戏开始
  public gameStart() {
    this.isGameStart = true;
    this._init();
    this.playerPlane.init();
  }

  // 游戏结束
  public gameOver() {
    // 修改游戏状态
    this.isGameStart = false;

    // 更新游戏界面
    this.gamePage.active = false;
    this.gameOverPage.active = true;
    // 播放结束动画
    this.overAnim.play();

    // 取消调度器
    this.unschedule(this._changeMode);

    // 移除飞机、道具和子弹
    this._destroyAll();
  }

  private _init() {
    this._curEnemyTime = 0;
    this._isShooting = false;
    this._combinationInterval = Const.combination.TYPE1;
    // 当前子弹道具类型
    this._bulletPropType = Const.propType.M;
    // 玩家得分
    this._score = 0;
    this._curShootTime = this.shootTime;
    this._changeCombination();
  }

  public addScore() {
    this._score++;
    this.gameScore.string = this._score.toString();
    this.gameOverScore.string = this._score.toString();
  }

  public isShooting(v: boolean) {
    this._isShooting = v;
  }

  public playAudio(name: string) {
    this.audioEffect.play(name);
  }

  // 更新组合状态
  private _changeCombination() {
    // 10s改一次敌机出现模式和道具出现逻辑
    this.schedule(this._changeMode, 10, macro.REPEAT_FOREVER);
  }

  // 模式更新
  private _changeMode() {
    this._combinationInterval++;
    // if (this._combinationInterval > Const.combination.TYPE3) {
    //   this._combinationInterval = Const.combination.TYPE1;
    // }
    // 生成道具
    this.createBulletProp();
  }

  // 生成玩家子弹（单排）
  public createBulletM() {
    // const bulletNode = instantiate(this.bullet01);
    // bulletNode.setParent(this.bulletManager);
    const bulletNode = PoolManager.instance().getNode(
      this.bullet01,
      this.bulletManager
    );
    const pos = this.playerPlane.node.position;
    bulletNode.setPosition(pos.x, pos.y, pos.z - 2.5);
    const bulletComp = bulletNode.getComponent(bullet);
    bulletComp.show(this.bulletSpeed, false);
  }
  // 生成玩家子弹（双排 并排发射）
  public createBulletH() {
    const pos = this.playerPlane.node.position;
    // left
    // const bulletNodeLeft = instantiate(this.bullet03);
    // bulletNodeLeft.setParent(this.bulletManager);
    const bulletNodeLeft = PoolManager.instance().getNode(
      this.bullet03,
      this.bulletManager
    );
    bulletNodeLeft.setPosition(pos.x - 1.2, pos.y, pos.z - 2.5);
    const bulletCompLeft = bulletNodeLeft.getComponent(bullet);
    bulletCompLeft.show(this.bulletSpeed, false);
    // right
    // const bulletNodeRight = instantiate(this.bullet03);
    // bulletNodeRight.setParent(this.bulletManager);
    const bulletNodeRight = PoolManager.instance().getNode(
      this.bullet03,
      this.bulletManager
    );
    bulletNodeRight.setPosition(pos.x + 1.2, pos.y, pos.z - 2.5);
    const bulletCompRight = bulletNodeRight.getComponent(bullet);
    bulletCompRight.show(this.bulletSpeed, false);
  }

  // 生成玩家子弹（三排且发散发射）
  public createBulletS() {
    const pos = this.playerPlane.node.position;
    // left
    // const bulletNodeLeft = instantiate(this.bullet05);
    // bulletNodeLeft.setParent(this.bulletManager);
    const bulletNodeLeft = PoolManager.instance().getNode(
      this.bullet05,
      this.bulletManager
    );
    bulletNodeLeft.setPosition(pos.x - 1.2, pos.y, pos.z - 2.5);
    const bulletCompLeft = bulletNodeLeft.getComponent(bullet);
    bulletCompLeft.show(this.bulletSpeed, false, Const.direction.LEFT);
    // middle
    // const bulletNodeMiddle = instantiate(this.bullet05);
    // bulletNodeMiddle.setParent(this.bulletManager);
    const bulletNodeMiddle = PoolManager.instance().getNode(
      this.bullet05,
      this.bulletManager
    );
    bulletNodeMiddle.setPosition(pos.x, pos.y, pos.z - 2.5);
    const bulletCompMiddle = bulletNodeMiddle.getComponent(bullet);
    bulletCompMiddle.show(this.bulletSpeed, false);
    // right
    // const bulletNodeRight = instantiate(this.bullet05);
    // bulletNodeRight.setParent(this.bulletManager);
    const bulletNodeRight = PoolManager.instance().getNode(
      this.bullet05,
      this.bulletManager
    );
    bulletNodeRight.setPosition(pos.x + 1.2, pos.y, pos.z - 2.5);
    const bulletCompRight = bulletNodeRight.getComponent(bullet);
    bulletCompRight.show(this.bulletSpeed, false, Const.direction.RIGHT);
  }

  // 生成敌机子弹
  public createEnemyBullet(enemyPos: Vec3) {
    // console.log("enemyPos :>> ", enemyPos);
    // const bulletNode = instantiate(this.bullet02);
    // bulletNode.setParent(this.bulletManager);
    const bulletNode = PoolManager.instance().getNode(
      this.bullet02,
      this.bulletManager
    );
    bulletNode.setPosition(enemyPos.x, enemyPos.y, enemyPos.z + 2);
    const bulletComp = bulletNode.getComponent(bullet);
    bulletComp.show(this.enemyBulletSpeed, true);

    const bulletCollider = bulletNode.getComponent(BoxCollider);
    // 修改敌机子弹的分组为敌机子弹组（默认玩家子弹组）
    bulletCollider.setGroup(Const.collisionType.ENEMY_BULLET);
    // 修改敌机子弹的掩码为玩家飞机
    bulletCollider.setMask(Const.collisionType.SELF_PLANE);
  }

  // 随机敌机
  public createEnemy() {
    // 获取随机数
    const whichEnemy = math.randomRangeInt(1, 3);
    let enemyNode: Node | null = null;
    let speed = 0;
    if (whichEnemy === Const.enemyType.TYPE1) {
      // enemyNode = instantiate(this.enemy01);
      enemyNode = PoolManager.instance().getNode(this.enemy01, this.node);
      speed = this.enemy1Speed;
    } else {
      // enemyNode = instantiate(this.enemy02);
      enemyNode = PoolManager.instance().getNode(this.enemy02, this.node);
      speed = this.enemy2Speed;
    }
    // enemyNode.setParent(this.node);
    const x = math.randomRangeInt(-12, 13);
    enemyNode.setPosition(x, 0, -27);
    const enemyPlaneComp = enemyNode.getComponent(EnemyPlane);
    enemyPlaneComp.show(this, speed, true);
  }

  // 一字型组合敌机
  public createCombination1() {
    const enemyArr = new Array<Node>(5);
    for (let i = 0; i < enemyArr.length; i++) {
      // const enemyNode = instantiate(this.enemy02);
      // enemyNode.setParent(this.node);
      const enemyNode = PoolManager.instance().getNode(this.enemy02, this.node);
      enemyNode.setPosition(-12 + i * 6, 0, -27);
      const enemyPlaneComp = enemyNode.getComponent(EnemyPlane);
      enemyPlaneComp.show(this, this.enemy1Speed, false);
    }
  }

  // V字型组合敌机
  public createCombination2() {
    const enemyArr = new Array<Node>(7);
    for (let i = 0; i < enemyArr.length; i++) {
      // const enemyNode = instantiate(this.enemy01);
      // enemyNode.setParent(this.node);
      const enemyNode = PoolManager.instance().getNode(this.enemy01, this.node);
      // 0 1 2 3 4 5 6
      // -27-3*4 -27-2*4 -27-1*4 -27-0*4 -27-1*4 -27-2*4 -27-3*4
      enemyNode.setPosition(-12 + i * 4, 0, -27 - Math.abs(i - 3) * 4);
      const enemyPlaneComp = enemyNode.getComponent(EnemyPlane);
      enemyPlaneComp.show(this, this.enemy1Speed, false);
    }
  }

  // 生成道具
  public createBulletProp() {
    // 获取随机数
    const whichProp = math.randomRangeInt(1, 4);
    let propNode: Node | null = null;
    let speed = 0;
    if (whichProp === Const.propType.H) {
      // propNode = instantiate(this.bulletPropH);
      propNode = PoolManager.instance().getNode(this.bulletPropH, this.node);
      speed = this.bulletPropHSpeed;
    } else if (whichProp === Const.propType.S) {
      // propNode = instantiate(this.bulletPropS);
      propNode = PoolManager.instance().getNode(this.bulletPropS, this.node);
      speed = this.bulletPropSSpeed;
    } else {
      // propNode = instantiate(this.bulletPropM);
      propNode = PoolManager.instance().getNode(this.bulletPropM, this.node);
      speed = this.bulletPropMSpeed;
    }
    // propNode.setParent(this.node);
    const x = math.randomRangeInt(-12, 13);
    propNode.setPosition(x, 0, -27);
    const bulletPropComp = propNode.getComponent(BulletProp);
    bulletPropComp.show(this, speed);
  }

  public changeBulletType(type: number) {
    this._bulletPropType = type;
  }

  private _destroyAll() {
    // let children = this.node.children;
    // let len = children.length;
    // for (let i = len - 1; i > 0; i--) {
    //   children[i].destroy();
    // }

    // children = this.bulletManager.children;
    // len = children.length;
    // for (let i = len - 1; i > 0; i--) {
    //   children[i].destroy();
    // }

    // 清空飞机和道具
    this.node.destroyAllChildren();
    // 清空子弹
    this.bulletManager.destroyAllChildren();
  }
}
