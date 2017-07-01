import { Howl } from 'howler';

class _AudioManager {

  private _sound : Howl;
  constructor() {
    this._sound = null;
  }

  public play(path: string) {
    if (this._sound) {
      this._sound.stop();
    }
    this._sound = new Howl({
      src: [path],
      autoplay: true,
      loop: true,
      volume: 1,
    });
  }

  public stop() {
    if (this._sound) {
      this._sound.stop();
      this._sound = null;
    }
  }
};

export const AudioManager = new _AudioManager;
