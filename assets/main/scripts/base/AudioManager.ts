import { _decorator, Component, AudioClip, AudioSource } from "cc";
const { ccclass, property } = _decorator;

interface IAudioClip {
  [name: string]: AudioClip;
}

@ccclass("AudioManager")
export class AudioManager extends Component {
  @property([AudioClip])
  public audioList: AudioClip[] = [];

  private _dict: IAudioClip = {};

  private _bgmSource: AudioSource = null;

  private _audioSource: AudioSource = null;

  // 停止音乐
  private _stop = false;

  start() {
    for (let i = 0; i < this.audioList.length; i++) {
      const audioClip = this.audioList[i];
      this._dict[audioClip.name] = audioClip;
    }
    this._bgmSource = this.node.parent
      .getChildByName("bgm")
      .getComponent(AudioSource);
    this._audioSource = this.getComponent(AudioSource);
  }

  public play(name: string) {
    const audioClip = this._dict[name];
    if (audioClip && !this._stop) {
      this._audioSource.playOneShot(audioClip);
    }
  }

  public music() {
    // 播放背景音乐
    this._bgmSource.play();
    this._stop = false;
  }

  // 静音
  public stop() {
    // 停止背景音乐
    this._bgmSource.stop();
    this._stop = true;
  }

  update(deltaTime: number) {}
}
