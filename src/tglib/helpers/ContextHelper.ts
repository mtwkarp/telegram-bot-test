import { type Context } from 'telegraf';
import { type Message, Update } from 'typegram';
import MessageUpdate = Update.MessageUpdate
import { MESSAGES_TYPES, UPDATE_TYPES } from '../tgTypes/botUpdatesTypes';
export default class ContextHelper {
  static getMessageField(context: Context<Update>): Message {
    const updateObj = context.update as MessageUpdate;
    const message = updateObj.message;

    return message;
  }

  static getUpdateMessageType(message: Message): MESSAGES_TYPES {
    for (const messageType in MESSAGES_TYPES) {
      if (Object.prototype.hasOwnProperty.call(message, messageType)) {
        return messageType as MESSAGES_TYPES;
      }
    }

    return MESSAGES_TYPES.none;
  }

  static getContextUpdateType(update: Update): UPDATE_TYPES {
    for (const updateKey in UPDATE_TYPES) {
      if (Object.prototype.hasOwnProperty.call(update, updateKey)) {
        return updateKey as UPDATE_TYPES;
      }
    }

    return UPDATE_TYPES.unknown;
  }
}
