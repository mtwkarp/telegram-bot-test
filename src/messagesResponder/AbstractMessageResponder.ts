import {ITgMessageResponder} from "../types/interfaces";
import {Telegram} from "telegraf";
import {Message} from "typegram";
import TextMessage = Message.TextMessage;

export default class AbstractMessageResponder implements ITgMessageResponder {

    protected tg: Telegram
    protected targetId: number
    constructor(targetId: number) {
        this.tg = new Telegram(process.env.TELEGRAM_BOT_TOKEN as string)
        this.targetId = targetId
    }

    async sendMessage(msg: string): Promise<TextMessage> {
        return this.tg.sendMessage(this.targetId, msg)
    }
}