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

  public play(sound: Howl, channel: string, overwrite?: boolean, fade?: boolean, volume?: number, loop?: boolean) {
    this._ensureChannel(channel);
    if (overwrite) {
      this.stop(channel, fade);
    }
    sound.volume(volume === null ? 1 : volume);
    sound.loop(loop === null ? false : loop);
    sound.play();
    if (fade) sound.fade(0, 1, 1000); 
    this._sound[channel].push(sound);
  }

  public stop(channel: string, fade?: boolean) {
    this._ensureChannel(channel);
    _.forEach(this._sound[channel], (sound: Howl) => {
      if (fade) {
        sound.once('fade', () => sound.stop());
        sound.fade(1, 0, 1000);
      } else sound.stop();
    });
    this._sound[channel] = [];
  }

  public playBGM(sound: Howl) {
    this.play(sound, 'bgm', true, true, 1, true);
  }

  public playME(sound: Howl) {
    this.play(sound, 'me', true, false, 1, true);
  }

  public stopBGM() {
    this.stop('bgm', false);
  }

  public playSE(sound: Howl) {
    this.play(sound, 'se', false, false, 1, false);
  }

  public stopME() {
    this.stop('me', false);
  }
};
