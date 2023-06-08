import cron from 'node-cron';
import ScheduleMessenger from '../ScheduleMessenger';
import {renderOneDayScheduleFromSheet} from '../helpers';
import RenderedScheduleSheetTrips
    from '../../../googleServices/gsheets/scheduleSheet/scheduleSheets/RenderedScheduleSheetTrips';
import ScheduleUpdatesCollection
    from '../../../db/firestore/collectionManagers/implementations/ScheduleUpdatesCollection';
import DateHelper from '../../../helpers/DateHelper';

export default class EveryDayTripScheduleReminder extends ScheduleMessenger {
    private readonly tripRenderedScheduleSheet: RenderedScheduleSheetTrips;
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
        const isTripAvailable: boolean = await this.tripRenderedScheduleSheet.isNextDayWorkable();

        if (!isTripAvailable) return;

        const nextDayFullSchedule: string[][] = await this.tripRenderedScheduleSheet.getNextDayFullSchedule();

        let fullScheduleString = renderOneDayScheduleFromSheet(nextDayFullSchedule);

        fullScheduleString = fullScheduleString.replace (/^/,'ВИЇЗД\n');

        try {
            const message = await this.tg.sendMessage(process.env.TELEGRAM_CHANNEL_ID as string, fullScheduleString);
            ScheduleUpdatesCollection.getInstance().setTripOneDayScheduleMessageId(DateHelper.nextDayName, message.message_id);
        } catch (err) {
            console.log('Error on sending everyday schedule to channel', err);
        }
    }
}
