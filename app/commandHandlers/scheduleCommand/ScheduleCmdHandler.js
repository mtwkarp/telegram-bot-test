const BotCmdHandler = require('../BotCmdHandler.js');
const {sheets_service_name} = require('../../constants/googleServicesNames.js');
const {dayNames, notAvailableInstructor, confirmScheduleBtnText} = require('../../constants/spreadsheetsConstants');
const replyMessages = require('../../constants/replyMessages.js');
const ScheduleSheetsManager = require('./ScheduleSheetsManager.js');
const ScheduleViewManager = require('./ScheduleViewManager.js');
const cron = require('node-cron');
const {openScheduleTime, closeScheduleTime, timeConfig} = require('../../constants/timeConstants.js');
const UserData = require('./UserData.js');
const ScheduledMessenger = require('./scheduleMessenger/ScheduledMessenger.js');

class ScheduleCmdHandler extends BotCmdHandler {
  constructor(bot) {
    super(bot);

    this.scheduleSheetsManager = new ScheduleSheetsManager();
    this.scheduleViewManager = new ScheduleViewManager();
    this.scheduledMessenger = new ScheduledMessenger(this.scheduleSheetsManager);

    this.commands = {
      schedule: { command: 'schedule', description: 'Надіслати розклад' }
    };

    this.usersData = {};
    this.scheduleOpen = true;
    this.setScheduleAvailabilityTime();
  }

  setScheduleAvailabilityTime() {
    cron.schedule(openScheduleTime, this.openSchedule.bind(this), timeConfig);
    cron.schedule(closeScheduleTime, this.closeSchedule.bind(this), timeConfig);
  }

  openSchedule() {
    this.scheduleOpen = true;
  }

  closeSchedule() {
    this.scheduleOpen = false;
  }

  initCommand() {
    this.bot.command(this.commands.schedule.command, (ctx) =>
      this.requestScheduleMarkup(ctx)
    );
  }

  onCallbackQuery(ctx) {
    this.onButtonClick(ctx);
  }
  // change
  notifyUserAboutClosedSchedule(ctx) {
    let chatId = null;

    if (ctx.update.callback_query) {
      chatId = ctx.update.callback_query.message.chat.id;
    } else {
      chatId = ctx.update.message.chat.id;
    }

    ctx.telegram.sendMessage(chatId, replyMessages.schedule.scheduleClosed);
  }

  notifyUserToFillSchedule(ctx) {
    const chatId = ctx.update.callback_query.message.chat.id;
    ctx.telegram.sendMessage(chatId, replyMessages.schedule.scheduleMustBeFilledBeforeSending);
  }

  notifyNotASMUserInstructor(ctx) {
    const chatId = ctx.update.message.chat.id;

    ctx.telegram.sendMessage(chatId, replyMessages.schedule.userNotASMInstructor);
  }

  async requestScheduleMarkup(ctx) {
    if (this.scheduleOpen === false) {
      this.notifyUserAboutClosedSchedule(ctx);

      return;
    }

    if ((await this.checkIfUserIsASMInstructor(ctx)) === false) {
      this.notifyNotASMUserInstructor(ctx);

      return;
    }

    this.sendScheduleMarkup(ctx);
  }

  createUserDataObj(userId) {
    this.usersData[userId] = new UserData(userId);
    this.writeUserEmptySchedule(userId);
  }

  async sendScheduleMarkup(ctx) {
    const userId = ctx.from.id;

    if (this.usersData[userId] === undefined) this.createUserDataObj(userId);

    this.writeUserEmptySchedule(userId);

    const userSchedule = this.getUserSchedule(userId);
    const userMarkup =
            this.scheduleViewManager.getUserReplyMarkup(userSchedule);

    const message = await ctx.telegram.sendMessage(
        ctx.update.message.chat.id,
        replyMessages.schedule.scheduleMarkupDescription,
        userMarkup
    );

    this.activeUserMessages[ctx.from.id.toString()] = message.message_id;
    this.usersData[userId].scheduleConfirmed = false;
  }

  writeUserEmptySchedule(userId) {
    this.usersData[userId].schedule = this.getUserEmptySchedule();
  };

