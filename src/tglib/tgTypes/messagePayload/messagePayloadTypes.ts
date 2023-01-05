export enum PAYLOAD_TYPES {
    audio="audio_payload",
    text="text_payload",
    callback_query="callback_query_payload",
    command='command'
}

// type EMPTY_PAYLOAD = 'empty_payload'
type AUDIO_PAYLOAD = PAYLOAD_TYPES.audio
type TEXT_PAYLOAD = PAYLOAD_TYPES.text
type CALLBACK_QUERY_PAYLOAD = PAYLOAD_TYPES.callback_query
type COMMAND_PAYLOAD = PAYLOAD_TYPES.command

type MESSAGE_PAYLOAD_TYPE =
    // EMPTY_PAYLOAD
    | AUDIO_PAYLOAD
    | TEXT_PAYLOAD
    | CALLBACK_QUERY_PAYLOAD
    | COMMAND_PAYLOAD

export type {MESSAGE_PAYLOAD_TYPE}