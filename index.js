// const TelegramApi = require('node-telegram-bot-api')
const token = '5578721046:AAFL3QeNl7tpunNcic5_nRDGodArhNgnpD4'
const { Telegraf, Telegram } = require('telegraf')

const bot = new Telegraf(token)
const tg = new Telegram(token)

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
const usersSchedules = {}

const getBtnMarkup = (text, callbackData, showTick = false) => {
    const btnText = text + (showTick === true ? ' ✅' : '')

    return {text: btnText, callback_data: callbackData}
}

const start = function () {
    bot.command('schedule', sendSchedule)
    bot.on('callback_query', onDayPick);
    bot.launch();
}

const onDayPick = async (ctx) => {
    const chatId = ctx.update.callback_query.message.chat.id
    const messageId = ctx.update.callback_query.message.message_id
    const username = ctx.update.callback_query.from.username
    const userSchedule = getUserSchedule(username)
    const data = ctx.update.callback_query.data
    // console.log(ctx.update.callback_query.data)
    userSchedule[data] = !userSchedule[data]

    if(data === notAvailableInstructor) {
        clearAllDaysIfInstructorUnavailable(username)
    }else {
        makeInstructorAvailableIfDayChosen(username)
    }

    const updatedUserMarkup = JSON.parse(getUserReplyMarkup(userSchedule).reply_markup)
// console.log(updatedUserMarkup)
    await tg.editMessageReplyMarkup(chatId, messageId, null, updatedUserMarkup)
    await ctx.answerCbQuery();
}

const makeInstructorAvailableIfDayChosen = (username) => {
    const userSchedule = getUserSchedule(username)

    userSchedule[notAvailableInstructor] = false
}

const clearAllDaysIfInstructorUnavailable = (username) => {
    const userSchedule = getUserSchedule(username)

    if(userSchedule[notAvailableInstructor] === true) {
        for (const userScheduleKey in userSchedule) {
            if(userScheduleKey === notAvailableInstructor) continue

            userSchedule[userScheduleKey] = false
        }
    }
}

const getUserReplyMarkup = (userSchedule) => {
    const {monday, tuesday, wednesday, thursday, friday, saturday, sunday} = dayNames

    return {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [
                    getBtnMarkup(monday, monday, userSchedule[monday]),
                    getBtnMarkup(tuesday, tuesday, userSchedule[tuesday]),
                    getBtnMarkup(wednesday, wednesday, userSchedule[wednesday])
                ],
                [
                    getBtnMarkup(thursday, thursday, userSchedule[thursday]),
                    getBtnMarkup(friday, friday, userSchedule[friday]),
                    getBtnMarkup(saturday, saturday, userSchedule[saturday])
                ],
                [
                    getBtnMarkup(sunday, sunday, userSchedule[sunday])
                ],
                [
                    getBtnMarkup(notAvailableInstructor, notAvailableInstructor, userSchedule[notAvailableInstructor])
                ]
            ]
        })
    }
}

const sendSchedule = async function (ctx) {
    const userName = ctx.from.username
    writeUserEmptySchedule(userName)

    const userSchedule = getUserSchedule(userName)
    const userMarkup = getUserReplyMarkup(userSchedule)

    return ctx.telegram.sendMessage(ctx.update.message.chat.id, 'Виберіть дні в які ви зможете викладати', userMarkup)
}

const writeUserEmptySchedule = (username) => {
    const emptySchedule = getUserEmptySchedule()

    usersSchedules[username] = emptySchedule
}

const getUserSchedule = (userName) => {
    return usersSchedules[userName]
}

const getUserEmptySchedule = () => {
    return {
        [dayNames.monday]: false,
        [dayNames.tuesday]: false,
        [dayNames.wednesday]: false,
        [dayNames.thursday]: false,
        [dayNames.friday]: false,
        [dayNames.saturday]: false,
        [dayNames.sunday]: false,
        [notAvailableInstructor]: false
    }
}

const sendScheduleMessageToChannel = async function() {
    // return ctx.telegram.sendMessage('-1001613404825', 'Виберіть дні в які ви зможете викладати', scheduleDefaultMarkup)
}

start()
