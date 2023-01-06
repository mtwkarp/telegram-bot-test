import EventEmitter from "eventemitter3";
import PrivateCmdHandler from "./handlers/PrivateCmdHandler";
import NoneCmdHandler from "./handlers/noneCommand/NoneCmdHandler";
import {CMD_NAME_TYPE} from "../types/commandTypes";
import {IPrivateCmdHandler} from "../types/commandHandlerTypes";
import {IContextDecorator, IPrivateContextDecorator} from "../tglib/tgTypes/contextDecoratorTypes";

class PrivateCmdHandlersManager extends EventEmitter implements IPrivateCmdHandler {

    private readonly id: number
    //name: one of cmd_names
    protected handlers: {[name: string]: PrivateCmdHandler}
    private currentHandler: PrivateCmdHandler

    constructor(userId: number, cmdHandlers:  Array<{new(userId: number): PrivateCmdHandler}>) {
        super();

        this.id = userId
        this.handlers = {

        }
        this.currentHandler = new NoneCmdHandler(this.id)

        this.initHandlers(cmdHandlers)
    }
    private initHandlers(cmdHandlers: Array<{new(userId: number): PrivateCmdHandler}>): void {
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

    onUpdate(contextDecorator: IPrivateContextDecorator) {
        this.currentHandler.onUpdate(contextDecorator)
    }

    onCommand(contextDecorator: IContextDecorator) {
        // this.currentHandler.onCommand(contextDecorator)
    }
}

export default PrivateCmdHandlersManager