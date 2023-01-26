export enum PAYLOAD_TYPES {
  audio = 'audio_payload_type',
  text = 'text_payload_type',
  callback_query = 'callback_query_payload_type',
  command = 'command_type',
  animation = 'animation_type',
  document = 'document_type',
  photo = 'photo_type',
  sticker = 'sticker_type',
  video = 'video_type',
  video_note = 'video_note_type',
  voice = 'voice_type',

  edited_message = 'edited_message_type'
}

type MESSAGE_PAYLOAD_TYPE =
    // EMPTY_PAYLOAD
    | PAYLOAD_TYPES.audio
    | PAYLOAD_TYPES.text
    | PAYLOAD_TYPES.callback_query
    | PAYLOAD_TYPES.command
    | PAYLOAD_TYPES.animation
    | PAYLOAD_TYPES.document
    | PAYLOAD_TYPES.photo
    | PAYLOAD_TYPES.sticker
    | PAYLOAD_TYPES.video
    | PAYLOAD_TYPES.video_note
    | PAYLOAD_TYPES.voice
    | PAYLOAD_TYPES.edited_message

export type { MESSAGE_PAYLOAD_TYPE };
