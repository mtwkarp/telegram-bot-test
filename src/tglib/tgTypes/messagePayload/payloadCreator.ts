import { type CHANNEL_UPDATE_TYPES, type CHAT_UPDATE_TYPES, type PRIVATE_UPDATE_TYPES, type SCOPE_UPDATE_TYPES } from '../botUpdatesTypes';
import { type Context } from 'telegraf';
import { type Update } from 'typegram';
import {type CONTEXT_PAYLOAD_TYPE, IPrivateContextPayload} from './contextPayloadTypes';
export interface IPayloadCreator {
  create(updateType: SCOPE_UPDATE_TYPES, context: Context<Update>): CONTEXT_PAYLOAD_TYPE | null

}

export type PayloadCreatorFunc<T> = (context: Context<Update>) => T

export type PRIVATE_PAYLOAD_CREATORS_HOLDER<T extends IPrivateContextPayload> = {
  [key in PRIVATE_UPDATE_TYPES]?: PayloadCreatorFunc<T>;
}

export type CHANNEL_PAYLOAD_CREATORS_HOLDER<T>  = {
  [key in CHANNEL_UPDATE_TYPES]?: PayloadCreatorFunc<T>
}

export type CHAT_PAYLOAD_CREATORS_HOLDER<T>  = {
  [key in CHAT_UPDATE_TYPES]?: PayloadCreatorFunc<T>
}

// export type DECORATOR_CREATOR_HOLDERS_TYPES = CHANNEL_PAYLOAD_CREATORS_HOLDER<any> | PRIVATE_PAYLOAD_CREATORS_HOLDER<T extends IPrivateContextPayload> | CHAT_PAYLOAD_CREATORS_HOLDER
