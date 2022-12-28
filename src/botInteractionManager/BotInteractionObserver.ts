import {IBotInteractionListener} from "../types/types";
import {Context, Telegraf, Types} from "telegraf";
import {commandsDescription} from "../static/commandsInfo";
import {Message} from "typegram";
import {messaging} from "firebase-admin";

class BotInteractionObserver implements IBotInteractionListener {
    private listeners: IBotInteractionListener[]

    constructor() {
        this.listeners = []
    }

    subscribeForBotEvents(bot: Telegraf) {
        bot.on('message', this.onMessage.bind(this))
        bot.on('callback_query', this.onCallbackQuery.bind(this))
    }

    subscribeListener(listener: IBotInteractionListener): void {
        this.listeners.push(listener)
    }

    unsubscribeListener(listener: IBotInteractionListener): void {
        const subscribedListener: IBotInteractionListener | undefined = this.listeners.find(
            (l) => l === listener
        );

        if(subscribedListener === undefined) {
            console.log('No such listener')
            return
        }

        this.listeners.splice(this.listeners.indexOf(subscribedListener), 1)
    }
    onCallbackQuery(ctx: Object): void {
        this.listeners.forEach(s => s.onCallbackQuery(ctx))
    }

    onCmd(cmdName: string, ctx: Object): void  {
        console.log(cmdName, ctx)
        console.log('pidor')
        this.listeners.forEach(s => s.onCallbackQuery(cmdName, ctx))
    }

    onMessage(ctx: Context): void  {
        const msg: any = ctx.message,
            text: string = msg.text;

        if(text[0] === '/') {
            this.onCmd(text, Context)
            return
        }

        this.listeners.forEach(s => s.onCallbackQuery(ctx))
    }
}

export default BotInteractionObserver