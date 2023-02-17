import cron from 'node-cron';
import ScheduleMessenger from '../ScheduleMessenger';
import {renderOneDayScheduleFromSheet} from './helpers';
import RenderedScheduleSheetTrips
    from '../../../googleServices/gsheets/scheduleSheet/scheduleSheets/RenderedScheduleSheetTrips';

export default class EveryDayTripScheduleReminder extends ScheduleMessenger {
    tripRenderedScheduleSheet: RenderedScheduleSheetTrips;
    constructor() {
        super();
        this.tripRenderedScheduleSheet = new RenderedScheduleSheetTrips();
    }

    setScheduledMessages() {
        const everyDayFullScheduleReminder: string = this.timeCollection.getScheduleTime('every_day_trip_full_schedule_reminder');
        const timeConfig: { scheduled: boolean, timezone: string } = this.timeCollection.getTimeConfig('kyiv_time');

        cron.schedule(everyDayFullScheduleReminder, this.sendFullNextDayTripSchedule.bind(this), timeConfig);
    }

    private async sendFullNextDayTripSchedule() {
        const isTripAvailable: boolean = await this.tripRenderedScheduleSheet.isTripNextDayAvailable();

        if (!isTripAvailable) return;

        const nextDayFullSchedule: string[][] = await this.tripRenderedScheduleSheet.getTripNextDayFullSchedule();

        let fullScheduleString = renderOneDayScheduleFromSheet(nextDayFullSchedule);

        fullScheduleString = fullScheduleString.replace (/^/,'ВИЇЗД\n');

        try {
            await this.tg.sendMessage(process.env.TELEGRAM_CHANNEL_ID as string, fullScheduleString);
        } catch (err) {
            console.log('Error on sending everyday schedule to channel', err);
        }
    }
}
