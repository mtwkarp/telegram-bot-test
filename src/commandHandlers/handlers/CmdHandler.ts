import {Context, Telegram} from "telegraf";
import {CMD_HANDLERS_EVENTS} from "../../enums/botEnums";
import EventEmitter from "eventemitter3";
import {CMD_NAME_TYPE, CMD_NAMES} from "../../types/commandTypes";
import {ICmdHandler} from "../../types/commandHandlerTypes";
import {IContextDecorator} from "../../tglib/tgTypes/contextDecoratorTypes";

abstract class CmdHandler extends EventEmitter implements ICmdHandler {

    protected readonly id: number
    protected readonly tg: Telegram
    protected _name: CMD_NAME_TYPE
    protected constructor(userId: number) {
        super()

        this.id = userId
        this.tg = new Telegram(process.env.TELEGRAM_BOT_TOKEN as string)
        this._name = CMD_NAMES.NONE
    }

    abstract copy(): CmdHandler

    get name(): CMD_NAME_TYPE {
        return this._name
    }

    onCallbackQuery(ctx: Context): void {
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

    onCommand(contextDecorator: IContextDecorator): void {
    }

    onUpdate(contextDecorator: IContextDecorator): void {
    }
}

export default CmdHandler