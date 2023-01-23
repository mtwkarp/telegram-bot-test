import {MESSAGES_TYPES, PRIVATE_UPDATE_TYPES, UPDATE_TYPES} from "../tgTypes/botUpdatesTypes";
import {
    IPrivateAnimationPayload,
    IPrivateAudioPayload,
    IPrivateCbQueryPayload,
    IPrivateCommandPayload,
    IPrivateContextPayload,
    IPrivateDocumentPayload,
    IPrivateEditedMessagePayload, IPrivateLocationPayload,
    IPrivatePhotoPayload,
    IPrivateStickerPayload,
    IPrivateTextPayload,
    IPrivateVideNotePayload,
    IPrivateVideoPayload,
    IPrivateVoicePayload, MediaPayload
} from "../tgTypes/messagePayload/contextPayloadTypes";
import {IPayloadCreator, PRIVATE_PAYLOAD_CREATORS_HOLDER} from "../tgTypes/messagePayload/payloadCreator";
import {PAYLOAD_TYPES} from "../tgTypes/messagePayload/messagePayloadTypes";
import {Context} from "telegraf";
import {Message, Update, User} from 'typegram'
import ContextHelper from "../helpers/ContextHelper";
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
import MediaMessage = Message.MediaMessage;
import PrivateUpdateHandler from "../scopeUpdateHandlers/PrivateUpdateHandler";
import LocationMessage = Message.LocationMessage;

export default class PrivatePayloadCreator extends PrivateUpdateHandler implements IPayloadCreator {
    readonly decoratorCreatorFunctionByUpdateType: PRIVATE_PAYLOAD_CREATORS_HOLDER = {
        [PRIVATE_UPDATE_TYPES.text]: this.onText.bind(this),
        [PRIVATE_UPDATE_TYPES.callback_query]: this.onCallbackQuery.bind(this),
        [PRIVATE_UPDATE_TYPES.command]: this.onCommand.bind(this),
        [PRIVATE_UPDATE_TYPES.animation]: this.onAnimation.bind(this),
        [PRIVATE_UPDATE_TYPES.audio]: this.onAudio.bind(this),
        [PRIVATE_UPDATE_TYPES.document]: this.onDocument.bind(this),
        [PRIVATE_UPDATE_TYPES.photo]: this.onPhoto.bind(this),
        [PRIVATE_UPDATE_TYPES.sticker]: this.onSticker.bind(this),
        [PRIVATE_UPDATE_TYPES.video]: this.onVideo.bind(this),
        [PRIVATE_UPDATE_TYPES.video_note]: this.onVideoNote.bind(this),
        [PRIVATE_UPDATE_TYPES.voice]: this.onVoice.bind(this),
        [PRIVATE_UPDATE_TYPES.edited_message]: this.onEditedMessage.bind(this),
        [PRIVATE_UPDATE_TYPES.location]: this.onLocation.bind(this)
    }

    public create(updateType: PRIVATE_UPDATE_TYPES, context: Context<Update>): IPrivateContextPayload | null {
        if(this.decoratorCreatorFunctionByUpdateType[updateType] === undefined) {
            console.log(`Creation of this kind of payload (${updateType}) not yet supported`)

            return null
        }
        // @ts-ignore
        const result = this.decoratorCreatorFunctionByUpdateType[updateType](context)

        // @ts-ignore
        return result ? result : null
    }

    public getDefaultMediaValuesFromMsg(message: MediaMessage): MediaPayload {
        return {
            caption: message.caption,
            caption_entities: message.caption_entities,
            media_group_id: message.media_group_id
        }
    }

