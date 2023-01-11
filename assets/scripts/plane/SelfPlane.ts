import {
  _decorator,
  Component,
  Collider,
  ITriggerEvent,
  AudioSource,
  Node,
} from "cc";
import { Const } from "../framework/Const";
const { ccclass, property } = _decorator;

@ccclass("SelfPlane")
export class SelfPlane extends Component {
  @property(Node)
  public explode: Node = null;

  private _audioSource: AudioSource = null;

  public lifeValue: number = 5;
  private _curLifeValue: number = 0;
  public isDead = false;

  start() {
    // 获取音频资源
    this._audioSource = this.getComponent(AudioSource);
  }
  update(deltaTime: number) {}

  init() {
    this.resetPos();
    this._curLifeValue = this.lifeValue;
    this.isDead = false;
    this.explode.active = false;
    // console.log("this.node :>> ", this.node);
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
      // 掉血逻辑
      // console.log("reduce blood!!!");
      this._curLifeValue--;
      if (this._curLifeValue <= 0) {
        this._audioSource.play();
        this.isDead = true;
        this.explode.active = true;
      }
    }
  }
}
