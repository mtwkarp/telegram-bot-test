const { Telegram } = require('telegraf');
const cron = require('node-cron');
const {
  channelScheduleReminder1,
  channelScheduleReminder2,
  privateMsgScheduleReminder1,
  privateMsgScheduleReminder2,
  timeConfig,
  everyDayTeachingReminder
} = require('../../../constants/timeConstants');
const replyMessages = require('../../../constants/replyMessages.js');
const EveryDayScheduleMessenger = require('./messengerModules/EveryDayScheduleMessenger.js');
const DateHelper = require('../../../helpers/DateHelper.js');

class ScheduledMessenger {
  constructor(scheduleSheetsManager) {
    this.scheduleSheetsManager = scheduleSheetsManager;

    this.messengerModules = [];
    this.tg = null;

    this.createTelegramInstance();
    this.initMessengerModules();
    this.setScheduledMessages();
  }

  createTelegramInstance() {
    let token = null;

    if (process.env.mode === 'development') {
      token = process.env.TELEGRAM_BOT_TOKEN_DEVELOPMENT;
    } else {
      token = process.env.TELEGRAM_BOT_TOKEN;
    }

    this.tg = new Telegram(token);
  }

  initMessengerModules() {
    const messengerModules = [EveryDayScheduleMessenger];

    messengerModules.forEach((M) => {
      const module = new M(this.tg, this.scheduleSheetsManager);
      this.messengerModules.push(module);
    });
  }

  setScheduledMessages() {
    this.messengerModules.forEach((m) => m.setScheduledMessages());
    this.setPrivateMsgScheduleReminders();
    this.setChannelScheduleReminder();
    this.setNextDayInstructorsReminders();
  }

  setPrivateMsgScheduleReminders() {
    cron.schedule(privateMsgScheduleReminder1, this.sendScheduleStartPrivateReminders.bind(this), timeConfig);
    cron.schedule(privateMsgScheduleReminder2, this.sendScheduleStartPrivateReminders.bind(this), timeConfig);
  }

  async sendScheduleStartPrivateReminders() {
    const noResponseInstructors = await this.scheduleSheetsManager.getInstructorsChatIdsWithNoScheduleResponse(); // {chatId, name}

    for (let i = 0; i < noResponseInstructors.length; i++) {
      const {chatId, name} = noResponseInstructors[i];
      let surname = name.split(' ')[1];

      if (surname === undefined) surname = name.split(' ')[0];
      try {
        await this.tg.sendMessage(chatId, replyMessages.schedule.privateScheduleReminder(surname));
      } catch (err) {
        console.log(err);
      }
    }
  }

  setChannelScheduleReminder() {
    cron.schedule(channelScheduleReminder1, this.sendScheduleStartReminderToChannel.bind(this), timeConfig);
    cron.schedule(channelScheduleReminder2, this.sendScheduleStartReminderToChannel.bind(this), timeConfig);
  }

  sendScheduleStartReminderToChannel() {
    this.tg.sendMessage(process.env.TELEGRAM_CHANNEL_ID, replyMessages.schedule.channelScheduleReminder);
  }

  setNextDayInstructorsReminders() {
    cron.schedule(everyDayTeachingReminder, this.sendTomorrowInstructorsReminders.bind(this), timeConfig);
  }

  async checkIfNextDayWorkable() {
    const nextDayStatus = await this.scheduleSheetsManager.getNextDayWorkStatusInfo();

    if (nextDayStatus === 'FALSE') return false;

    if (nextDayStatus === 'TRUE') return true;
  }

  async sendTomorrowInstructorsReminders() {
    const isDayWorkable = await this.checkIfNextDayWorkable();

    if (isDayWorkable === false) return;

    const tomorrowInstructorsByBase = await this.scheduleSheetsManager.getTomorrowInstructorsByBase(DateHelper.nextDayName);

    const basesTranslation = {
      ['blood']: 'кров🩸',
      ['lungs']: 'легені🫁',
      ['heart']: 'серце❤',
      ['evacuation']: 'евакуація🚑'
    };

    for (const baseName in tomorrowInstructorsByBase) {
      const instructorsData = tomorrowInstructorsByBase[baseName];

      for (let i = 0; i < instructorsData.length; i++) {
        const {chatId, name} = instructorsData[i];
        let firstName = name.split(' ')[1];

        if (firstName === undefined) firstName = name.split(' ')[0];

        try {
          await this.tg.sendMessage(chatId, replyMessages.schedule.everyDayInstructorReminder(basesTranslation[baseName], firstName));
        } catch (err) {
          console.log(err);
        }
      }
    }
  }
}

module.exports = ScheduledMessenger;
