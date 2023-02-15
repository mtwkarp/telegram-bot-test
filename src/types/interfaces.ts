import { type Markup } from 'telegraf';
import { type InlineKeyboardMarkup, Message, type ReplyKeyboardMarkup } from 'telegraf/src/core/types/typegram';
import TextMessage = Message.TextMessage

export interface DefaultCmdHandler {
  sendNotAvailableCmdMessage: () => void
}

export interface ITimeAccessController {
  init: () => void
  readonly accessible: boolean
}

export interface IMarkupViewCreator {
  getDefaultMarkup: (parameters: any, options: any) => Markup.Markup<InlineKeyboardMarkup | ReplyKeyboardMarkup>
}

export interface ITgMessageResponder {
  sendMessage: (msg: string) => Promise<TextMessage>
}
