import { CHARACTER } from '../../const';
import { Scene } from '../../../app';

import { Tileset } from '../tileset';
import { Injector } from '../../../di';

export enum CHARACTER_STATUS {
  STOP = 0,
  WALKING,
  RUNNING
};

export enum CHARACTER_DIRECTION {
  DOWN = 0,
  LEFT = 1,
  RIGHT = 2,
  UP = 3,
  __NONE,
  __INVALID
};

export interface Character_Animation {
  status?: CHARACTER_STATUS;
  direction?: CHARACTER_DIRECTION;
  pause?: number;
}

export abstract class Character extends Tileset {

  private _character: PIXI.Sprite;
  private _status: CHARACTER_STATUS;
  private _frame: number;
  private _current_frame:  number;
  private _direction: CHARACTER_DIRECTION;
  private _ticker: PIXI.ticker.Ticker;
  private _animationStart: number;

  constructor(baseInjector: Injector) {
    super(baseInjector);
    this._ticker = this.injector.resolve(Scene).ticker;
  }

  onInit() {
    super.onInit();
    this._character = new PIXI.Sprite(this.getTile(0, 0));
    this._current_frame = 0;
    this._status = CHARACTER_STATUS.STOP;
    this._direction = CHARACTER_DIRECTION.DOWN;
    this._animationStart = 0;
    this._container.addChild(this._character);
    this._ticker.add(this.update_character);
  }

  onDestroy() {
    this._ticker.remove(this.update_character);
    this._character.destroy();
    super.onDestroy();
  }

  private update_character = () => {
    let __frame = this._direction * 4;
    if (this.status != CHARACTER_STATUS.STOP) {
      if (this._status == CHARACTER_STATUS.WALKING) {
        __frame += Math.floor((this._ticker.lastTime - this._animationStart) / CHARACTER.CHARACTER_SPRITE_SPEED_WALK) % 4;
      } else if (this.status == CHARACTER_STATUS.RUNNING) {
        __frame += Math.floor((this._ticker.lastTime - this._animationStart) / CHARACTER.CHARACTER_SPRITE_SPEED_RUN) % 4;
      }
      if (__frame != this._current_frame) {
        this._current_frame = __frame;
        this._character.texture = this.getTileID(__frame);
      }
    }
  };
  
  public get x(): number { return this._character.x; }
  public get y(): number { return this._character.y;}
  public set x(x: number) { this._character.x = x;}
  public set y(y: number) { this._character.y = y; }
  public get direction(): CHARACTER_DIRECTION { return this._direction; }
  public set direction(direction: CHARACTER_DIRECTION) { 
    this._direction = direction; 
    this._character.texture = this.getTileID(this.direction * 4);
  }
  public get status(): CHARACTER_STATUS { return this._status; }
  public set status(status: CHARACTER_STATUS) { 
    this._status = status;
    this._animationStart = this._ticker.lastTime;
    this._character.texture = this.getTileID(this.direction * 4);
    this.update_character();
  }
  public get frame() { return this._frame; }
  public set frame(frame: number) {
    this._frame = frame;
    this._character.texture = this.getTileID(this.direction * 4 + frame);
  }
}
