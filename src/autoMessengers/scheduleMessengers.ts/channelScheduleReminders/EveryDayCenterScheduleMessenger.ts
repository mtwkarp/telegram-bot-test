import cron from 'node-cron';
import ScheduleMessenger from '../ScheduleMessenger';
import {renderOneDayScheduleFromSheet} from '../helpers';
import RenderedScheduleSheetCenter
  from '../../../googleServices/gsheets/scheduleSheet/scheduleSheets/RenderedScheduleSheetCenter';
import ScheduleUpdatesCollection
  from "../../../db/firestore/collectionManagers/implementations/ScheduleUpdatesCollection";
import DateHelper from "../../../helpers/DateHelper";

export default class EveryDayCenterScheduleMessenger extends ScheduleMessenger {
  protected readonly renderedScheduleSheet: RenderedScheduleSheetCenter;

  constructor() {
    super();
    this.renderedScheduleSheet = new RenderedScheduleSheetCenter();
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

    let fullScheduleString = renderOneDayScheduleFromSheet(nextDayFullSchedule);

    fullScheduleString = fullScheduleString.replace (/^/,'ЦЕНТР\n');

    try {
      const message = await this.tg.sendMessage(process.env.TELEGRAM_CHANNEL_ID as string, fullScheduleString);
      ScheduleUpdatesCollection.getInstance().setCenterOneDayScheduleMessageId(DateHelper.nextDayName, message.message_id)
    } catch (err) {
      console.log('Error on sending everyday schedule to channel', err);
    }
  }
}
