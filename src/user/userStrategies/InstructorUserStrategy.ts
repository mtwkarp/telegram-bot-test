import UserStrategy from "./UserStrategy";
import {IPrivateContextDecorator} from "../../tglib/tgTypes/contextDecoratorTypes";
import PrivateCmdHandlersManager from "../../commandHandlers/private/PrivateCmdHandlersManager";
import ScheduleCmdHandler from "../../commandHandlers/private/handlers/scheduleCommand/ScheduleCmdHandler";
import CommandsInfoHandler from "../../commandHandlers/private/handlers/ infoCommand/CommandsInfoCmdHandler";
import StartCmdHandler from "../../commandHandlers/private/handlers/startCommand/StartCmdHandler";

class InstructorUserStrategy extends UserStrategy {
    protected cmdHandlerManager: PrivateCmdHandlersManager
    constructor(userId: number) {
        super();

        this.cmdHandlerManager = new PrivateCmdHandlersManager(userId, [
            ScheduleCmdHandler,
            CommandsInfoHandler,
            StartCmdHandler
        ])
    }
    onUpdate(context: IPrivateContextDecorator) {
        this.cmdHandlerManager.onUpdate(context)
    }
}

export default InstructorUserStrategy