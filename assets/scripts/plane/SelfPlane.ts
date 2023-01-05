import { _decorator, Component, Node, Collider, ITriggerEvent } from "cc";
import { Const } from "../framework/Const";
const { ccclass, property } = _decorator;

@ccclass("SelfPlane")
export class SelfPlane extends Component {
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
      console.log("reduce blood!!!");
    }
  }

  update(deltaTime: number) {}
}
