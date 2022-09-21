const TelegramApi = require('node-telegram-bot-api')
const token = '5578721046:AAFL3QeNl7tpunNcic5_nRDGodArhNgnpD4'
const { Telegraf } = require('telegraf')

const bot = new Telegraf(token)

const dayNames = {
    monday: 'ПН',
    tuesday: 'ВТ',
    wednesday: 'СР',
    thursday: 'ЧТ',
    friday: 'ПТ',
    saturday: 'СБ',
    sunday: 'НД'
}
const notAvailableInstructor = 'Відсутній'

const gameOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [
                {text: dayNames.monday, callback_data: dayNames.monday},
                {text: dayNames.tuesday, callback_data: dayNames.tuesday},
                {text: dayNames.wednesday, callback_data: dayNames.wednesday}
            ],
            [
                {text: dayNames.thursday, callback_data: dayNames.thursday},
                {text: dayNames.friday, callback_data: dayNames.friday},
                {text: dayNames.saturday, callback_data: dayNames.saturday}
            ],
            [
                {text: dayNames.sunday, callback_data: dayNames.sunday}
            ],
            [
                {text: notAvailableInstructor, callback_data: notAvailableInstructor}
            ]
        ]
    })
}

const start = function () {
    bot.command('schedule', (ctx) => sendSchedule(ctx))
    bot.on('callback_query', async (ctx) => {
        // Explicit usage
        console.log(ctx.update.callback_query.from.username, "ou hello")
        await ctx.telegram.answerCbQuery(ctx.callbackQuery.id);

        // Using context shortcut
        await ctx.answerCbQuery();
    });
    bot.launch();
}

const sendSchedule = async function (ctx) {
    return ctx.telegram.sendMessage('-1001613404825', 'Виберіть дні в які ви зможете викладати', gameOptions)
}


start()
