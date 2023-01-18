import EventEmitter from "eventemitter3";
import PrivateCmdHandler from "./PrivateCmdHandler";
import NoneCmdHandler from "./handlers/noneCommand/NoneCmdHandler";
import {IPrivateCmdHandler} from "../../types/commandHandlerTypes";
import {IPrivateContextDecorator} from "../../tglib/tgTypes/contextDecoratorTypes";
import {PRIVATE_UPDATE_TYPES} from "../../tglib/tgTypes/botUpdatesTypes";
import {DefaultCmdHandler} from "../../types/types";
import {IPrivateCommandPayload} from "../../tglib/tgTypes/messagePayload/contextPayloadTypes";

class PrivateCmdHandlersManager extends EventEmitter implements IPrivateCmdHandler {

    private readonly id: number
    //name: one of cmd_names
    private readonly handlers: {[name: string]: PrivateCmdHandler}
    private currentHandler: PrivateCmdHandler
    private readonly defaultHandler: PrivateCmdHandler & DefaultCmdHandler
    constructor(userId: number, cmdHandlers:  Array<{new(userId: number): PrivateCmdHandler}>) {
        super();

        this.id = userId
        this.handlers = {}
        this.defaultHandler = new NoneCmdHandler(this.id)

        this.setDefaultHandler()
        this.initHandlers(cmdHandlers)
    }
    private initHandlers(cmdHandlers: Array<{new(userId: number): PrivateCmdHandler}>): void {
        cmdHandlers.forEach((Handler) => {
            const instance = new Handler(this.id)
            this.handlers[instance.name] = instance
        })
    }

    private setCurrentHandler(handlerName: string, contextDecorator: IPrivateContextDecorator): void {
        this.currentHandler = this.handlers[handlerName].copy()
        this.currentHandler.onUpdate(contextDecorator)
    }

    private setDefaultHandler(): void {
        this.currentHandler = this.defaultHandler
    }

    onUpdate(contextDecorator: IPrivateContextDecorator): void {
        if(contextDecorator.updateType === PRIVATE_UPDATE_TYPES.command) {
            this.onCommand(contextDecorator)

            return
        }

        this.currentHandler.onUpdate(contextDecorator)
    }

    onCommand(contextDecorator: IPrivateContextDecorator): void {
        const payload = contextDecorator.payload as IPrivateCommandPayload
        const handler: undefined | PrivateCmdHandler = this.findHandlerByName(payload.command)

        if(handler === undefined) {
            this.noCommandHandlerAvailable()

            return
        }

        this.setCurrentHandler(payload.command, contextDecorator)
    }

    private noCommandHandlerAvailable() {
        this.currentHandler.finishCmd()
        this.setDefaultHandler()
        this.defaultHandler.sendNotAvailableCmdMessage()
    }

    private findHandlerByName(cmdName: string): PrivateCmdHandler | undefined {
        return this.handlers[cmdName]
    }
}

export default PrivateCmdHandlersManager