import MyBot from './MyBot';
import { PRIVATE_UPDATE_TYPES } from './tglib/tgTypes/botUpdatesTypes';
import { type CMD_NAME_TYPE } from './types/types';
import { CMD_NAMES } from './types/enums';

const {
  text, callback_query, command, animation, audio, document, photo, sticker, video, video_note, voice,
  edited_message,
  location
} = PRIVATE_UPDATE_TYPES;

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
];

const privateCommands: CMD_NAME_TYPE[] = [CMD_NAMES.SCHEDULE, CMD_NAMES.COMMANDS_INFO, CMD_NAMES.START, CMD_NAMES.SAVE_PHOTO];

new MyBot(privateMessagesTypes, privateCommands).init()
  .then(() => { console.log('Successful APPLICATION start'); })
  .catch((err) => { console.log(err); });
