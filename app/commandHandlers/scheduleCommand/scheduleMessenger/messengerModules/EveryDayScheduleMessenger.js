const MessengerModule = require('./MessengerModule.js');
const { timeConfig, everyDayFullScheduleReminder} = require('../../../../constants/timeConstants');
const cron = require('node-cron');

class EveryDayScheduleMessenger extends MessengerModule {
  constructor(tg, scheduleSheetsManager) {
    super(tg, scheduleSheetsManager);
  }

  setScheduledMessages() {
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
