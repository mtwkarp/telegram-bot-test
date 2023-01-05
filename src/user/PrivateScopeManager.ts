import {CommandDescription, IBotInteractionListener} from "../types/types";
import {Context} from "telegraf";
import UserScope from "./UserScope";
import {IObserver} from "../tglib/lib/observer/observerTypes";


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
    onCallbackQuery(ctx: Context): void {
        if(ctx.from === undefined) return

        this.getUserById(ctx.from.id).onCallbackQuery(ctx)
    }

    onCmd(name: string, ctx: Context): void {
        if(ctx.from === undefined) return

        this.getUserById(ctx.from.id).onCmd(name, ctx)
    }

    onMessage(ctx: Context): void {
        if(ctx.from === undefined) return

        this.getUserById(ctx.from.id).onMessage(ctx)
    }

    onUpdate(update: any): void {
        console.log(update)
    }
}

export default PrivateScopeManager