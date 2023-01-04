import {IBotInteractionListener} from "../types/types";
import {Context, Telegraf} from "telegraf";
import {Message, Update} from "typegram";


import {message} from 'telegraf/filters'


class BotInteractionObservable implements IBotInteractionListener {
    private listeners: IBotInteractionListener[]

    constructor() {
        this.listeners = []

        // console.log(Update.)
    }

    subscribeForBotEvents(bot: Telegraf) {
        bot.command('schedule', () => console.log('hui'))
        bot.use(async (ctx: Context<Update>, next) => {
            console.log(ctx.updateType)
            await next()
            // @ts-ignore
            console.log(ctx.bitch)
        })
        bot.on(message('text'), this.onMessage.bind(this))
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
        const cmdNameWithoutSlash = cmdName.replace('/', '')

        this.listeners.forEach(s => s.onCmd(cmdNameWithoutSlash, ctx))
    }

    onBotPrivateText() {
        //chat.type === 'private'
    }

    onMessage(ctx: Context<Update>, next: Function): void  {



        // @ts-ignore
        if(ctx.message.text) {
            // @ts-ignore
            ctx.bitch = 'hui'
            next({})
            // @ts-ignore
            console.log(ctx.message.text)

        }

    }

}

export default BotInteractionObservable