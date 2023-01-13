import { _decorator, Component, Node, AudioClip, AudioSource } from "cc";
const { ccclass, property } = _decorator;

interface IAudioClip {
  [name: string]: AudioClip;
}

@ccclass("AudioManager")
export class AudioManager extends Component {
  @property([AudioClip])
  public audioList: AudioClip[] = [];

  private _dict: IAudioClip = {};

  private _audioSource: AudioSource = null;

  start() {
    for (let i = 0; i < this.audioList.length; i++) {
      const audioClip = this.audioList[i];
      this._dict[audioClip.name] = audioClip;
    }
    this._audioSource = this.getComponent(AudioSource);
  }

  public play(name: string) {
    const audioClip = this._dict[name];
    if (audioClip) {
      this._audioSource.playOneShot(audioClip);
    }
  }

  update(deltaTime: number) {}
}
