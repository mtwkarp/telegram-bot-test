import cron from 'node-cron';
import ScheduleMessenger from './ScheduleMessenger';

export default class EveryDayScheduleMessenger extends ScheduleMessenger {
  constructor() {
    super();
  }

  setScheduledMessages() {
    const everyDayFullScheduleReminder: string = this.timeCollection.getScheduleTime('every_day_full_schedule_reminder');
    const timeConfig: { scheduled: boolean, timezone: string } = this.timeCollection.getTimeConfig('kyiv_time');

    cron.schedule(everyDayFullScheduleReminder, this.sendFullNextDaySchedule.bind(this), timeConfig);
  }

  private async sendFullNextDaySchedule() {
    const isDayWorkable: boolean = await this.renderedScheduleSheet.isNextDayWorkable();

    if (!isDayWorkable) return;

    const nextDayFullSchedule: string[][] = await this.renderedScheduleSheet.getNextDayFullSchedule();

    let fullScheduleString = '';

    for (let i = 0; i < nextDayFullSchedule.length; i++) {
      if (nextDayFullSchedule[i].length === 0) continue;

      const str: string = nextDayFullSchedule[i][0];
      let paragraph = '\n';

      if (i > 1) paragraph = '\n\n';

      fullScheduleString = fullScheduleString + paragraph + str;
    }
    try {
      await this.tg.sendMessage(process.env.TELEGRAM_CHANNEL_ID as string, fullScheduleString);
    } catch (err) {
      console.log('Error on sending everyday schedule to channel', err);
    }
  }
}
