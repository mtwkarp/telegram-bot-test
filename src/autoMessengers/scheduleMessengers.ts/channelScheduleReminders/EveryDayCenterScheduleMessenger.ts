import cron from 'node-cron';
import ScheduleMessenger from '../ScheduleMessenger';
import {renderOneDayScheduleFromSheet} from './helpers';

export default class EveryDayCenterScheduleMessenger extends ScheduleMessenger {
  constructor() {
    super();
  }

  setScheduledMessages() {
    const everyDayFullScheduleReminder: string = this.timeCollection.getScheduleTime('every_day_full_schedule_reminder');
    const timeConfig: { scheduled: boolean, timezone: string } = this.timeCollection.getTimeConfig('kyiv_time');

    cron.schedule(everyDayFullScheduleReminder, this.sendFullNextDaySchedule.bind(this), timeConfig);
  }

  private async sendFullNextDaySchedule() {
    const isDayWorkable: boolean = await this.renderedScheduleSheet.isCenterNextDayWorkable();

    if (!isDayWorkable) return;

    const nextDayFullSchedule: string[][] = await this.renderedScheduleSheet.getCenterNextDayFullSchedule();

    let fullScheduleString = renderOneDayScheduleFromSheet(nextDayFullSchedule);

    fullScheduleString = fullScheduleString.replace (/^/,'ЦЕНТР\n');

    try {
      await this.tg.sendMessage(process.env.TELEGRAM_CHANNEL_ID as string, fullScheduleString);
    } catch (err) {
      console.log('Error on sending everyday schedule to channel', err);
    }
  }
}
