import {IBotInteractionListener} from "../types/types";
import {Context} from "telegraf";
import UserStrategy from "./userStrategies/UserStrategy";
import InstructorUserStrategy from "./userStrategies/InstructorUserStrategy";

class UserScope implements IBotInteractionListener {

    private readonly id: number
    private strategy: UserStrategy

    constructor(id: number) {
        this.id = id
        this.strategy = new InstructorUserStrategy()
    }

    private init() {

    }

    setStrategies() {

    }

    onCallbackQuery(ctx: Context): void {
        this.strategy.onCallbackQuery(ctx)
    }

    onCmd(name: string, ctx: Context): void {
        this.strategy.onCmd(name, ctx)
    }

    onMessage(ctx: Context): void {
        this.strategy.onMessage(ctx)
    }
}

export default UserScope