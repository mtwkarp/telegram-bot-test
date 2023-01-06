import PayloadCreator from "./PayloadCreator";
import {PRIVATE_UPDATE_TYPES} from "../tgTypes/botUpdatesTypes";
import {
    IPrivateAnimationPayload,
    IPrivateAudioPayload,
    IPrivateCbQueryPayload,
    IPrivateCommandPayload,
    IPrivateContextPayload,
    IPrivateDocumentPayload,
    IPrivateEditedMessagePayload,
    IPrivatePhotoPayload,
    IPrivateStickerPayload,
    IPrivateTextPayload,
    IPrivateVideNotePayload,
    IPrivateVideoPayload,
    IPrivateVoicePayload
} from "../tgTypes/messagePayload/contextPayloadTypes";
import {PRIVATE_PAYLOAD_CREATORS_HOLDER} from "../tgTypes/messagePayload/payloadCreator";
import {PAYLOAD_TYPES} from "../tgTypes/messagePayload/messagePayloadTypes";
import {Context} from "telegraf";
import {Message, Update, User} from 'typegram'
import ContextHelper from "../../helpers/ContextHelper";
import TextMessage = Message.TextMessage;
import CallbackQueryUpdate = Update.CallbackQueryUpdate;

export default class PrivatePayloadCreator extends PayloadCreator<PRIVATE_UPDATE_TYPES, IPrivateContextPayload> {
    readonly decoratorCreatorFunctionByUpdateType: PRIVATE_PAYLOAD_CREATORS_HOLDER = {
        [PRIVATE_UPDATE_TYPES.text]: this.createTextPayload.bind(this),
        [PRIVATE_UPDATE_TYPES.callback_query]: this.createCallbackQueryPayload.bind(this),
        [PRIVATE_UPDATE_TYPES.command]: this.createCommandPayload.bind(this),
        [PRIVATE_UPDATE_TYPES.animation]: this.createAnimationPayload.bind(this),
        [PRIVATE_UPDATE_TYPES.audio]: this.createAudioPayload.bind(this),
        [PRIVATE_UPDATE_TYPES.document]: this.createDocumentPayload.bind(this),
        [PRIVATE_UPDATE_TYPES.photo]: this.createPhotoPayload.bind(this),
        [PRIVATE_UPDATE_TYPES.sticker]: this.createStickerPayload.bind(this),
        [PRIVATE_UPDATE_TYPES.video]: this.createVideoPayload.bind(this),
        [PRIVATE_UPDATE_TYPES.video_note]: this.createVideoNotePayload.bind(this),
        [PRIVATE_UPDATE_TYPES.voice]: this.createVoicePayload.bind(this),
        [PRIVATE_UPDATE_TYPES.edited_message]: this.createEditedMessagePayload.bind(this)
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
            [PRIVATE_UPDATE_TYPES.text]: message.text
        }
    }

    protected createCallbackQueryPayload(context: Context<Update>): IPrivateCbQueryPayload {
        const defaultObj: IPrivateContextPayload = this.getDefaultPayload(context, PAYLOAD_TYPES.callback_query)
        const update = context.update as CallbackQueryUpdate

        return {
            ...defaultObj,
            [PRIVATE_UPDATE_TYPES.callback_query]: update.callback_query
        }
    }

    protected createCommandPayload(context: Context<Update>): IPrivateCommandPayload {
        const defaultObj: IPrivateContextPayload = this.getDefaultPayload(context, PAYLOAD_TYPES.command)
        const message = ContextHelper.getMessageField(context) as TextMessage

        return {
            ...defaultObj,
            [PRIVATE_UPDATE_TYPES.command]: message.text
        }
    }

    protected createAnimationPayload(context: Context<Update>): IPrivateAnimationPayload {
        const defaultObj: IPrivateContextPayload = this.getDefaultPayload(context, PAYLOAD_TYPES.command)

        return {
            ...defaultObj,
            [PRIVATE_UPDATE_TYPES.animation]: 'some'
        }
    }

    protected createAudioPayload(context: Context<Update>): IPrivateAudioPayload {
        const defaultObj: IPrivateContextPayload = this.getDefaultPayload(context, PAYLOAD_TYPES.command)

        return {
            ...defaultObj,
            [PRIVATE_UPDATE_TYPES.audio]: 'some'
        }
    }

    protected createDocumentPayload(context: Context<Update>): IPrivateDocumentPayload {
        const defaultObj: IPrivateContextPayload = this.getDefaultPayload(context, PAYLOAD_TYPES.command)

        return {
            ...defaultObj,
            [PRIVATE_UPDATE_TYPES.document]: 'some'
        }
    }

    protected createPhotoPayload(context: Context<Update>): IPrivatePhotoPayload {
        const defaultObj: IPrivateContextPayload = this.getDefaultPayload(context, PAYLOAD_TYPES.command)

        return {
            ...defaultObj,
            [PRIVATE_UPDATE_TYPES.photo]: 'some'
        }
    }

    protected createStickerPayload(context: Context<Update>): IPrivateStickerPayload {
        const defaultObj: IPrivateContextPayload = this.getDefaultPayload(context, PAYLOAD_TYPES.command)

        return {
            ...defaultObj,
            [PRIVATE_UPDATE_TYPES.sticker]: 'some'
        }
    }

    protected createVideoPayload(context: Context<Update>): IPrivateVideoPayload {
        const defaultObj: IPrivateContextPayload = this.getDefaultPayload(context, PAYLOAD_TYPES.command)

        return {
            ...defaultObj,
            [PRIVATE_UPDATE_TYPES.video]: 'some'
        }
    }

    protected createVideoNotePayload(context: Context<Update>): IPrivateVideNotePayload {
        const defaultObj: IPrivateContextPayload = this.getDefaultPayload(context, PAYLOAD_TYPES.command)

        return {
            ...defaultObj,
            [PRIVATE_UPDATE_TYPES.video_note]: 'some'
        }
    }

    protected createVoicePayload(context: Context<Update>): IPrivateVoicePayload {
        const defaultObj: IPrivateContextPayload = this.getDefaultPayload(context, PAYLOAD_TYPES.command)

        return {
            ...defaultObj,
            [PRIVATE_UPDATE_TYPES.voice]: 'some'
        }
    }


    protected createEditedMessagePayload(context: Context<Update>): IPrivateEditedMessagePayload {
        const defaultObj: IPrivateContextPayload = this.getDefaultPayload(context, PAYLOAD_TYPES.command)

        return {
            ...defaultObj,
            [PRIVATE_UPDATE_TYPES.edited_message]: 'some'
        }
    }

}