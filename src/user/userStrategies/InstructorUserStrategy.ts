import UserStrategy from "./UserStrategy";
import {IPrivateContextDecorator} from "../../tglib/tgTypes/contextDecoratorTypes";
import PrivateCmdHandlersManager from "../../commandHandlers/PrivateCmdHandlersManager";

class InstructorUserStrategy extends UserStrategy {
    protected cmdHandlerManager: PrivateCmdHandlersManager
    constructor(userId: number) {
        super();

        this.cmdHandlerManager = new PrivateCmdHandlersManager(userId, [])
    }
    onUpdate(context: IPrivateContextDecorator) {
        this.cmdHandlerManager.onUpdate(context)
    }
}

export default InstructorUserStrategy