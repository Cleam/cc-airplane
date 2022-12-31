import { _decorator, Component, Node, input, Input, EventTouch } from "cc";
import { GameManager } from "../framework/GameManager";

const { ccclass, property } = _decorator;

@ccclass("UIManager")
export class UIManager extends Component {
  @property
  public planeSpeed: number = 4;

  @property(Node)
  public playerPlane: Node | null = null;

  @property(GameManager)
  public gameManager: GameManager = null;

  start() {
    this.node.on(Input.EventType.TOUCH_START, this._touchStart, this);
    this.node.on(Input.EventType.TOUCH_MOVE, this._touchMove, this);
    this.node.on(Input.EventType.TOUCH_END, this._touchEnd, this);
  }
  update(deltaTime: number) {}

  private _touchStart() {
    this.gameManager?.isShooting(true);
  }

  private _touchEnd() {
    this.gameManager?.isShooting(false);
  }

  private _touchMove(event: EventTouch) {
    if (this.playerPlane) {
      const delta = event.getDelta();
      const { x, y, z } = this.playerPlane.position;
      this.playerPlane.setPosition(
        x + delta.x * this.planeSpeed * 0.01,
        y,
        z - delta.y * this.planeSpeed * 0.01
      );
    }
  }
}
