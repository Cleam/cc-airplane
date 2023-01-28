import { _decorator, Component, Collider, ITriggerEvent } from "cc";
import { Const } from "../base/Const";
import { GameManager } from "../GameManager";
import { PoolManager } from "../base/PoolManager";
const { ccclass, property } = _decorator;

@ccclass("EnemyPlane")
export class EnemyPlane extends Component {
  @property
  public createBulletTime = 0.5;

  // 子弹创建周期时间
  private _needBullet = false;
  // 当前创建子弹时间线
  private _curCreateBulletTime = 0;
  // 游戏管理组件
  private _gameManager: GameManager = null;
  private _enemySpeed = 0.2;

  onEnable() {
    const collider = this.node.getComponent(Collider);
    collider.on("onTriggerEnter", this._onTriggerEnter, this);
  }

  onDisable() {
    const collider = this.node.getComponent(Collider);
    collider.off("onTriggerEnter", this._onTriggerEnter, this);
  }

  private _onTriggerEnter(event: ITriggerEvent) {
    const otherColliderGroup = event.otherCollider.getGroup();
    // 敌机与玩家飞机、玩家子弹碰撞
    if (
      otherColliderGroup === Const.collisionType.SELF_PLANE ||
      otherColliderGroup === Const.collisionType.SELF_BULLET
    ) {
      // 播放音效
      this._gameManager.playAudio("enemy");
      // 敌机销毁
      // this.node.destroy();
      PoolManager.instance.putNode(this.node);
      // 加分
      this._gameManager.addScore();
      // 爆炸💥特效
      this._gameManager.createEnemyExplode(this.node.position);
    }
  }

  update(deltaTime: number) {
    const { x, y, z } = this.node.position;
    const moveZ = z + this._enemySpeed;
    // console.log("moveZ :>> ", moveZ);
    this.node.setPosition(x, y, moveZ);

    // 超出屏幕边界则销毁
    if (this.node.position.z > Const.outOfScreen.z) {
      // this.node.destroy();
      PoolManager.instance.putNode(this.node);
    }

    // 需要发射子弹
    if (this._needBullet) {
      this._curCreateBulletTime += deltaTime;
      if (this._curCreateBulletTime > this.createBulletTime) {
        this._gameManager.createEnemyBullet(this.node.position);
        this._curCreateBulletTime = 0;
      }
    }
  }

  show(gameManager: GameManager, speed: number, needBullet: boolean) {
    this._gameManager = gameManager;
    this._enemySpeed = speed;
    this._needBullet = needBullet;
  }
}
