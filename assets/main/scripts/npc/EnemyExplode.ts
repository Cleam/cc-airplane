import { _decorator, Component, Node } from "cc";
import { PoolManager } from "../base/PoolManager";
const { ccclass, property } = _decorator;

@ccclass("EnemyExplode")
export class EnemyExplode extends Component {
  onEnable() {
    // 3s后回收资源
    this.scheduleOnce(() => {
      PoolManager.instance.putNode(this.node);
    }, 3);
  }

  update(deltaTime: number) {}
}
