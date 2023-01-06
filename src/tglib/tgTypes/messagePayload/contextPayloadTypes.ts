import {MESSAGE_PAYLOAD_TYPE} from "./messagePayloadTypes";
import {CallbackQuery} from "typegram";

export interface IContextPayload {

    type: MESSAGE_PAYLOAD_TYPE
}

export interface IPrivateContextPayload extends IContextPayload {
    senderId: number,
    chatId: number
}

export interface IPrivateTextPayload extends IPrivateContextPayload {
    text: string
}

export interface IPrivateCbQueryPayload extends IPrivateContextPayload {
    callback_query: CallbackQuery
}

export interface IPrivateCommandPayload extends IPrivateContextPayload {
    command: string
}

export interface IChannelContextPayload extends IContextPayload {
    // chatId: number
}

export interface IChatContextPayload extends IContextPayload {
    // chatId: number
}



export type CONTEXT_PAYLOAD_TYPE = IContextPayload | IPrivateContextPayload | IChannelContextPayload | IChatContextPayload