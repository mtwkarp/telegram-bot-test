import EventEmitter from "eventemitter3";
import CmdHandler from "./handlers/CmdHandler";
import NoneCmdHandler from "./handlers/noneCommand/NoneCmdHandler";
import {CMD_NAME_TYPE} from "../types/commandTypes";
import {ICmdHandler} from "../types/commandHandlerTypes";
import {IContextDecorator} from "../tglib/tgTypes/contextDecoratorTypes";

class CmdHandlersManager extends EventEmitter implements ICmdHandler {

    private readonly id: number
    //name: one of cmd_names
    protected handlers: {[name: string]: ICmdHandler}
    private currentHandler: ICmdHandler

    constructor(userId: number, cmdHandlers:  Array<{new(userId: number): CmdHandler}>) {
        super();

        this.id = userId
        this.handlers = {

        }
        this.currentHandler = new NoneCmdHandler(this.id)

        this.initHandlers(cmdHandlers)
    }
    private initHandlers(cmdHandlers: Array<{new(userId: number): CmdHandler}>): void {
        cmdHandlers.forEach((Handler) => {
            const instance = new Handler(this.id)
            this.handlers[instance.name] = instance
        })
    }

    private setCurrentHandler(handlerName: CMD_NAME_TYPE): void {
        // this.currentHandler = this.handlers[handlerName].copy()
    }

    private unsetCurrentHandler(): void {
        this.currentHandler = new NoneCmdHandler(this.id)
    }

    onUpdate(contextDecorator: IContextDecorator) {
        this.currentHandler.onUpdate(contextDecorator)
    }

    onCommand(contextDecorator: IContextDecorator) {
        this.currentHandler.onCommand(contextDecorator)
    }
}

export default CmdHandlersManager