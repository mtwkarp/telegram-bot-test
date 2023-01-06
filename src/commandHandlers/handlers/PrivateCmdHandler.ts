import {Telegram} from "telegraf";
import {CMD_HANDLERS_EVENTS} from "../../enums/botEnums";
import EventEmitter from "eventemitter3";
import {CMD_NAME_TYPE, CMD_NAMES} from "../../types/commandTypes";
import {IPrivateContextDecorator} from "../../tglib/tgTypes/contextDecoratorTypes";
import {PRIVATE_UPDATE_TYPES} from "../../tglib/tgTypes/botUpdatesTypes";

abstract class PrivateCmdHandler extends EventEmitter {

    protected readonly id: number
    protected readonly tg: Telegram
    protected _name: CMD_NAME_TYPE
    protected readonly updateTypesImplementations: {
        [key in PRIVATE_UPDATE_TYPES]: (contextDecorator: IPrivateContextDecorator) => void
    }
    protected constructor(userId: number) {
        super()

        this.id = userId
        this.tg = new Telegram(process.env.TELEGRAM_BOT_TOKEN as string)
        this._name = CMD_NAMES.NONE
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
            [PRIVATE_UPDATE_TYPES.command]: this.onCommand.bind(this),
        }
    }

    abstract copy(): PrivateCmdHandler

    get name(): CMD_NAME_TYPE {
        return this._name
    }


    async sendMessage(message: string): Promise<void> {
        await this.tg.sendMessage(this.id.toString(), message)
    }

    public finishCmd(): void {
    }

    protected notifyAboutCmdFinish(): void {
        this.finishCmd()
        this.emit(CMD_HANDLERS_EVENTS.FINISH)
    }

    protected static readonly _name: CMD_NAME_TYPE = CMD_NAMES.NONE

    static get handlerName():CMD_NAME_TYPE {
        return this._name
    }

    onUpdate(contextDecorator: IPrivateContextDecorator): void {
        this.updateTypesImplementations[contextDecorator.updateType](contextDecorator)
    }
    protected onCommand(contextDecorator: IPrivateContextDecorator): void {
        this.noImplementationFound(contextDecorator)
    }
    protected onCallbackQuery(contextDecorator: IPrivateContextDecorator): void {
        this.noImplementationFound(contextDecorator)
    }

    private noImplementationFound(contextDecorator: IPrivateContextDecorator): void {
        console.log(`Update type is ${contextDecorator.updateType}, but no implementation in current handler (handler name - ${this.name}) found.`)
        console.log(contextDecorator.payload)
    }

    protected onText(contextDecorator: IPrivateContextDecorator): void {
        this.noImplementationFound(contextDecorator)
    }

    protected onAnimation(contextDecorator: IPrivateContextDecorator): void {
        this.noImplementationFound(contextDecorator)
    }

    protected onAudio(contextDecorator: IPrivateContextDecorator): void {
        this.noImplementationFound(contextDecorator)
    }

    protected onDocument(contextDecorator: IPrivateContextDecorator): void {
        this.noImplementationFound(contextDecorator)
    }

    protected onPhoto(contextDecorator: IPrivateContextDecorator): void {
        this.noImplementationFound(contextDecorator)
    }

    protected onSticker(contextDecorator: IPrivateContextDecorator): void {
        this.noImplementationFound(contextDecorator)
    }

    protected onVideo(contextDecorator: IPrivateContextDecorator): void {
        this.noImplementationFound(contextDecorator)
    }

    protected onVideoNote(contextDecorator: IPrivateContextDecorator): void {
        this.noImplementationFound(contextDecorator)
    }

    protected onVoice(contextDecorator: IPrivateContextDecorator): void {
        this.noImplementationFound(contextDecorator)
    }

    protected onEditedMessage(contextDecorator: IPrivateContextDecorator): void {
        this.noImplementationFound(contextDecorator)
    }
}

export default PrivateCmdHandler