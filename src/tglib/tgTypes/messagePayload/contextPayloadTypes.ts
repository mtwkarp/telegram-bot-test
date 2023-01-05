import {MESSAGE_PAYLOAD_TYPE} from "./messagePayloadTypes";

export interface IContextPayload {
    chatId: number,
    type: MESSAGE_PAYLOAD_TYPE
}

export interface IPrivateContextPayload extends IContextPayload {
    senderId: number,
}

export interface IChannelContextPayload extends IContextPayload {
    // chatId: number
}

export interface IChatContextPayload extends IContextPayload {
    // chatId: number
}



export type CONTEXT_PAYLOAD_TYPE = IContextPayload | IPrivateContextPayload | IChannelContextPayload | IChatContextPayload