  getUserSchedule = (userId) => {
    return this.usersData[userId].schedule;
  };

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
    };
  }

  async confirmSchedule(ctx) {
    const userId = ctx.update.callback_query.from.id;

    if (this.scheduleOpen === false) {
      this.notifyUserAboutClosedSchedule(ctx);

      return;
    }

    const userSchedule = this.getUserSchedule(userId);

    if (this.checkIfScheduleFilled(userSchedule) === false) {
      this.notifyUserToFillSchedule(ctx);

      return;
    }

    this.usersData[userId].scheduleConfirmed = true;

    this.updateScheduleMarkupAfterConfirm(ctx);
    this.sendConfirmedScheduleToSpreadsheet(ctx);
  }

  async updateScheduleMarkupAfterConfirm(ctx) {
    const chatId = ctx.update.callback_query.message.chat.id;
    const userId = ctx.update.callback_query.from.id;
    const messageId = ctx.update.callback_query.message.message_id;

    ctx.telegram.sendMessage(chatId, replyMessages.schedule.confirmedScheduleReply);

    const userSchedule = this.getUserSchedule(userId);
    const updatedUserMarkup = JSON.parse(this.scheduleViewManager.getUserReplyMarkup(userSchedule, true).reply_markup);

    await ctx.telegram.editMessageReplyMarkup(
        chatId,
        messageId,
        null,
        updatedUserMarkup
    );
  }

  sendMessageIfScheduleConfirmed(ctx) {
    const messageId = ctx.update.callback_query.message.message_id;
    const chatId = ctx.update.callback_query.message.chat.id;
    const userId = ctx.update.callback_query.from.id;

    if (messageId !== this.activeUserMessages[userId]) {
      ctx.telegram.sendMessage(chatId, replyMessages.schedule.chosenScheduleMarkupNotActive);
    } else {
      ctx.telegram.sendMessage(chatId, replyMessages.schedule.scheduleAlreadyConfirmed);
    }
  }

  async onButtonClick(ctx) {
    const userId = ctx.update.callback_query.from.id;

    if (this.usersData[userId].scheduleConfirmed) {
      this.sendMessageIfScheduleConfirmed(ctx);

      return;
    }

    const data = ctx.update.callback_query.data;

    if (data === confirmScheduleBtnText) {
      await this.confirmSchedule(ctx);

      return;
    }

    const chatId = ctx.update.callback_query.message.chat.id;
    const messageId = ctx.update.callback_query.message.message_id;
    const userSchedule = this.getUserSchedule(userId);

    userSchedule[data] = !userSchedule[data];

    if (data === notAvailableInstructor) {
      this.clearAllDaysIfInstructorUnavailable(userId);
    } else {
      this.makeInstructorAvailableIfDayChosen(userId);
    }

    const updatedUserMarkup = JSON.parse(
        this.scheduleViewManager.getUserReplyMarkup(userSchedule).reply_markup
    );

    const previouslySentReplyMarkup = this.usersData[userId].previouslySentReplyMarkup;

    const markupEqualityCheck = JSON.stringify(updatedUserMarkup) === JSON.stringify(previouslySentReplyMarkup);
    this.usersData[userId].previouslySentReplyMarkup = JSON.parse(this.scheduleViewManager.getUserReplyMarkup(userSchedule).reply_markup);

    if (markupEqualityCheck === false) {
      await ctx.telegram.editMessageReplyMarkup(
          chatId,
          messageId,
          null,
          updatedUserMarkup
      );
    }

    await ctx.answerCbQuery();
  }

  clearAllDaysIfInstructorUnavailable(userId) {
    const userSchedule = this.getUserSchedule(userId);

    if (userSchedule[notAvailableInstructor] === true) {
      for (const userScheduleKey in userSchedule) {
        if (userScheduleKey === notAvailableInstructor) continue;

        userSchedule[userScheduleKey] = false;
      }
    }
  }

  makeInstructorAvailableIfDayChosen(userId) {
    const userSchedule = this.getUserSchedule(userId);

    userSchedule[notAvailableInstructor] = false;
  }

  async sendConfirmedScheduleToSpreadsheet(ctx) {
    const userId = ctx.update.callback_query.from.id;

    this.scheduleSheetsManager.sendConfirmedScheduleToSpreadsheet(ctx, this.getUserSchedule(userId));
  }

  checkIfScheduleFilled(userSchedule) {
    for (const dayKey in userSchedule) {
      if (userSchedule[dayKey] === true) return true;
    }

    return false;
  }

  async checkIfUserIsASMInstructor(ctx) {
    const userId = ctx.from.id;
    const userData = this.usersData[userId];
    if (userData !== undefined && userData.isASMInstructor === true) {
      return true;
    }

    const isUserAsmInstructor = await this.scheduleSheetsManager.checkASMInstructorIdExistence(userId);

    if (isUserAsmInstructor === true) {
      this.createUserDataObj(userId);
      this.usersData[userId].isASMInstructor = true;
    }

    return isUserAsmInstructor;
  }
}

module.exports = ScheduleCmdHandler;
