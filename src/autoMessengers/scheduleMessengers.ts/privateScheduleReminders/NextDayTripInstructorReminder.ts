import ScheduleMessenger from '../ScheduleMessenger';
import cron from 'node-cron';
import DateHelper from '../../../helpers/DateHelper';
import ReplyMsgCollection from '../../../db/firestore/collectionManagers/implementations/ReplyMsgCollection';
import {renderNextDayInstructorReminderMessage} from '../helpers';
import RenderedScheduleSheetTrips
    from '../../../googleServices/gsheets/scheduleSheet/scheduleSheets/RenderedScheduleSheetTrips';
export default class NextDayTripInstructorReminder extends ScheduleMessenger {
    private readonly repliesCollection: ReplyMsgCollection;
    private readonly tripRenderedScheduleSheet: RenderedScheduleSheetTrips;
    constructor() {
        super();
        this.repliesCollection = ReplyMsgCollection.getInstance();
        this.tripRenderedScheduleSheet = new RenderedScheduleSheetTrips();
    }

    public setScheduledMessages() {
        const everyDayTeachingReminder = this.timeCollection.getScheduleTime('every_day_instructors_trip_reminder');
        const timeConfig = this.timeCollection.getTimeConfig('kyiv_time');

        cron.schedule(everyDayTeachingReminder, this.sendTomorrowTripInstructorsReminders.bind(this), timeConfig);
    }

    private prepareMessages(messagesArr: {chatId: string, message: string}[]): void {
        messagesArr.forEach(el => {
            el.message = el.message.replace(/^/, '(ВИЇЗД)\n');
        });
    }
    private async sendTomorrowTripInstructorsReminders() {
        const isTripAvailable = await this.tripRenderedScheduleSheet.isNextDayWorkable();

        if (!isTripAvailable) return;

        const tomorrowInstructorsByBase: Record<string, Array<{ name: string, chatId: string }>> = await this.tripRenderedScheduleSheet.getTomorrowInstructorsByBase(DateHelper.nextDayName);

        const messagesArr: {chatId: string, message: string}[] = renderNextDayInstructorReminderMessage(tomorrowInstructorsByBase, this.repliesCollection);

        this.prepareMessages(messagesArr);

        for (let i = 0; i < messagesArr.length; i++) {
            const {chatId, message} = messagesArr[i];

            try {
                await this.tg.sendMessage(chatId, message);
            } catch (err) {
                // console.log(err);
            }
        }
    }
}
