import {IBotInteractionListener} from "../../types/types";
import {Context} from "telegraf";

abstract class UserStrategy implements IBotInteractionListener {

    // protected cmdHandlersManager
    // constructor() {
    // }

    initCmdHandlersManager() {

    }
    getUserCmdHandlers() {

    }
    onCallbackQuery(ctx: Context): void {
    }

    onCmd(name: string, ctx: Context): void {
    }

    onMessage(ctx: Context): void {
    }

}

export default UserStrategy