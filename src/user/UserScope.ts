import UserStrategy from "./userStrategies/UserStrategy";
import InstructorUserStrategy from "./userStrategies/InstructorUserStrategy";
import {UserPrivateScope} from "../types/types";
import {IPrivateContextDecorator} from "../tglib/tgTypes/contextDecoratorTypes";

class UserScope implements UserPrivateScope {

    private readonly id: number
    private strategy: UserStrategy

    constructor(id: number) {
        this.id = id
        this.strategy = new InstructorUserStrategy(id)
    }
    onUpdate(context: IPrivateContextDecorator) {
        this.strategy.onUpdate(context)
    }
}

export default UserScope