    public getDefaultPayload(context: Context<Update>, type: PAYLOAD_TYPES, from: User): IPrivateContextPayload {
        const updateType: UPDATE_TYPES = ContextHelper.getContextUpdateType(context.update)
        let updateMessageType: MESSAGES_TYPES = MESSAGES_TYPES.none
//REFACTOR !!!!
        if(updateType === UPDATE_TYPES.unknown) {
            throw new Error('UPDATE TYPE UNKNOWN !!!')
        }

        if(updateType === UPDATE_TYPES.message) {
            // console.log('asdf', context.message)
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

    protected override onText(context: Context<Update>): IPrivateTextPayload {
        const message = ContextHelper.getMessageField(context) as TextMessage
        const defaultObj: IPrivateContextPayload = this.getDefaultPayload(context, PAYLOAD_TYPES.text, message.from as User)

        return {
            ...defaultObj,
            text: message.text,
            entities: message.entities
        }
    }

    protected override onCallbackQuery(context: Context<Update>): IPrivateCbQueryPayload {
        const update = context.update as CallbackQueryUpdate
        const defaultObj: IPrivateContextPayload = this.getDefaultPayload(context, PAYLOAD_TYPES.callback_query, update.callback_query.from)
        const message = update.callback_query.message as Message

        return {
            ...defaultObj,
            callback_query: update.callback_query,
            messageId: message.message_id
        }
    }

    protected override onCommand(context: Context<Update>): IPrivateCommandPayload {
        const message = ContextHelper.getMessageField(context) as TextMessage
        const defaultObj: IPrivateContextPayload = this.getDefaultPayload(context, PAYLOAD_TYPES.command, message.from as User)
        const cmdWithoutSlash = message.text.slice(1)

        return {
            ...defaultObj,
            command: cmdWithoutSlash
        }
    }

    protected override onAnimation(context: Context<Update>): IPrivateAnimationPayload {
        const message = ContextHelper.getMessageField(context) as AnimationMessage
        const defaultObj: IPrivateContextPayload = this.getDefaultPayload(context, PAYLOAD_TYPES.animation, message.from as User)

        return {
            ...defaultObj,
            animation: message.animation,
            document: message.document
        }
    }

    protected override onAudio(context: Context<Update>): IPrivateAudioPayload {
        const message = ContextHelper.getMessageField(context) as AudioMessage
        const defaultObj: IPrivateContextPayload = this.getDefaultPayload(context, PAYLOAD_TYPES.audio, message.from as User)

        return {
            ...defaultObj,
            audio: message.audio,
            ...this.getDefaultMediaValuesFromMsg(message)
        }
    }

    protected override onDocument(context: Context<Update>): IPrivateDocumentPayload {
        const message = ContextHelper.getMessageField(context) as DocumentMessage
        const defaultObj: IPrivateContextPayload = this.getDefaultPayload(context, PAYLOAD_TYPES.document, message.from as User)

        return {
            ...defaultObj,
            document: message.document,
            ...this.getDefaultMediaValuesFromMsg(message)
        }
    }

    protected override onPhoto(context: Context<Update>): IPrivatePhotoPayload {
        const message = ContextHelper.getMessageField(context) as PhotoMessage
        const defaultObj: IPrivateContextPayload = this.getDefaultPayload(context, PAYLOAD_TYPES.photo, message.from as User)

        return {
            ...defaultObj,
            photo: message.photo,
            ...this.getDefaultMediaValuesFromMsg(message)
        }
    }

    protected override onSticker(context: Context<Update>): IPrivateStickerPayload {
        const message = ContextHelper.getMessageField(context) as StickerMessage
        const defaultObj: IPrivateContextPayload = this.getDefaultPayload(context, PAYLOAD_TYPES.sticker, message.from as User)

        return {
            ...defaultObj,
            sticker: message.sticker
        }
    }

    protected override onVideo(context: Context<Update>): IPrivateVideoPayload {
        const message = ContextHelper.getMessageField(context) as VideoMessage
        const defaultObj: IPrivateContextPayload = this.getDefaultPayload(context, PAYLOAD_TYPES.video, message.from as User)

        return {
            ...defaultObj,
            video: message.video,
            ...this.getDefaultMediaValuesFromMsg(message)
        }
    }

    protected override onVideoNote(context: Context<Update>): IPrivateVideNotePayload {
        const message = ContextHelper.getMessageField(context) as VideoNoteMessage
        const defaultObj: IPrivateContextPayload = this.getDefaultPayload(context, PAYLOAD_TYPES.video_note, message.from as User)

        return {
            ...defaultObj,
            video_note: message.video_note
        }
    }

    protected override onVoice(context: Context<Update>): IPrivateVoicePayload {
        const message = ContextHelper.getMessageField(context) as VoiceMessage
        const defaultObj: IPrivateContextPayload = this.getDefaultPayload(context, PAYLOAD_TYPES.voice, message.from as User)

        return {
            ...defaultObj,
            voice: message.voice,
            caption: message.caption
        }
    }

    protected override onEditedMessage(context: Context<Update>): IPrivateEditedMessagePayload {
        const update = context.update as EditedMessageUpdate
        const defaultObj: IPrivateContextPayload = this.getDefaultPayload(context, PAYLOAD_TYPES.edited_message, update.edited_message.from)
        const editedMsgType = ContextHelper.getUpdateMessageType(update.edited_message)

        return {
            ...defaultObj,
            edited_message: update,
            edited_message_type: editedMsgType
        }
    }

    protected override onLocation(context: Context<Update>): IPrivateLocationPayload {
        const message = ContextHelper.getMessageField(context) as LocationMessage
        const defaultObj: IPrivateContextPayload = this.getDefaultPayload(context, PAYLOAD_TYPES.voice, message.from as User)

        return {
            ...defaultObj,
            location: message.location
        }
    }

}