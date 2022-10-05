const token = '5578721046:AAFL3QeNl7tpunNcic5_nRDGodArhNgnpD4'
const { Telegraf, Telegram } = require('telegraf')
const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
const {getUserNameByNickname, getUserRowIndexInAvailabilitySheet, toggleDayOfTheWeek, clearAllSelectedDaysByInstructor,
    normalizeUnavailableCheckbox
} = require('./googleSheets/sheetsFunctions')
const {dayNames, dayNamesByCellsLettersInSheet, notAvailableInstructor} = require('./constants/spreadsheetsConstants')
const bot = new Telegraf(token);
const tg = new Telegram(token)

let auth = null

const usersSchedules = {}

const getBtnMarkup = (text, callbackData, showTick = false) => {
    const btnText = text + (showTick === true ? ' ✅' : '')

    return {text: btnText, callback_data: callbackData}
}

const start = async function () {
    bot.command('schedule', sendSchedule)
    bot.on('callback_query', onDayPick);
    auth = await authorize()
    bot.launch();
}

const onDayPick = async (ctx) => {
    const chatId = ctx.update.callback_query.message.chat.id
    const messageId = ctx.update.callback_query.message.message_id
    const username = ctx.update.callback_query.from.username
    const userSchedule = getUserSchedule(username)
    const data = ctx.update.callback_query.data

    userSchedule[data] = !userSchedule[data]

    const userFullName = await getUserNameByNickname(auth, username)
    const index = await getUserRowIndexInAvailabilitySheet(auth, userFullName) + 1

    if(data === notAvailableInstructor) {
        clearAllDaysIfInstructorUnavailable(username)
        clearAllSelectedDaysByInstructor(auth, index)
    }else {
        makeInstructorAvailableIfDayChosen(username)
        normalizeUnavailableCheckbox(auth, index)
    }

    const updatedUserMarkup = JSON.parse(getUserReplyMarkup(userSchedule).reply_markup)

    toggleDayOfTheWeek(auth, index, dayNamesByCellsLettersInSheet[data])

    tg.editMessageReplyMarkup(chatId, messageId, null, updatedUserMarkup)
    ctx.answerCbQuery();
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
                ],
                [
                    getBtnMarkup(wednesday, wednesday, userSchedule[wednesday]),

                    getBtnMarkup(thursday, thursday, userSchedule[thursday]),

                    // getBtnMarkup(saturday, saturday, userSchedule[saturday])
                ],
                [
                    getBtnMarkup(friday, friday, userSchedule[friday]),

                    // getBtnMarkup(sunday, sunday, userSchedule[sunday])
                ],
                [

                    getBtnMarkup(notAvailableInstructor, notAvailableInstructor, userSchedule[notAvailableInstructor])

                    // getBtnMarkup(notAvailableInstructor, notAvailableInstructor, userSchedule[notAvailableInstructor])
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

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');


async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
}


async function saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
}

async function authorize() {
    let cl = await loadSavedCredentialsIfExist();
    if (cl) {
        return cl;
    }
    cl = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    if (cl.credentials) {
        await saveCredentials(cl);
    }
    return cl;
}

start()
