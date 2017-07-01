import { Sprite, SpriteManager } from '../../../app';
import { Command } from '../../models';
import { Window_Selectable } from './window_selectable';
import { COS } from '../../util/animation/cos';
import { FONT, WINDOW } from '../../const';
import * as _ from 'lodash';

export class Window_Command extends Window_Selectable {
  private commands_container: PIXI.Container;
  private _style: PIXI.TextStyle;
  private selected: number;

  constructor(protected _commands: Array<Command>) {
    super(new PIXI.Rectangle(0, 0, 0, 0));
    this.commands_container = new PIXI.Container();
    this.container.addChild(this.commands_container);
    this._style = new PIXI.TextStyle({
      fontFamily: 'Noto Serif CJK SC Medium',
      fill: '#ffffff',
      fontSize: FONT.FONT_SIZE_TITLE
    });
    this.selected = 0;
    this.container.interactive = true;
  }

  public set commands(commands: Array<Command>) {
    this._commands = commands;
    this.update();
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

  private update_command() {
    if (this.selected != -1) {
      this.selectBound = new PIXI.Rectangle(
        WINDOW.WINDOW_MARGIN_X,
        this.selected * (FONT.FONT_TITLE_LINE_HEIGHT + WINDOW.WINDOW_COMMAND_MARGIN) + WINDOW.WINDOW_MARGIN_Y,
        this.width - 2 * WINDOW.WINDOW_MARGIN_X,
        FONT.FONT_TITLE_LINE_HEIGHT
      );
    } else {
      this.selectBound = null;
    }
  }

  public update() {
    this.update_command();
    super.update();
    this.update_text();
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
      this.update_command();
    }
  }

  public onInit(spriteManager: SpriteManager) {
    super.onInit(spriteManager);
    this.container.on('mousemove', (e: PIXI.interaction.InteractionEvent) => {
      this.check_pos(e.data.global);
    });
    this.container.on('pointerdown', (e: PIXI.interaction.InteractionEvent) => {
      this.check_pos(e.data.global);
      let cb = this._commands[this.selected].cb;
      if (cb) cb();
    });
  }
}
