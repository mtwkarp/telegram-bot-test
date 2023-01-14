import {MESSAGE_PAYLOAD_TYPE} from "./messagePayloadTypes";
import {Animation, Audio, CallbackQuery, Document, PhotoSize, Sticker, Update, Video, VideoNote, Voice} from "typegram";
import {MESSAGES_TYPES, PRIVATE_UPDATE_TYPES, UPDATE_TYPES} from "../botUpdatesTypes";
import EditedMessageUpdate = Update.EditedMessageUpdate;
import {MessageEntity} from "typegram/message";

export interface IContextPayload {

    type: MESSAGE_PAYLOAD_TYPE,
    updateType: UPDATE_TYPES,
    messageType: MESSAGES_TYPES
}

export interface IContextCaptionablePayload extends IContextPayload{
    caption?: string,
    caption_entities?: MessageEntity[] //For messages with a caption, special entities like usernames, URLs, bot commands, etc. that appear in the caption
}

export interface IContextMediaPayload extends IContextCaptionablePayload{
    media_group_id?: string
}

export type MediaPayload = Omit<IContextMediaPayload, keyof IContextPayload>

export interface IPrivateContextPayload extends IContextPayload {
    senderId: number,
    chatId: number
}

export interface IPrivateTextPayload extends IPrivateContextPayload {
    text: string,
    entities?: MessageEntity[];
}

export interface IPrivateCbQueryPayload extends IPrivateContextPayload {
    callback_query: CallbackQuery
}

export interface IPrivateCommandPayload extends IPrivateContextPayload {
    command: string
}

export interface IPrivateAnimationPayload extends IPrivateContextPayload {
    document: Document,
    animation: Animation
}

export interface IPrivateAudioPayload extends IContextMediaPayload {
    audio: Audio,
}

export interface IPrivateDocumentPayload extends IContextMediaPayload {
    document: Document
}

export interface IPrivatePhotoPayload extends IContextMediaPayload {
    photo: PhotoSize[]
}

export interface IPrivateStickerPayload extends IPrivateContextPayload {
    sticker: Sticker
}

export interface IPrivateVideoPayload extends IContextMediaPayload {
   video: Video
}

export interface IPrivateVideNotePayload extends IPrivateContextPayload {
    video_note: VideoNote
}

export interface IPrivateVoicePayload extends IPrivateContextPayload {
    voice: Voice,
    caption?: string
}

export interface IPrivateEditedMessagePayload extends IPrivateContextPayload {
    edited_message: EditedMessageUpdate,
    edited_message_type: MESSAGES_TYPES
}

export interface IChannelContextPayload extends IContextPayload {
    // chatId: number
}

export interface IChatContextPayload extends IContextPayload {
    // chatId: number
}



export type CONTEXT_PAYLOAD_TYPE = IContextPayload | IPrivateContextPayload | IChannelContextPayload | IChatContextPayload