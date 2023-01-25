import {Markup} from "telegraf";
import {InlineKeyboardMarkup, Message, ReplyKeyboardMarkup} from "telegraf/src/core/types/typegram";
import {IPrivateContextDecorator} from "../tglib/tgTypes/contextDecoratorTypes";
import TextMessage = Message.TextMessage;

export interface DefaultCmdHandler {
    sendNotAvailableCmdMessage(): void
}

export interface ITimeAccessController {
    init(): void,
    readonly accessible: boolean
}

export interface IMarkupViewCreator {
    getDefaultMarkup(parameters: any, options: any): Markup.Markup<InlineKeyboardMarkup | ReplyKeyboardMarkup>
}

export interface ITgMessageResponder {
    sendMessage(msg: string): Promise<TextMessage>
}
