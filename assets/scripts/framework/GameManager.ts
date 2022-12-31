import { _decorator, Component, Node, Prefab, instantiate } from "cc";
import { bullet } from "../bullet/Bullet";
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

  private _curShootTime = 0;
  private _isShooting = false;

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
  }

  private _init() {
    this._curShootTime = this.shootTime;
  }

  public isShooting(v: boolean) {
    this._isShooting = v;
  }

  public createBullet() {
    const bulletNode = instantiate(this.bullet01);
    bulletNode.setParent(this.bulletManager);
    const pos = this.playerPlane.position;
    bulletNode.setPosition(pos.x, pos.y, pos.z - 2.5);

    const bulletComp = bulletNode.getComponent(bullet);
    bulletComp.bulletSpeed = this.bulletSpeed;
  }
}
