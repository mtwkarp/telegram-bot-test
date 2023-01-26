import { type MESSAGE_PAYLOAD_TYPE } from './messagePayloadTypes';
import { type Animation, type Audio, type CallbackQuery, type Document, type PhotoSize, type Sticker, Update, type Video, type VideoNote, type Voice, type Location } from 'typegram';
import { type MESSAGES_TYPES, type UPDATE_TYPES } from '../botUpdatesTypes';
import EditedMessageUpdate = Update.EditedMessageUpdate
import { type MessageEntity } from 'typegram/message';

export interface IContextPayload {

  type: MESSAGE_PAYLOAD_TYPE
  updateType: UPDATE_TYPES
  messageType: MESSAGES_TYPES
}

export interface IPrivateContextCaptionablePayload extends IPrivateContextPayload {
  caption?: string
  caption_entities?: MessageEntity[] // For messages with a caption, special entities like usernames, URLs, bot commands, etc. that appear in the caption
}

export interface IContextMediaPayload extends IPrivateContextCaptionablePayload {
  media_group_id?: string
}

export type MediaPayload = Omit<IContextMediaPayload, keyof IPrivateContextPayload>

export interface IPrivateContextPayload extends IContextPayload {
  senderId: number
  chatId: number
}

export interface IPrivateTextPayload extends IPrivateContextPayload {
  text: string
  entities?: MessageEntity[]
}

export interface IPrivateCbQueryPayload extends IPrivateContextPayload {
  callback_query: CallbackQuery
  messageId: number
}

export interface IPrivateCommandPayload extends IPrivateContextPayload {
  command: string
}

export interface IPrivateAnimationPayload extends IPrivateContextPayload {
  document: Document
  animation: Animation
}

export interface IPrivateAudioPayload extends IContextMediaPayload {
  audio: Audio
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
  voice: Voice
  caption?: string
}

export interface IPrivateEditedMessagePayload extends IPrivateContextPayload {
  edited_message: EditedMessageUpdate
  edited_message_type: MESSAGES_TYPES
}

export interface IPrivateLocationPayload extends IPrivateContextPayload {
  location: Location
}
export type IChannelContextPayload = IContextPayload

export type IChatContextPayload = IContextPayload

export type CONTEXT_PAYLOAD_TYPE = IContextPayload | IPrivateContextPayload | IChannelContextPayload | IChatContextPayload
