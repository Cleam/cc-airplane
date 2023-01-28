import {
  _decorator,
  Component,
  Collider,
  ITriggerEvent,
  AudioSource,
  Node,
} from "cc";
import { Const } from "../base/Const";
const { ccclass, property } = _decorator;

@ccclass("SelfPlane")
export class SelfPlane extends Component {
  @property(Node)
  public explode: Node = null;

  // 血条
  @property(Node)
  public blood: Node = null;

  private bloodFace: Node = null;

  private _audioSource: AudioSource = null;

  public lifeValue: number = 5;
  private _curLifeValue: number = 0;
  public isDead = false;

  start() {
    // 获取音频资源
    this._audioSource = this.getComponent(AudioSource);
    // 血条进度条
    this.bloodFace = this.blood.getChildByName("face");
  }
  update(deltaTime: number) {}

  init() {
    this.resetPos();
    this._curLifeValue = this.lifeValue;
    this.isDead = false;
    this.explode.active = false;
    this.bloodFace.setScale(1, 1, 1);
  }

  public resetPos() {
    this.node.setPosition(0, 0, 18);
  }

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
    // 玩家飞机与敌机、敌机子弹碰撞
    if (
      otherColliderGroup === Const.collisionType.ENEMY_PLANE ||
      otherColliderGroup === Const.collisionType.ENEMY_BULLET
    ) {
      // 血条一开始不显示，被伤害后开始显示
      if (this._curLifeValue === this.lifeValue) {
        this.blood.active = true;
      }
      // 掉血逻辑
      this._curLifeValue--;
      this.bloodFace.setScale(this._curLifeValue / this.lifeValue, 1, 1);
      if (this._curLifeValue <= 0) {
        this._audioSource.play();
        this.isDead = true;
        this.explode.active = true;
        this.blood.active = false;
      }
    }
  }
}
