import { Sprite, SpriteManager, AudioManager, ResourceManager, PRELOAD_RESOURCE } from '../../../app';
import { Injector } from '../../../di';
import { Command } from '../../models';
import { Window_Selectable } from './window_selectable';
import { COS } from '../../util/animation/cos';
import { FONT, WINDOW } from '../../const';
import * as _ from 'lodash';

@PRELOAD_RESOURCE({
  sound: ['menu-navigation.mp3']
})
export class Window_Command extends Window_Selectable {
  protected resourceManager: ResourceManager;
  protected audioManager: AudioManager;

  private commands_container: PIXI.Container;
  private _style: PIXI.TextStyle;
  private selected: number;
  protected _commands: Array<Command>;

  constructor(baseInjector: Injector) {
    super(baseInjector);

    this.audioManager = this.injector.resolve(AudioManager);
    this.resourceManager = this.injector.resolve(ResourceManager);

    this._commands = [];
    this.commands_container = new PIXI.Container();

    this._style = new PIXI.TextStyle({
      fontFamily: FONT.FONT_FAMILY_TITLE,
      fill: '#ffffff',
      fontSize: FONT.FONT_SIZE_TITLE
    });
    this.selected = -1;
  }

  public set commands(commands: Array<Command>) {
    this._commands = commands;
    this.baseSet('height', this.height);
    this.update_text();
    this.selected = -1;
    this.update_selection();
  }

  public get commands(): Array<Command> {
    return this._commands;
  }

  public get height() {
    return (FONT.FONT_TITLE_LINE_HEIGHT + WINDOW.WINDOW_COMMAND_MARGIN) * (this._commands ? this._commands.length : 0) +  WINDOW.WINDOW_MARGIN_Y * 2 - WINDOW.WINDOW_COMMAND_MARGIN;
  }

  private get_text(text: string, pos: number) {
    const commandText = new PIXI.Text(text, this._style);
    commandText.x = this.x + WINDOW.WINDOW_MARGIN_X + WINDOW.WINDOW_COMMAND_PADDING_X;
    commandText.y = this.y + pos * (FONT.FONT_TITLE_LINE_HEIGHT + WINDOW.WINDOW_COMMAND_MARGIN) + WINDOW.WINDOW_MARGIN_Y;
    return commandText;
  }

  private update_text() {
    this.commands_container.removeChildren();
    _.forEach(this._commands, (command: Command, index) => {
      this.commands_container.addChild(this.get_text(command.name, index));
    });
  }

  private update_selection() {
    if (this.selected != -1) {
      this.setSelectBound(new PIXI.Rectangle(
        WINDOW.WINDOW_MARGIN_X,
        this.selected * (FONT.FONT_TITLE_LINE_HEIGHT + WINDOW.WINDOW_COMMAND_MARGIN) + WINDOW.WINDOW_MARGIN_Y,
        this.width - 2 * WINDOW.WINDOW_MARGIN_X,
        FONT.FONT_TITLE_LINE_HEIGHT
      ));
    } else {
      this.setSelectBound(null);
    }
  }

  private _check_pos(pos: any): number {
    let __sel: number = -1;
    if (pos.x >= this.x && pos.x <= this.x + this.width) {
      if (pos.y >= this.y && pos.y <= this.y + this.height) {
        __sel = Math.floor((pos.y - this.y - WINDOW.WINDOW_MARGIN_Y) / (FONT.FONT_TITLE_LINE_HEIGHT + WINDOW.WINDOW_COMMAND_MARGIN));
        if (__sel >= this._commands.length) __sel = this._commands.length - 1;
        if (__sel < 0) __sel = 0;
      }
    }
    return __sel;
  }

  private check_pos(pos: any) {
    let __sel: number = this._check_pos(pos);
    if (__sel != this.selected) {
      this.selected = __sel;
      this.update_selection();
      if (__sel != -1) this.audioManager.playSE(this.resourceManager.Sound('menu-navigation.mp3'));
    }
  }

  public onInit() {
    super.onInit();

    this._container.interactive = true;
    
    this._container.addChild(this.commands_container);

    this._container.on('mousemove', (e: PIXI.interaction.InteractionEvent) => {
      this.check_pos(e.data.global);
    });
    this._container.on('pointerdown', (e: PIXI.interaction.InteractionEvent) => {
      this.check_pos(e.data.global);
      let cb = this._commands[this.selected].cb;
      if (cb) cb();
    });
    this.update_text();
    this.update_selection();
  }

  public onDestroy() {
    this._container.interactive = false;
    this._container.removeChild(this.commands_container);
    this.commands_container.destroy(true);
    super.onDestroy();
  }

  public setBound(_bound: PIXI.Rectangle) { 
    super.setBound(_bound);
    this.update_text();
    this.update_selection();
  }

  public set x(x: number) {
    this.baseSet('x', x);
    this.update_text();
    this.update_selection();
  }
  public set y(y: number) {
    this.baseSet('y', y);
    this.update_text();
    this.update_selection();
  }
  
  public set width(width: number) {
    this.baseSet('width', width);
    this.update_text();
    this.update_selection();
  }
  
  public set height(height: number) { throw new Error('command window height not settable'); }

  public get x(): number { return this.baseGet('x'); }
  public get y(): number { return this.baseGet('y'); }
  public get width(): number { return this.baseGet('width'); }
}
