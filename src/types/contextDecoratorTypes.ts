import type {
    IPrivateContextPayload,
    CONTEXT_PAYLOAD_TYPES,
    IChannelContextPayload, IChatContextPayload
} from "./messagePayload/contextPayloadTypes";
import type {MESSAGE_PAYLOAD_TYPE} from "./messagePayload/messagePayloadTypes";
import type {Context} from "telegraf";
import type {Update} from 'typegram'
import type {BOT_UPDATE_SCOPE, CHANNEL_UPDATE_SCOPE, CHAT_UPDATE_SCOPE, PRIVATE_UPDATE_SCOPE} from "./botUpdatesScopes";
import type {CHANNEL_UPDATE_TYPE, PRIVATE_UPDATE_TYPE, SCOPE_UPDATE_TYPE, CHAT_UPDATE_TYPE} from "./botUpdatesTypes";

export interface IContextDecorator {
    payload: CONTEXT_PAYLOAD_TYPES,
    messagePayloadType: MESSAGE_PAYLOAD_TYPE,

    updateType: SCOPE_UPDATE_TYPE
    updateScope: BOT_UPDATE_SCOPE

    context: Context<Update>
}

export interface IPrivateContextDecorator extends IContextDecorator {
    payload: IPrivateContextPayload
    updateType: PRIVATE_UPDATE_TYPE
    updateScope: PRIVATE_UPDATE_SCOPE
}

export interface IChatContextDecorator extends IContextDecorator {
    payload: IChatContextPayload

    updateType: CHAT_UPDATE_TYPE
    updateScope: CHAT_UPDATE_SCOPE
}

export interface IChannelContextDecorator extends IContextDecorator {
    payload: IChannelContextPayload
    updateType: CHANNEL_UPDATE_TYPE

    updateScope: CHANNEL_UPDATE_SCOPE
}