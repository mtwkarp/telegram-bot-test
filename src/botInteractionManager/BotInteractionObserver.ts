import {IBotInteractionListener} from "../types/types";
import {Context, Telegraf} from "telegraf";
import {Message, Update} from "typegram";


import {message} from 'telegraf/filters'


class BotInteractionObserver implements IBotInteractionListener {
    private listeners: IBotInteractionListener[]

    constructor() {
        this.listeners = []

        // console.log(Update.)
    }

    subscribeForBotEvents(bot: Telegraf) {
        bot.command('schedule', () => console.log('hui'))
        bot.use(async (ctx, next) => {
            console.log('hi')
            // console.time(`Processing update ${ctx.update.update_id}`);
            await next() // runs next middleware
            // runs after next middleware finishes
            console.log('by by')
            // console.timeEnd(`Processing update ${ctx.update.update_id}`);
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

    onMessage(ctx: Context<Update>): void  {
        // @ts-ignore
        if(ctx.message.text) {
            // @ts-ignore

            console.log(ctx.message.text)

        }

        // const msgType: UpdateType = ctx.updateType
        // const updateObj: Update.MessageUpdate = ctx.update as Update.MessageUpdate

            // message
        // if(ctx.update?.message) {
        //
        // }

        // @ts-ignore
        // console.log(Update)
        //
        // if(updateObj as Update.MessageUpdate) {
        //     // console.log('hi pidor')
        //     const msg = updateObj.message
        //
        //     if(msg as Message.TextMessage) {
        //         console.log(msg)
        //     }
        // }
        // console.log(Update.MessageUpdate)

        // console.log(ctx.update)
        // console.log(MountMap.message)
        // if()

        // const u: Update.Types.MessageSubType = ctx.update
        // console.log(ctx.message typeof tg.Message)
        // console.log(ctx.message === )
        // typeof ctx.update === Update.MessageUpdate
        // const msg: any = ctx.message,
        //     text: string = msg.text;
        //
        // if(this.isTextCommand(text)) {
        //     this.onCmd(text, ctx)
        //     return
        // }
        //
        // this.listeners.forEach(s => s.onMessage(ctx))
    }

    private isTextCommand(text: string): boolean {
        return (text[0] === '/')
    }
}

// const c: Context<Update.MessageUpdate> = new Context(Update.MessageUpdate, new Telegram(), UserFromGetMe)

export default BotInteractionObserver