const BotCmdHandler = require('./BotCmdHandler.js')
const {sheets_service_name} = require('../constants/googleServicesNames.js')
const {dayNames, notAvailableInstructor, confirmScheduleBtnText, SPREADSHEETID, dayNamesByCellsLettersInSheet} = require("../../constants/spreadsheetsConstants");
const replyMessages = require('../constants/replyMessages.js')

class ScheduleCmdHandler extends BotCmdHandler{
    constructor(bot, services) {
        super(bot, services);

        this.spreadsheet = this.services.sheets.spreadsheet

        this.commands = {
            schedule: {command: 'schedule', description: 'Надіслати розклад'}
        }

        this.previouslySentReplyMarkup = {} //example: {[username]: reply_markup {} (from getUserReplyMarkup)}
        this.usersSchedules = {}

        this.scheduleConfirmed = false
    }

    initCommand() {
        this.bot.command(this.commands.schedule.command, (ctx) => this.sendScheduleMarkup(ctx))
    }

    onCallbackQuery(ctx) {
        this.onButtonClick(ctx)
    }

    async sendScheduleMarkup (ctx) {
        const userName = ctx.from.username
        this.writeUserEmptySchedule(userName)

        const userSchedule = this.getUserSchedule(userName)
        const userMarkup = this.getUserReplyMarkup(userSchedule)

        const message = await ctx.telegram.sendMessage(ctx.update.message.chat.id, replyMessages.schedule.scheduleMarkupDescription,userMarkup)

        this.activeMessageId = message.message_id
        this.scheduleConfirmed = false
    }

    writeUserEmptySchedule = (username) => {
        this.usersSchedules[username] = this.getUserEmptySchedule()
    }

    getUserSchedule = (userName) => {
        return this.usersSchedules[userName]
    }

