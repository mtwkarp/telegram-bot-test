import {CommandsDictionary, CommandDescription} from "./commandTypes";
import {Context} from "telegraf";

interface IBotInteractionListener {
    onCallbackQuery(ctx: Context): void;
    onMessage(ctx: Context, next?: Function): void;
    onCmd(name: string, ctx: Context): void
}

export {
    IBotInteractionListener,
    CommandsDictionary,
    CommandDescription
}