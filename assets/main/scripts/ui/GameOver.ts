import { _decorator, Component, Node } from "cc";
import { GameManager } from "../GameManager";
import { Global } from "../Global";
const { ccclass, property } = _decorator;

@ccclass("GameOver")
export class GameOver extends Component {
  private _gameManager: GameManager = null;
  start() {
    this._gameManager = Global.instance.gameManager.getComponent(GameManager);
  }

  // 再来一局
  public restart() {
    this._gameManager.playAudio("button");
    Global.instance.gamePage.active = true;
    Global.instance.gameOverPage.active = false;
    this._gameManager.gameStart();
  }

  // 返回主页
  public returnMain() {
    this._gameManager.playAudio("button");
    Global.instance.gameStartPage.active = true;
    Global.instance.gameOverPage.active = false;
    Global.instance.selfPlane.resetPos();
  }

  update(deltaTime: number) {}
}
