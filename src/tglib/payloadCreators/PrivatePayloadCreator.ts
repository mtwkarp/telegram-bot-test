import PayloadCreator from "./PayloadCreator";
import {PRIVATE_UPDATE_TYPES} from "../tgTypes/botUpdatesTypes";
import {IPrivateContextPayload} from "../tgTypes/messagePayload/contextPayloadTypes";
import {PRIVATE_PAYLOAD_CREATORS_HOLDER} from "../tgTypes/messagePayload/payloadCreator";
import {PAYLOAD_TYPES} from "../tgTypes/messagePayload/messagePayloadTypes";
import {Context} from "telegraf";
import {Update} from 'typegram'
import MessageUpdate = Update.MessageUpdate;

export default class PrivatePayloadCreator extends PayloadCreator<PRIVATE_UPDATE_TYPES, IPrivateContextPayload> {
    readonly decoratorCreatorFunctionByUpdateType: PRIVATE_PAYLOAD_CREATORS_HOLDER = {
        [PRIVATE_UPDATE_TYPES.text]: this.createTextPayload.bind(this),
        [PRIVATE_UPDATE_TYPES.callback_query]: this.createCallbackQueryPayload.bind(this),
        [PRIVATE_UPDATE_TYPES.command]: this.createCommandPayload.bind(this)
    }

    protected createTextPayload(context: Context<Update>): IPrivateContextPayload {
        const updateObj = context.update as MessageUpdate
        const message = updateObj.message

        return {
            senderId: message.from.id,
            chatId: message.chat.id,
            type: PAYLOAD_TYPES.text
        }
    }

    protected createCallbackQueryPayload(context: Context<Update>): IPrivateContextPayload {
        const updateObj = context.update as MessageUpdate
        const message = updateObj.message

        return {
            senderId: message.from.id,
            chatId: message.chat.id,
            type: PAYLOAD_TYPES.callback_query
        }
    }

    protected createCommandPayload(context: Context<Update>) {
        const updateObj = context.update as MessageUpdate
        const message = updateObj.message

        return {
            senderId: message.from.id,
            chatId: message.chat.id,
            type: PAYLOAD_TYPES.command
        }
    }
}