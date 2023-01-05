import {Context} from "telegraf";
import UserStrategy from "./userStrategies/UserStrategy";
import InstructorUserStrategy from "./userStrategies/InstructorUserStrategy";
import {UserPrivateScope} from "../types/types";
import {Update} from "typegram";
import {IContextDecorator, IPrivateContextDecorator} from "../tglib/tgTypes/contextDecoratorTypes";

class UserScope implements UserPrivateScope {

    private readonly id: number
    private strategy: UserStrategy

    constructor(id: number) {
        this.id = id
        this.strategy = new InstructorUserStrategy(id)
    }

    private init() {

    }

    onUpdate(context: IPrivateContextDecorator) {
        this.strategy.onUpdate(context)
    }

}

export default UserScope