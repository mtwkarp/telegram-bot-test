import PayloadCreator from "./PayloadCreator";
import {MESSAGES_TYPES, PRIVATE_UPDATE_TYPES, UPDATE_TYPES} from "../tgTypes/botUpdatesTypes";
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
import AnimationMessage = Message.AnimationMessage;
import AudioMessage = Message.AudioMessage;
import DocumentMessage = Message.DocumentMessage;
import PhotoMessage = Message.PhotoMessage;
import StickerMessage = Message.StickerMessage;
import VideoMessage = Message.VideoMessage;
import VideoNoteMessage = Message.VideoNoteMessage;
import VoiceMessage = Message.VoiceMessage;
import EditedMessageUpdate = Update.EditedMessageUpdate;

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


    getDefaultPayload(context: Context<Update>, type: PAYLOAD_TYPES, from: User): IPrivateContextPayload {
        const updateType: UPDATE_TYPES = ContextHelper.getContextUpdateType(context.update)
        let updateMessageType: MESSAGES_TYPES = MESSAGES_TYPES.none
//REFACTOR !!!!
        if(updateType === UPDATE_TYPES.unknown) {
            throw new Error('UPDATE TYPE UNKNOWN !!!')
        }

        if(updateType === UPDATE_TYPES.message) {
            updateMessageType = ContextHelper.getUpdateMessageType(context.message as Message)
        }

        const obj: IPrivateContextPayload = {
            senderId: from.id,
            chatId: from.id,
            updateType,
            messageType: updateMessageType,
            type
        }

        return obj
    }

    protected createTextPayload(context: Context<Update>): IPrivateTextPayload {
        const message = ContextHelper.getMessageField(context) as TextMessage
        const defaultObj: IPrivateContextPayload = this.getDefaultPayload(context, PAYLOAD_TYPES.text, message.from as User)

        return {
            ...defaultObj,
            text: message.text,
            entities: message.entities
        }
    }

    protected createCallbackQueryPayload(context: Context<Update>): IPrivateCbQueryPayload {
        const update = context.update as CallbackQueryUpdate
        const defaultObj: IPrivateContextPayload = this.getDefaultPayload(context, PAYLOAD_TYPES.callback_query, update.callback_query.from)

        return {
            ...defaultObj,
            callback_query: update.callback_query
        }
    }

    protected createCommandPayload(context: Context<Update>): IPrivateCommandPayload {
        const message = ContextHelper.getMessageField(context) as TextMessage
        const defaultObj: IPrivateContextPayload = this.getDefaultPayload(context, PAYLOAD_TYPES.command, message.from as User)

        return {
            ...defaultObj,
            command: message.text
        }
    }

    protected createAnimationPayload(context: Context<Update>): IPrivateAnimationPayload {
        const message = ContextHelper.getMessageField(context) as AnimationMessage
        const defaultObj: IPrivateContextPayload = this.getDefaultPayload(context, PAYLOAD_TYPES.animation, message.from as User)

        return {
            ...defaultObj,
            animation: message.animation,
            document: message.document
        }
    }

    protected createAudioPayload(context: Context<Update>): IPrivateAudioPayload {
        const message = ContextHelper.getMessageField(context) as AudioMessage
        const defaultObj: IPrivateContextPayload = this.getDefaultPayload(context, PAYLOAD_TYPES.audio, message.from as User)

        return {
            ...defaultObj,
            audio: message.audio,
            ...this.getDefaultMediaValuesFromMsg(message)
        }
    }

    protected createDocumentPayload(context: Context<Update>): IPrivateDocumentPayload {
        const message = ContextHelper.getMessageField(context) as DocumentMessage
        const defaultObj: IPrivateContextPayload = this.getDefaultPayload(context, PAYLOAD_TYPES.document, message.from as User)

        return {
            ...defaultObj,
            document: message.document,
            ...this.getDefaultMediaValuesFromMsg(message)
        }
    }

    protected createPhotoPayload(context: Context<Update>): IPrivatePhotoPayload {
        const message = ContextHelper.getMessageField(context) as PhotoMessage
        const defaultObj: IPrivateContextPayload = this.getDefaultPayload(context, PAYLOAD_TYPES.photo, message.from as User)

        return {
            ...defaultObj,
            photo: message.photo,
            ...this.getDefaultMediaValuesFromMsg(message)
        }
    }

    protected createStickerPayload(context: Context<Update>): IPrivateStickerPayload {
        const message = ContextHelper.getMessageField(context) as StickerMessage
        const defaultObj: IPrivateContextPayload = this.getDefaultPayload(context, PAYLOAD_TYPES.sticker, message.from as User)

        return {
            ...defaultObj,
            sticker: message.sticker
        }
    }

    protected createVideoPayload(context: Context<Update>): IPrivateVideoPayload {
        const message = ContextHelper.getMessageField(context) as VideoMessage
        const defaultObj: IPrivateContextPayload = this.getDefaultPayload(context, PAYLOAD_TYPES.video, message.from as User)

        return {
            ...defaultObj,
            video: message.video,
            ...this.getDefaultMediaValuesFromMsg(message)
        }
    }

    protected createVideoNotePayload(context: Context<Update>): IPrivateVideNotePayload {
        const message = ContextHelper.getMessageField(context) as VideoNoteMessage
        const defaultObj: IPrivateContextPayload = this.getDefaultPayload(context, PAYLOAD_TYPES.video_note, message.from as User)

        return {
            ...defaultObj,
            video_note: message.video_note
        }
    }

    protected createVoicePayload(context: Context<Update>): IPrivateVoicePayload {
        const message = ContextHelper.getMessageField(context) as VoiceMessage
        const defaultObj: IPrivateContextPayload = this.getDefaultPayload(context, PAYLOAD_TYPES.voice, message.from as User)

        return {
            ...defaultObj,
            voice: message.voice,
            caption: message.caption
        }
    }

    protected createEditedMessagePayload(context: Context<Update>): IPrivateEditedMessagePayload {
        const update = context.update as EditedMessageUpdate
        const defaultObj: IPrivateContextPayload = this.getDefaultPayload(context, PAYLOAD_TYPES.edited_message, update.edited_message.from)
        const editedMsgType = ContextHelper.getUpdateMessageType(update.edited_message)

        return {
            ...defaultObj,
            edited_message: update,
            edited_message_type: editedMsgType
        }
    }

}