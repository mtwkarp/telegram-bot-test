import UserScope from "./UserScope";
import {IObserver} from "../tglib/lib/observer/observerTypes";
import {IContextDecorator, IPrivateContextDecorator} from "../tglib/tgTypes/contextDecoratorTypes";

class PrivateScopeManager implements IObserver {

    protected users: {
        [userId: number]: UserScope
    }
    constructor() {
        this.users = {}
    }
    private getUserById(userId: number): UserScope {
        let user: UserScope | undefined = this.users[userId]

        if(user === undefined) user = this.createUserScope(userId)

        return user
    }

    private createUserScope(userId: number): UserScope {
        const newUser = new UserScope(userId)

        this.users[userId] = newUser

        return newUser
    }

    onUpdate(ctxDecorator: IPrivateContextDecorator): void {
        const user: UserScope = this.getUserById(ctxDecorator.payload.senderId)

        user.onUpdate(ctxDecorator)
    }
}

export default PrivateScopeManager