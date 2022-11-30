const MessengerModule = require('./MessengerModule.js');
const cron = require('node-cron');
const FirebaseDB = require('../../../../google/FireStoreDB');

class EveryDayScheduleMessenger extends MessengerModule {
  constructor(tg, scheduleSheetsManager) {
    super(tg, scheduleSheetsManager);
  }

  setScheduledMessages() {
    const everyDayFullScheduleReminder = FirebaseDB.getTimeValueData('schedule', 'every_day_full_schedule_reminder');
    const timeConfig = FirebaseDB.getTimeValueData('time_configs', 'kyiv_time');

    cron.schedule(everyDayFullScheduleReminder, this.sendFullNextDaySchedule.bind(this), timeConfig);
  }

  async sendFullNextDaySchedule() {
    const isDayWorkable = await this.scheduleSheetsManager.isNextDayWorkable();

    if (isDayWorkable === false) return;

    const nextDayFullSchedule = await this.scheduleSheetsManager.getNextDayFullSchedule();

    let fullScheduleString = '';

    for (let i = 0; i < nextDayFullSchedule.length; i++) {
      if (nextDayFullSchedule[i].length === 0) continue;
      const str = nextDayFullSchedule[i][0];
      let paragraph = '\n';

      if (i > 1) paragraph = '\n\n';

      fullScheduleString = fullScheduleString + paragraph + str;
    }

    this.tg.sendMessage(process.env.TELEGRAM_CHANNEL_ID, fullScheduleString);
  }
}

module.exports = EveryDayScheduleMessenger;
