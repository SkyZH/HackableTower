import { Sprite, SpriteManager } from '../../../app';
import { Command } from '../../models';
import { Window_Selectable } from './window_selectable';
import { COS } from '../../util/animation/cos';
import { FONT } from '../../const';

export class Window_Command extends Window_Selectable {
  private commands_container: PIXI.Container;
  private _commands: Array<Command>;

  constructor() {
    super(new PIXI.Rectangle(0, 0, 0, 0));
    this.commands_container = new PIXI.Container();
    this.container.addChild(this.commands_container);
  }

  public set commands(commands: Array<Command>) {
    this._commands = commands;
    this.update();
  }

  public get commands(): Array<Command> {
    return this._commands;
  }

  public get height() {
    return FONT.FONT_TITLE_LINE_HEIGHT * (this._commands ? this._commands.length : 0);
  }

  private update_text() {
  }

  public update() {
    super.update();
    this.update_text();
  }

  public onInit(spriteManager: SpriteManager) {
    super.onInit(spriteManager);
  }
}
