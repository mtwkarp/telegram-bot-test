import {IBotInteractionListener} from "../types/types";
import EventEmitter from "eventemitter3";
import {Context} from "telegraf";
import CmdHandler from "./handlers/CmdHandler";
import NoneCmdHandler from "./handlers/noneCommand/NoneCmdHandler";
import {CMD_NAMES, CMD_NAME_TYPE} from "../types/commandTypes";

class CmdHandlersManager extends EventEmitter implements IBotInteractionListener {

    private readonly id: number
    //name: one of cmd_names
    protected handlers: {[name: string]: typeof CmdHandler}
    private currentHandler: CmdHandler

    constructor(userId: number, cmdHandlers: typeof CmdHandler[]) {
        super();

        this.id = userId
        this.handlers = {
            [CMD_NAMES.NONE]: NoneCmdHandler
        }
        this.currentHandler = new NoneCmdHandler(this.id)


        this.initHandlers(cmdHandlers)
    }
    private initHandlers(cmdHandlers: typeof CmdHandler[]): void {
        cmdHandlers.forEach((H) => {
            this.handlers[H.handlerName] = H
        })
    }

    private setCurrentHandler(handlerName: CMD_NAME_TYPE): void {
        this.currentHandler = new this.handlers[handlerName](this.id)
    }

    private unsetCurrentHandler(): void {
        this.currentHandler = new NoneCmdHandler(this.id)
    }
    public onCallbackQuery(ctx: Context): void {
        this.currentHandler.onCallbackQuery(ctx)
    }

    public onCmd(name: string, ctx: Context): void {
        this.currentHandler.finishCmd()
        this.currentHandler.onCmd(name, ctx)
    }

    public onMessage(ctx: Context): void {
        this.currentHandler.onMessage(ctx)
    }

}

export default CmdHandlersManager