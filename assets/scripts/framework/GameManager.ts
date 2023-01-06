import {
  _decorator,
  Component,
  Node,
  Prefab,
  instantiate,
  math,
  Vec3,
  BoxCollider,
} from "cc";
import { bullet } from "../bullet/Bullet";
import { BulletProp } from "../bullet/BulletProp";
import { EnemyPlane } from "../plane/EnemyPlane";
import { Const } from "./Const";
const { ccclass, property } = _decorator;

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

  private _curShootTime = 0;
  private _curEnemyTime = 0;
  private _isShooting = false;
  private _combinationInterval = Const.combination.TYPE1;
  // 当前子弹道具类型
  private _bulletPropType = Const.propType.M;

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

  private _init() {
    this._curShootTime = this.shootTime;
    this._changeCombination();

    // dev
    this.createBulletProp();
  }

  public isShooting(v: boolean) {
    this._isShooting = v;
  }

  // 更新组合状态
  private _changeCombination() {
    // 10s更新一次
    this.schedule(() => {
      this._combinationInterval++;
      // if (this._combinationInterval > Const.combination.TYPE3) {
      //   this._combinationInterval = Const.combination.TYPE1;
      // }
      this.createBulletProp();
    }, 10);
  }

  // 生成玩家子弹
  public createBullet() {
    const bulletNode = instantiate(this.bullet01);
    const pos = this.playerPlane.position;
    bulletNode.setPosition(pos.x, pos.y, pos.z - 2.5);
    const bulletComp = bulletNode.getComponent(bullet);
    bulletComp.show(this.bulletSpeed, false);
    bulletNode.setParent(this.bulletManager);
  }

  // 生成敌机子弹
  public createEnemyBullet(enemyPos: Vec3) {
    // console.log("enemyPos :>> ", enemyPos);
    const bulletNode = instantiate(this.bullet01);
    bulletNode.setPosition(enemyPos.x, enemyPos.y, enemyPos.z + 2);
    const bulletComp = bulletNode.getComponent(bullet);
    bulletComp.show(this.enemyBulletSpeed, true);
    bulletNode.setParent(this.bulletManager);

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
      enemyNode = instantiate(this.enemy01);
      speed = this.enemy1Speed;
    } else {
      enemyNode = instantiate(this.enemy02);
      speed = this.enemy2Speed;
    }
    const x = math.randomRangeInt(-12, 13);
    enemyNode.setPosition(x, 0, -27);
    const enemyPlaneComp = enemyNode.getComponent(EnemyPlane);
    enemyPlaneComp.show(this, speed, true);
    enemyNode.setParent(this.node);
  }

  // 一字型组合敌机
  public createCombination1() {
    const enemyArr = new Array<Node>(5);
    for (let i = 0; i < enemyArr.length; i++) {
      const enemyNode = instantiate(this.enemy02);
      enemyNode.setPosition(-12 + i * 6, 0, -27);
      const enemyPlaneComp = enemyNode.getComponent(EnemyPlane);
      enemyPlaneComp.show(this, this.enemy1Speed, false);
      enemyNode.setParent(this.node);
    }
  }

  // V字型组合敌机
  public createCombination2() {
    const enemyArr = new Array<Node>(7);
    for (let i = 0; i < enemyArr.length; i++) {
      const enemyNode = instantiate(this.enemy01);
      // 0 1 2 3 4 5 6
      // -27-3*4 -27-2*4 -27-1*4 -27-0*4 -27-1*4 -27-2*4 -27-3*4
      enemyNode.setPosition(-12 + i * 4, 0, -27 - Math.abs(i - 3) * 4);
      const enemyPlaneComp = enemyNode.getComponent(EnemyPlane);
      enemyPlaneComp.show(this, this.enemy1Speed, false);
      enemyNode.setParent(this.node);
    }
  }

  // 生成道具
  public createBulletProp() {
    // 获取随机数
    const whichProp = math.randomRangeInt(1, 4);
    let propNode: Node | null = null;
    let speed = 0;
    if (whichProp === Const.propType.H) {
      propNode = instantiate(this.bulletPropH);
      speed = this.bulletPropHSpeed;
    } else if (whichProp === Const.propType.S) {
      propNode = instantiate(this.bulletPropS);
      speed = this.bulletPropSSpeed;
    } else {
      propNode = instantiate(this.bulletPropM);
      speed = this.bulletPropMSpeed;
    }
    const x = math.randomRangeInt(-12, 13);
    propNode.setPosition(x, 0, -27);
    const bulletPropComp = propNode.getComponent(BulletProp);
    bulletPropComp.show(this, speed);
    propNode.setParent(this.node);
  }

  public changeBulletType(type: number) {
    this._bulletPropType = type;
  }
}