    getUserEmptySchedule() {
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

    getUserReplyMarkup = (userSchedule, scheduleConfirmed = false) => {
        const {monday, tuesday, wednesday, thursday, friday, saturday, sunday} = dayNames

        return {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [
                        this.getChosenDayBtnMarkup(monday, monday, userSchedule[monday]),
                        this.getChosenDayBtnMarkup(tuesday, tuesday, userSchedule[tuesday]),
                        this.getChosenDayBtnMarkup(wednesday, wednesday, userSchedule[wednesday]),

                    ],
                    [

                        this.getChosenDayBtnMarkup(thursday, thursday, userSchedule[thursday]),

                        this.getChosenDayBtnMarkup(saturday, saturday, userSchedule[saturday]),
                        this.getChosenDayBtnMarkup(friday, friday, userSchedule[friday]),

                    ],
                    [
                        this.getChosenDayBtnMarkup(sunday, sunday, userSchedule[sunday]),
                        this.getChosenDayBtnMarkup(notAvailableInstructor, notAvailableInstructor, userSchedule[notAvailableInstructor])
                    ],
                    [
                        this.getConfirmButtonMarkup(scheduleConfirmed)
                    ]
                ]
            })
        }
    }

    getConfirmButtonMarkup(scheduleConfirmed = false) {
        const btnText = confirmScheduleBtnText + (scheduleConfirmed === false ? ' ➡' : '🔥')

        return {text: btnText, callback_data: confirmScheduleBtnText}
    }

    getChosenDayBtnMarkup(text, callbackData, showTick = false) {
        const btnText = text + (showTick === true ? ' ✅' : '')

        return {text: btnText, callback_data: callbackData}
    }

    async confirmSchedule(ctx) {
        this.scheduleConfirmed = true

        this.updateScheduleMarkupAfterConfirm(ctx)
        this.sendConfirmedScheduleToSpreadsheet(ctx)
    }

    async updateScheduleMarkupAfterConfirm(ctx) {
        const chatId = ctx.update.callback_query.message.chat.id,
            username = ctx.update.callback_query.from.username,
            messageId = ctx.update.callback_query.message.message_id

        ctx.telegram.sendMessage(chatId, replyMessages.schedule.confirmedScheduleReply)

        const userSchedule = this.getUserSchedule(username)
        const updatedUserMarkup = JSON.parse(this.getUserReplyMarkup(userSchedule, true).reply_markup)

        await ctx.telegram.editMessageReplyMarkup(chatId, messageId, null, updatedUserMarkup)
    }

    sendMessageIfScheduleConfirmed(ctx) {
        const messageId = ctx.update.callback_query.message.message_id,
         chatId = ctx.update.callback_query.message.chat.id

        if(messageId !== this.activeMessageId) {
            ctx.telegram.sendMessage(chatId, replyMessages.schedule.chosenScheduleMarkupNotActive)
        }else {
            ctx.telegram.sendMessage(chatId, replyMessages.schedule.scheduleAlreadyConfirmed)
        }
    }

    async onButtonClick(ctx) {
        if(this.scheduleConfirmed) {
            this.sendMessageIfScheduleConfirmed(ctx)

            return
        }

        const data = ctx.update.callback_query.data

        if(data === confirmScheduleBtnText) {
            await this.confirmSchedule(ctx)

            return
        }

        const chatId = ctx.update.callback_query.message.chat.id
        const messageId = ctx.update.callback_query.message.message_id
        const username = ctx.update.callback_query.from.username
        const userSchedule = this.getUserSchedule(username)

        userSchedule[data] = !userSchedule[data]

        if(data === notAvailableInstructor) {
            this.clearAllDaysIfInstructorUnavailable(username)
        }else {
            this.makeInstructorAvailableIfDayChosen(username)
        }

        const updatedUserMarkup = JSON.parse(this.getUserReplyMarkup(userSchedule).reply_markup)

        const markupEqualityCheck = JSON.stringify(updatedUserMarkup) === JSON.stringify(this.previouslySentReplyMarkup[username])
        this.previouslySentReplyMarkup[username] = JSON.parse(this.getUserReplyMarkup(userSchedule).reply_markup)

        if(markupEqualityCheck === false) {
            await ctx.telegram.editMessageReplyMarkup(chatId, messageId, null, updatedUserMarkup)
        }

        await ctx.answerCbQuery();


        // if(data === notAvailableInstructor) {
        //     // await clearAllDaysIfInstructorUnavailable(username)
        //     await clearAllSelectedDaysByInstructor(sheet, index)//1 request
        // }else {
        //     // makeInstructorAvailableIfDayChosen(username)
        //     await normalizeUnavailableCheckbox(sheet, index)//2 requests
        // }
        //
        // await toggleDayOfTheWeek(sheet, index, dayNamesByCellsLettersInSheet[data])//2 requests
    }

    clearAllDaysIfInstructorUnavailable (username) {
        const userSchedule = this.getUserSchedule(username)

        if(userSchedule[notAvailableInstructor] === true) {
            for (const userScheduleKey in userSchedule) {
                if(userScheduleKey === notAvailableInstructor) continue

                userSchedule[userScheduleKey] = false
            }
        }
    }

    makeInstructorAvailableIfDayChosen (username) {
        const userSchedule = this.getUserSchedule(username)

        userSchedule[notAvailableInstructor] = false
    }

    async sendConfirmedScheduleToSpreadsheet(ctx) {
        const username = ctx.update.callback_query.from.username
        const userFullName = await this.getUserNameByNickname(username)
        const userRowIndex = await this.getUserRowIndexInAvailabilitySheet(userFullName)

        console.log(userFullName, userRowIndex)
        await this.clearPreviousSchedule(userRowIndex)
    }

    async clearPreviousSchedule(rowIndex) {
        const mondayCell = dayNamesByCellsLettersInSheet[dayNames.monday] + rowIndex
        const fridayCell = dayNamesByCellsLettersInSheet[notAvailableInstructor] + rowIndex
        const range = `Доступність інструкторів!${mondayCell}:${fridayCell}`

        try {
            await this.spreadsheet.spreadsheets.values.update({
                spreadsheetId: SPREADSHEETID,
                range,
                valueInputOption: 'USER_ENTERED',
                resource: { range, majorDimension: "COLUMNS", values: [
                        ['FALSE'],
                        ['FALSE'],
                        ['FALSE'],
                        ['FALSE'],
                        ['FALSE'],
                        ['FALSE'],
                        ['FALSE'],
                        ['FALSE']
                    ] },
                // auth
            });
        }catch (err) {
            console.log('blyat')
            throw err;
        }
    }

    async getUserNameByNickname ( nickname) {
        const namesLetter = 'A'
        const nicknameLetter = 'B'
        // const sheet = google.sheets({version: 'v4', auth});
        const namesData = await this.spreadsheet.spreadsheets.values.get({
            spreadsheetId: SPREADSHEETID,
            range: `Список інструкторів!${namesLetter}:${namesLetter}`,
        });

        const instructorsNames = namesData.data.values;

        if (!instructorsNames || instructorsNames.length === 0) {
            console.log('No names data found.');
            return;
        }

        const nicknamesData = await this.spreadsheet.spreadsheets.values.get({
            spreadsheetId: SPREADSHEETID,
            range: `Список інструкторів!${nicknameLetter}:${nicknameLetter}`,
        });

        const instructorsNicks = nicknamesData.data.values;

        if (!instructorsNicks || instructorsNicks.length === 0) {
            console.log('No nicknames data found.');
            return;
        }
        let name = ''

        for (let i = 0; i < instructorsNicks.length; i++) {
            const resultNickname = instructorsNicks[i][0]

            if(resultNickname === undefined) continue

            if(resultNickname === nickname) {
                name = instructorsNames[i][0]
                break
            }
        }

        if(name === '') console.log('Name not found')

        return name
    }

    async getUserRowIndexInAvailabilitySheet(userFullName) {
        // const sheet = google.sheets({version: 'v4', auth});
        const namesData = await this.spreadsheet.spreadsheets.values.get({
            spreadsheetId: SPREADSHEETID,
            range: `Доступність інструкторів!A:A`,
        });
        const namesList = namesData.data.values
// console.log(namesList, userFullName)
        let rowIndex = null

        for (let i = 0; i < namesList.length; i++) {
            const name = namesList[i][0]

            if(userFullName === name) {
                rowIndex = i
                break
            }
        }

        return rowIndex
    }

    static _SERVICES = [sheets_service_name]
}

module.exports = ScheduleCmdHandler