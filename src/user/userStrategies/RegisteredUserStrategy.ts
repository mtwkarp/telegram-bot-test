import UserStrategy from "./UserStrategy";
import {Context} from "telegraf";

class RegisteredUserStrategy extends UserStrategy {
    onCallbackQuery(ctx: Context): void {
    }

    onCmd(name: string, ctx: Context): void {
        console.log('iam registered cmd ')

    }

    onMessage(ctx: Context): void {
        console.log('iam registered msg ')

    }
}

export default RegisteredUserStrategy