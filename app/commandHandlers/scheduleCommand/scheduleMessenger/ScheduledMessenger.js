const { Telegram } = require('telegraf');
const EveryDayScheduleMessenger = require('./messengerModules/EveryDayScheduleMessenger.js');
const ScheduleEnrolmentMessenger = require('./messengerModules/ScheduleEnrolmentMessenger.js');
const NextDayInstructorReminderMessenger = require('./messengerModules/NextDayInstructorReminderMessenger.js');
const ScheduleSheetsManager = require('../ScheduleSheetsManager.js');

class ScheduledMessenger {
  constructor() {
    this.scheduleSheetsManager = new ScheduleSheetsManager();

    this.messengerModules = [];
    this.tg = new Telegram(process.env.TELEGRAM_BOT_TOKEN);

    this.initMessengerModules();
  }

  initMessengerModules() {
    const messengerModules = [EveryDayScheduleMessenger, ScheduleEnrolmentMessenger, NextDayInstructorReminderMessenger];

    messengerModules.forEach((M) => {
      const module = new M(this.tg, this.scheduleSheetsManager);
      module.setScheduledMessages();
      this.messengerModules.push(module);
    });
  }
}

module.exports = ScheduledMessenger;
