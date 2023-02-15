import { Telegram } from 'telegraf';
import { type IPrivateContextDecorator } from '../../tglib/tgTypes/contextDecoratorTypes';
import { PRIVATE_UPDATE_TYPES } from '../../tglib/tgTypes/botUpdatesTypes';
import PrivateUpdateHandler from '../../tglib/scopeUpdateHandlers/PrivateUpdateHandler';

abstract class PrivateCmdHandler extends PrivateUpdateHandler {
  protected readonly id: number;
  protected readonly tg: Telegram;
  protected readonly _name: string;
  protected readonly updateTypesImplementations: {
    [key in PRIVATE_UPDATE_TYPES]?: (contextDecorator: IPrivateContextDecorator) => void
  };

  protected constructor(userId: number, cmdName: string) {
    super();

    this.id = userId;
    this.tg = new Telegram(process.env.TELEGRAM_BOT_TOKEN as string);
    this._name = cmdName;
    this.updateTypesImplementations = {
      [PRIVATE_UPDATE_TYPES.text]: this.onText.bind(this),
      [PRIVATE_UPDATE_TYPES.callback_query]: this.onCallbackQuery.bind(this),
      [PRIVATE_UPDATE_TYPES.animation]: this.onAnimation.bind(this),
      [PRIVATE_UPDATE_TYPES.audio]: this.onAudio.bind(this),
      [PRIVATE_UPDATE_TYPES.document]: this.onDocument.bind(this),
      [PRIVATE_UPDATE_TYPES.photo]: this.onPhoto.bind(this),
      [PRIVATE_UPDATE_TYPES.sticker]: this.onSticker.bind(this),
      [PRIVATE_UPDATE_TYPES.video]: this.onVideo.bind(this),
      [PRIVATE_UPDATE_TYPES.video_note]: this.onVideoNote.bind(this),
      [PRIVATE_UPDATE_TYPES.voice]: this.onVoice.bind(this),
      [PRIVATE_UPDATE_TYPES.edited_message]: this.onEditedMessage.bind(this),
      [PRIVATE_UPDATE_TYPES.command]: this.onCommand.bind(this)
    };
  }

  abstract copy (): PrivateCmdHandler

  get name(): string {
    return this._name;
  }

  async sendMessage(message: string): Promise<void> {
    await this.tg.sendMessage(this.id.toString(), message);
  }

  public finishCmd(): void {}

  protected notifyAboutCmdFinish(): void {
    this.finishCmd();
  }

  onUpdate(contextDecorator: IPrivateContextDecorator): void {
    if (this.updateTypesImplementations[contextDecorator.updateType] === undefined) {
      this.updateNotSupported(contextDecorator.updateType);

      return;
    }

    // @ts-expect-error nonsense, look up
    this.updateTypesImplementations[contextDecorator.updateType](contextDecorator);
  }

  protected updateNotSupported(updateType: PRIVATE_UPDATE_TYPES): void {
    console.log(`Update ${updateType} not supported`);
  }

  protected override onCommand(contextDecorator: IPrivateContextDecorator): void {
    this.noImplementationFound(contextDecorator);
  }

  protected override onCallbackQuery(contextDecorator: IPrivateContextDecorator): void {
    this.noImplementationFound(contextDecorator);
  }

  private noImplementationFound(contextDecorator: IPrivateContextDecorator): void {
    console.log(`Update type is ${contextDecorator.updateType}, but no implementation in current handler (handler name - ${this.name}) found.`);
    // console.log(contextDecorator.payload)
  }

  protected override onText(contextDecorator: IPrivateContextDecorator): void {
    this.noImplementationFound(contextDecorator);
  }

  protected override onAnimation(contextDecorator: IPrivateContextDecorator): void {
    this.noImplementationFound(contextDecorator);
  }

  protected override onAudio(contextDecorator: IPrivateContextDecorator): void {
    this.noImplementationFound(contextDecorator);
  }

  protected override onDocument(contextDecorator: IPrivateContextDecorator): void {
    this.noImplementationFound(contextDecorator);
  }

  protected override onPhoto(contextDecorator: IPrivateContextDecorator): void {
    this.noImplementationFound(contextDecorator);
  }

  protected override onSticker(contextDecorator: IPrivateContextDecorator): void {
    this.noImplementationFound(contextDecorator);
  }

  protected override onVideo(contextDecorator: IPrivateContextDecorator): void {
    this.noImplementationFound(contextDecorator);
  }

  protected override onVideoNote(contextDecorator: IPrivateContextDecorator): void {
    this.noImplementationFound(contextDecorator);
  }

  protected override onVoice(contextDecorator: IPrivateContextDecorator): void {
    this.noImplementationFound(contextDecorator);
  }

  protected override onEditedMessage(contextDecorator: IPrivateContextDecorator): void {
    this.noImplementationFound(contextDecorator);
  }
}

export default PrivateCmdHandler;
