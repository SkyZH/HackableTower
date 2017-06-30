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
    this._select = new PIXI.Rectangle(
      WINDOW.WINDOW_MARGIN_X,
      this.selected * (FONT.FONT_TITLE_LINE_HEIGHT + WINDOW.WINDOW_COMMAND_MARGIN) + WINDOW.WINDOW_MARGIN_Y,
      this.width - 2 * WINDOW.WINDOW_MARGIN_X,
      FONT.FONT_TITLE_LINE_HEIGHT
    );
    console.log(this._select);
  }

  public update() {
    this.update_command();
    super.update();
    this.update_text();
  }

  public onInit(spriteManager: SpriteManager) {
    super.onInit(spriteManager);
  }
}
