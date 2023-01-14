const { default: test } = require('ava')
// const Main = require('../src/Main.ts')
const Bot = require('../src/Bot.ts')

// console.log(Main)
const Telegraf = require('telegraf')
// import test from 'ava'
// import {Telegraf} from "telegraf";
function createBot(...args) {
    // console.log(args)
    const bot = new Telegraf(...args)
    console.log(bot)
    bot.botInfo = { id: 8, is_bot: true, username: 'bot', first_name: 'Bot' }
    return bot
}

const updateTypes = [
    'voice',
    // 'video_note',
    // 'video',
    // 'animation',
    // 'venue',
    // 'text',
    // 'supergroup_chat_created',
    // 'successful_payment',
    // 'sticker',
    // 'pinned_message',
    // 'photo',
    // 'new_chat_title',
    // 'new_chat_photo',
    // 'new_chat_members',
    // 'migrate_to_chat_id',
    // 'migrate_from_chat_id',
    // 'location',
    // 'left_chat_member',
    // 'invoice',
    // 'group_chat_created',
    // 'game',
    // 'dice',
    // 'document',
    // 'delete_chat_photo',
    // 'contact',
    // 'channel_chat_created',
    // 'audio',
    // 'poll',
]

const baseMessage = {
    chat: { id: 1, type: 'private' },
    from: { id: 42, username: 'telegraf' },
}

updateTypes.forEach((update) =>
    test('should route update type: ' + update, (t) =>
        t.notThrowsAsync(
            new Promise((resolve) => {
                const bot = createBot()
                bot.on(update, (ctx) => {
                    resolve()
                })
                const message = { ...baseMessage }
                message[update] = {}
                bot.handleUpdate({ message: message })
            })
        )
    )
)