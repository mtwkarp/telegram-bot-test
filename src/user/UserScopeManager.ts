import {CommandDescription, IBotInteractionListener} from "../types/types";
import {Context} from "telegraf";
import UserScope from "./UserScope";


class UserScopeManager implements IBotInteractionListener {

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
    onCallbackQuery(ctx: Context): void {
        // @ts-ignore
        const user = this.getUserById(ctx.from.id)

        user.onCallbackQuery(ctx)
    }

    onCmd(name: string, ctx: Context): void {
        // @ts-ignore
        const user = this.getUserById(ctx.from.id)

        user.onCmd(name, ctx)
    }
//check !
    onMessage(ctx: Context): void {
        // @ts-ignore
        const user = this.getUserById(ctx.from.id)

        user.onMessage(ctx)
    }
}

export default UserScopeManager