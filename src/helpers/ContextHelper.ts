import {Context} from "telegraf";
import {Message, Update} from 'typegram'
import MessageUpdate = Update.MessageUpdate;
export default class ContextHelper {
    static getMessageField(context: Context<Update>): Message {
        const updateObj = context.update as MessageUpdate
        const message = updateObj.message

        return message
    }
}