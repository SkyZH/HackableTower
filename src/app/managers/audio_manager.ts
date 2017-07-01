import { Howl } from 'howler';
import * as _ from 'lodash';

class _AudioManager {

  private _sound : { [channel: string]: Array<Howl>; };

  constructor() {
    this._sound = {};
  }

  private _ensureChannel(channel: string) {
    if (!(channel in this._sound)) {
      this._sound[channel] = [];
    }
  }

  public play(path: string, channel: string, overwrite?: boolean, fade?: boolean, options?: IHowlProperties) {
    this._ensureChannel(channel);
    if (overwrite) {
      this.stop(channel, fade);
    }
    let _sound = new Howl(options);
    _sound.play();
    if (fade) _sound.fade(0, 1, 1000); 
    this._sound[channel].push(_sound);
  }

  public stop(channel: string, fade?: boolean) {
    this._ensureChannel(channel);
    _.forEach(this._sound[channel], (sound: Howl) => {
      if (fade) {
        sound.once('fade', () => sound.unload());
        sound.fade(1, 0, 1000);
      } else sound.unload();
    });
    this._sound[channel] = [];
  }

  public playBGM(path: string) {
    this.play(path, 'bgm', true, true, { src: [path], loop: true, volume: 0.5 });
  }

  public stopBGM() {
    this.stop('bgm', true);
  }

  public playSE(path: string) {
    this.play(path, 'se', false, false, { src: [path], loop: false, volume: 1 });
  }

};

export const AudioManager = new _AudioManager;
