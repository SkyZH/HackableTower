import { Howl } from 'howler';
import { Injector, Injectable } from '../../di';
import * as _ from 'lodash';

export class AudioManager extends Injectable {

  private _sound : { [channel: string]: Array<Howl>; };

  constructor(baseInjector: Injector) {
    super(baseInjector);
    this.injector.provide(AudioManager, this);
    
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
    this.play(path, 'bgm', true, true, { src: [path], loop: true, volume: 1 });
  }

  public stopBGM() {
    this.stop('bgm', true);
  }

  public playSE(path: string) {
    this.play(path, 'se', false, false, { src: [path], loop: false, volume: 1 });
  }

};
