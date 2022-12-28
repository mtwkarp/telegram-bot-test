import {IBotInteractionListener} from "../types/types";
import {Context, Telegraf} from "telegraf";

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
        const subscribedListener: IBotInteractionListener | false = this.findListener(listener)

        if(subscribedListener !== false) {
            return
        }

        this.listeners.push(listener)
    }

    private findListener(listener: IBotInteractionListener): false | IBotInteractionListener {
        const subscribedListener: IBotInteractionListener | undefined = this.listeners.find(
            (l) => l === listener
        );

        if(subscribedListener === undefined) {
            return false
        }

        return subscribedListener
    }

    unsubscribeListener(listener: IBotInteractionListener): void {
        const subscribedListener: IBotInteractionListener | false = this.findListener(listener)

        if(subscribedListener === false) {
            return
        }

        this.listeners.splice(this.listeners.indexOf(subscribedListener), 1)
    }
    onCallbackQuery(ctx: Context): void {
        this.listeners.forEach(s => s.onCallbackQuery(ctx))
    }

    onCmd(cmdName: string, ctx: Context): void  {
        this.listeners.forEach(s => s.onCmd(cmdName, ctx))
    }

    onMessage(ctx: Context): void  {
        const msg: any = ctx.message,
            text: string = msg.text;

        if(this.isTextCommand(text)) {
            this.onCmd(text, ctx)
            return
        }

        this.listeners.forEach(s => s.onMessage(ctx))
    }

    private isTextCommand(text: string): boolean {
        return (text[0] === '/')
    }
}

export default BotInteractionObserver