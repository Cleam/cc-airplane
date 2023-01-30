import { _decorator, Component, Node, Input } from "cc";
import { AudioManager } from "../base/AudioManager";
import { Global } from "../Global";
const { ccclass, property } = _decorator;

@ccclass("Volume")
export class Volume extends Component {
  private _audioManager: AudioManager = null;
  private _volume: Node = null;
  private _mute: Node = null;
  start() {
    this._audioManager =
      Global.instance.audioManager.getComponent(AudioManager);
    this._volume = Global.instance.volumeWrap.getChildByName("volume");
    this._mute = Global.instance.volumeWrap.getChildByName("mute");
    this.node
      .getChildByName("volume")
      .on(Input.EventType.TOUCH_END, this.stop, this);
    this.node
      .getChildByName("mute")
      .on(Input.EventType.TOUCH_END, this.music, this);
  }

  // 播放声音
  public music() {
    this._audioManager.music();
    this._volume.active = true;
    this._mute.active = false;
  }

  // 静音
  public stop() {
    this._audioManager.stop();
    this._volume.active = false;
    this._mute.active = true;
  }

  update(deltaTime: number) {}
}
