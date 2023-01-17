import MyBot from './MyBot'
import {PRIVATE_UPDATE_TYPES} from "./tglib/tgTypes/botUpdatesTypes";
import {CMD_NAME_TYPE, CMD_NAMES} from "./types/commandTypes";

const {text, callback_query, command, animation, audio, document, photo, sticker, video, video_note, voice,
    edited_message,
    location
} = PRIVATE_UPDATE_TYPES

const privateMessagesTypes: PRIVATE_UPDATE_TYPES[] = [
    text,
    callback_query,
    command,
    animation,
    audio,
    document,
    photo,
    sticker,
    video,
    video_note,
    voice,
    edited_message,
    location
]

const privateCommands: CMD_NAME_TYPE[] = [CMD_NAMES.SCHEDULE]

new MyBot(privateMessagesTypes, privateCommands).init()
        .then(() => console.log('Successful APPLICATION start'))
        .catch((err) => console.log(err));

