const BotCmdHandler = require('../BotCmdHandler.js')
const {sheets_service_name} = require('../../constants/googleServicesNames.js')
const {dayNames, notAvailableInstructor, confirmScheduleBtnText, SPREADSHEETID, dayNamesByCellsLettersInSheet} = require("../../constants/spreadsheetsConstants");
const replyMessages = require('../../constants/replyMessages.js')
const ScheduleSheetsManager = require('./ScheduleSheetsManager.js')
const ScheduleViewManager = require('./ScheduleViewManager.js')
const cron = require('node-cron');


class ScheduleCmdHandler extends BotCmdHandler{
    constructor(bot, services) {
        super(bot, services);

        this.scheduleSheetsManager = new ScheduleSheetsManager(this.services.sheets)
        this.scheduleViewManager = new ScheduleViewManager()

        this.commands = {
            schedule: {command: 'schedule', description: 'Надіслати розклад'}
        }

        this.previouslySentReplyMarkup = {} //example: {[userId]: reply_markup {} (from scheduleViewManager.getUserReplyMarkup)}
        this.usersSchedules = {}

        this.scheduleConfirmed = false
        this.scheduleOpen = true
        this.setScheduleAvailabilityTime()
    }

// # ┌────────────── second (optional)
// # │ ┌──────────── minute
// # │ │ ┌────────── hour
// # │ │ │ ┌──────── day of month
// # │ │ │ │ ┌────── month
// # │ │ │ │ │ ┌──── day of week
// # │ │ │ │ │ │
// # │ │ │ │ │ │
// # * * * * * *
    setScheduleAvailabilityTime() {
        const scheduleOpenTime = '0 03 16 * * Tuesday',
         scheduleCloseTime = '0 04 16 * * Tuesday',
         config = {
            scheduled: true,
            timezone: "Europe/Kiev"
        };
        // const isTimeExpressionValid = cron.validate(scheduleOpenTime)

        cron.schedule(scheduleOpenTime, this.openSchedule.bind(this), config);

        cron.schedule(scheduleCloseTime, this.closeSchedule.bind(this), config);
    }

    openSchedule() {
        console.log('Open schedule');
        this.scheduleOpen = true
    }

    closeSchedule() {
        console.log('Close schedule');
        this.scheduleOpen = false
    }

    initCommand() {
        this.bot.command(this.commands.schedule.command, (ctx) => this.sendScheduleMarkup(ctx))
    }

    onCallbackQuery(ctx) {
        this.onButtonClick(ctx)
    }

    notifyUserAboutClosedSchedule(ctx) {
        const chatId = ctx.update.callback_query.message.chat.id;

        ctx.telegram.sendMessage(chatId, replyMessages.schedule.scheduleClosed)
    }
x
    async sendScheduleMarkup (ctx) {
        if(this.scheduleOpen === false) {
            this.notifyUserAboutClosedSchedule(ctx)

            return
        }

        const userId = ctx.from.id
        this.writeUserEmptySchedule(userId)

        const userSchedule = this.getUserSchedule(userId)
        const userMarkup = this.scheduleViewManager.getUserReplyMarkup(userSchedule)

        const message = await ctx.telegram.sendMessage(ctx.update.message.chat.id, replyMessages.schedule.scheduleMarkupDescription,userMarkup)

        this.activeUserMessages[ctx.from.id.toString()] = message.message_id
        this.scheduleConfirmed = false
    }

    writeUserEmptySchedule = (userId) => {
        this.usersSchedules[userId] = this.getUserEmptySchedule()
    }

    getUserSchedule = (userId) => {
        return this.usersSchedules[userId]
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

    async confirmSchedule(ctx) {
        this.scheduleConfirmed = true

        this.updateScheduleMarkupAfterConfirm(ctx)
        this.sendConfirmedScheduleToSpreadsheet(ctx)
    }

    async updateScheduleMarkupAfterConfirm(ctx) {
        const chatId = ctx.update.callback_query.message.chat.id,
            userId = ctx.update.callback_query.from.id,
            messageId = ctx.update.callback_query.message.message_id

        ctx.telegram.sendMessage(chatId, replyMessages.schedule.confirmedScheduleReply)

        const userSchedule = this.getUserSchedule(userId)
        const updatedUserMarkup = JSON.parse(this.scheduleViewManager.getUserReplyMarkup(userSchedule, true).reply_markup)

        await ctx.telegram.editMessageReplyMarkup(chatId, messageId, null, updatedUserMarkup)
    }

    sendMessageIfScheduleConfirmed(ctx) {
        const messageId = ctx.update.callback_query.message.message_id,
         chatId = ctx.update.callback_query.message.chat.id,
            userId = ctx.update.callback_query.from.id

        if(messageId !== this.activeUserMessages[userId]) {
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
        const userId = ctx.update.callback_query.from.id
        const userSchedule = this.getUserSchedule(userId)

        userSchedule[data] = !userSchedule[data]

        if(data === notAvailableInstructor) {
            this.clearAllDaysIfInstructorUnavailable(userId)
        }else {
            this.makeInstructorAvailableIfDayChosen(userId)
        }

        const updatedUserMarkup = JSON.parse(this.scheduleViewManager.getUserReplyMarkup(userSchedule).reply_markup)

        const markupEqualityCheck = JSON.stringify(updatedUserMarkup) === JSON.stringify(this.previouslySentReplyMarkup[userId])
        this.previouslySentReplyMarkup[userId] = JSON.parse(this.scheduleViewManager.getUserReplyMarkup(userSchedule).reply_markup)

        if(markupEqualityCheck === false) {
            await ctx.telegram.editMessageReplyMarkup(chatId, messageId, null, updatedUserMarkup)
        }

        await ctx.answerCbQuery();
    }

    clearAllDaysIfInstructorUnavailable (userId) {
        const userSchedule = this.getUserSchedule(userId)

        if(userSchedule[notAvailableInstructor] === true) {
            for (const userScheduleKey in userSchedule) {
                if(userScheduleKey === notAvailableInstructor) continue

                userSchedule[userScheduleKey] = false
            }
        }
    }

    makeInstructorAvailableIfDayChosen (userId) {
        const userSchedule = this.getUserSchedule(userId)

        userSchedule[notAvailableInstructor] = false
    }

    async sendConfirmedScheduleToSpreadsheet(ctx) {
        const userId = ctx.update.callback_query.from.id

        this.scheduleSheetsManager.sendConfirmedScheduleToSpreadsheet(ctx, this.getUserSchedule(userId))
    }



    static _SERVICES = [sheets_service_name]
}

module.exports = ScheduleCmdHandler