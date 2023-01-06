import UserStrategy from "./UserStrategy";
import {IPrivateContextDecorator} from "../../tglib/tgTypes/contextDecoratorTypes";
import CmdHandlersManager from "../../commandHandlers/CmdHandlersManager";

class InstructorUserStrategy extends UserStrategy {
    protected cmdHandlerManager: CmdHandlersManager
    constructor(userId: number) {
        super();

        this.cmdHandlerManager = new CmdHandlersManager(userId, [])
    }
    onUpdate(context: IPrivateContextDecorator) {
        this.cmdHandlerManager.onUpdate(context)
    }
}

export default InstructorUserStrategy