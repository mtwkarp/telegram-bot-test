import {Markup} from "telegraf";
import {InlineKeyboardMarkup, ReplyKeyboardMarkup} from "telegraf/src/core/types/typegram";
import {IPrivateContextDecorator} from "../tglib/tgTypes/contextDecoratorTypes";

export interface DefaultCmdHandler {
    sendNotAvailableCmdMessage(): void
}

export interface ITimeAccessController {
    init(): void,
    readonly accessible: boolean
}

export interface IMarkupViewCreator {
    getMarkup(parameters: any, options: any): Markup.Markup<InlineKeyboardMarkup | ReplyKeyboardMarkup>
}
