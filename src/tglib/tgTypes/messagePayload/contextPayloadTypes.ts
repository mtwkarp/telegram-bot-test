import {MESSAGE_PAYLOAD_TYPE} from "./messagePayloadTypes";
import {CallbackQuery} from "typegram";
import {PRIVATE_UPDATE_TYPES} from "../botUpdatesTypes";

export interface IContextPayload {

    type: MESSAGE_PAYLOAD_TYPE
}

export interface IPrivateContextPayload extends IContextPayload {
    senderId: number,
    chatId: number
}

export interface IPrivateTextPayload extends IPrivateContextPayload {
    [PRIVATE_UPDATE_TYPES.text]: string
}

export interface IPrivateCbQueryPayload extends IPrivateContextPayload {
    [PRIVATE_UPDATE_TYPES.callback_query]: CallbackQuery
}

export interface IPrivateCommandPayload extends IPrivateContextPayload {
    [PRIVATE_UPDATE_TYPES.command]: string
}

export interface IPrivateAnimationPayload extends IPrivateContextPayload {
    [PRIVATE_UPDATE_TYPES.animation]: string
}

export interface IPrivateAudioPayload extends IPrivateContextPayload {
    [PRIVATE_UPDATE_TYPES.audio]: string
}

export interface IPrivateDocumentPayload extends IPrivateContextPayload {
    [PRIVATE_UPDATE_TYPES.document]: string
}

export interface IPrivatePhotoPayload extends IPrivateContextPayload {
    [PRIVATE_UPDATE_TYPES.photo]: string
}

export interface IPrivateStickerPayload extends IPrivateContextPayload {
    [PRIVATE_UPDATE_TYPES.sticker]: string
}

export interface IPrivateVideoPayload extends IPrivateContextPayload {
   [PRIVATE_UPDATE_TYPES.video]: string
}

export interface IPrivateVideNotePayload extends IPrivateContextPayload {
    [PRIVATE_UPDATE_TYPES.video_note]: string
}

export interface IPrivateVoicePayload extends IPrivateContextPayload {
    [PRIVATE_UPDATE_TYPES.voice]: string
}

export interface IPrivateEditedMessagePayload extends IPrivateContextPayload {
    [PRIVATE_UPDATE_TYPES.edited_message]: string
}

export interface IChannelContextPayload extends IContextPayload {
    // chatId: number
}

export interface IChatContextPayload extends IContextPayload {
    // chatId: number
}



export type CONTEXT_PAYLOAD_TYPE = IContextPayload | IPrivateContextPayload | IChannelContextPayload | IChatContextPayload