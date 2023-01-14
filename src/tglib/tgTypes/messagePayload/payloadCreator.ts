import {CHANNEL_UPDATE_TYPES, CHAT_UPDATE_TYPES, PRIVATE_UPDATE_TYPES, SCOPE_UPDATE_TYPES} from "../botUpdatesTypes";
import {Context} from "telegraf";
import {Update} from "typegram";
import {CONTEXT_PAYLOAD_TYPE} from "./contextPayloadTypes";
export interface IPayloadCreator {
    create(updateType: SCOPE_UPDATE_TYPES, context: Context<Update>): CONTEXT_PAYLOAD_TYPE | null,

}

type PayloadCreatorFunc = (context: Context<Update>) => CONTEXT_PAYLOAD_TYPE

export type PRIVATE_PAYLOAD_CREATORS_HOLDER = {
    [key in PRIVATE_UPDATE_TYPES]?: PayloadCreatorFunc;
};

export type CHANNEL_PAYLOAD_CREATORS_HOLDER = {
    [key in CHANNEL_UPDATE_TYPES]?: PayloadCreatorFunc
}

export type CHAT_PAYLOAD_CREATORS_HOLDER = {
    [key in CHAT_UPDATE_TYPES]?:  PayloadCreatorFunc
}

export type DECORATOR_CREATOR_HOLDERS_TYPES = CHANNEL_PAYLOAD_CREATORS_HOLDER | PRIVATE_PAYLOAD_CREATORS_HOLDER | CHAT_PAYLOAD_CREATORS_HOLDER