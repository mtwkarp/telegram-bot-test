import UserStrategy from "./UserStrategy";
import {IPrivateContextDecorator} from "../../tglib/tgTypes/contextDecoratorTypes";
import PrivateCmdHandlersManager from "../../commandHandlers/private/PrivateCmdHandlersManager";
import ScheduleCmdHandler from "../../commandHandlers/private/handlers/scheduleCommand/ScheduleCmdHandler";

class InstructorUserStrategy extends UserStrategy {
    protected cmdHandlerManager: PrivateCmdHandlersManager
    constructor(userId: number) {
        super();

        this.cmdHandlerManager = new PrivateCmdHandlersManager(userId, [ScheduleCmdHandler])
    }
    onUpdate(context: IPrivateContextDecorator) {
        this.cmdHandlerManager.onUpdate(context)
    }
}

export default InstructorUserStrategy