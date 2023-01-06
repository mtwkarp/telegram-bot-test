import PayloadCreator from "./PayloadCreator";
import {PRIVATE_UPDATE_TYPES} from "../tgTypes/botUpdatesTypes";
import {
    IPrivateCbQueryPayload, IPrivateCommandPayload,
    IPrivateContextPayload,
    IPrivateTextPayload
} from "../tgTypes/messagePayload/contextPayloadTypes";
import {PRIVATE_PAYLOAD_CREATORS_HOLDER} from "../tgTypes/messagePayload/payloadCreator";
import {PAYLOAD_TYPES} from "../tgTypes/messagePayload/messagePayloadTypes";
import {Context} from "telegraf";
import {Message, Update, User} from 'typegram'
import MessageUpdate = Update.MessageUpdate;
import ContextHelper from "../../helpers/ContextHelper";
import TextMessage = Message.TextMessage;
import CallbackQueryUpdate = Update.CallbackQueryUpdate;

export default class PrivatePayloadCreator extends PayloadCreator<PRIVATE_UPDATE_TYPES, IPrivateContextPayload> {
    readonly decoratorCreatorFunctionByUpdateType: PRIVATE_PAYLOAD_CREATORS_HOLDER = {
        [PRIVATE_UPDATE_TYPES.text]: this.createTextPayload.bind(this),
        [PRIVATE_UPDATE_TYPES.callback_query]: this.createCallbackQueryPayload.bind(this),
        [PRIVATE_UPDATE_TYPES.command]: this.createCommandPayload.bind(this)
    }


    getDefaultPayload(context: Context<Update>, type: PAYLOAD_TYPES): IPrivateContextPayload {
        const message: Message = ContextHelper.getMessageField(context),
            from: User = message.from as User

        const obj: IPrivateContextPayload = {
            senderId: from.id,
            chatId: message.chat.id,
            type
        }

        return obj
    }

    protected createTextPayload(context: Context<Update>): IPrivateTextPayload {
        const defaultObj: IPrivateContextPayload = this.getDefaultPayload(context, PAYLOAD_TYPES.text)
        const message = ContextHelper.getMessageField(context) as TextMessage

        return {
            ...defaultObj,
            text: message.text
        }
    }

    protected createCallbackQueryPayload(context: Context<Update>): IPrivateCbQueryPayload {
        const defaultObj: IPrivateContextPayload = this.getDefaultPayload(context, PAYLOAD_TYPES.callback_query)
        const update = context.update as CallbackQueryUpdate

        return {
            ...defaultObj,
            callback_query: update.callback_query
        }
    }

    protected createCommandPayload(context: Context<Update>): IPrivateCommandPayload {
        const defaultObj: IPrivateContextPayload = this.getDefaultPayload(context, PAYLOAD_TYPES.command)

        return {
            ...defaultObj,
            command: 'some'
        }
    }
}