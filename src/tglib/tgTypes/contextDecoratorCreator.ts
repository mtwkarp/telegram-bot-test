import {CHANNEL_UPDATE_TYPES, CHAT_UPDATE_TYPES, PRIVATE_UPDATE_TYPES, SCOPE_UPDATE_TYPES} from "./botUpdatesTypes";
import {Context} from "telegraf";
import {Update} from 'typegram'
import {IContextDecorator, IEmptyContext} from "./contextDecoratorTypes";
import {CONTEXT_PAYLOAD_TYPE, IContextPayload} from "./messagePayload/contextPayloadTypes";

export interface IContextDecoratorCreator<U extends SCOPE_UPDATE_TYPES> {
    createDecorator(updateType: U, context: Context<Update>): IContextDecorator | null
}

