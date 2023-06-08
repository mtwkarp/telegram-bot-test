import ScheduleMessenger from './ScheduleMessenger';
import cron from 'node-cron';
import InstructorsAvailabilitySheet
    from '../../googleServices/gsheets/scheduleSheet/scheduleSheets/InstructorsAvailabilitySheet';
import RenderedScheduleSheetCenter
    from '../../googleServices/gsheets/scheduleSheet/scheduleSheets/RenderedScheduleSheetCenter';
import RenderedScheduleSheetTrips
    from '../../googleServices/gsheets/scheduleSheet/scheduleSheets/RenderedScheduleSheetTrips';

export default class ScheduleCleaner extends ScheduleMessenger {
    protected readonly instructorsAvailabilitySheet: InstructorsAvailabilitySheet;
    constructor() {
        super();
        this.instructorsAvailabilitySheet = new InstructorsAvailabilitySheet();
    }

    setScheduledMessages() {
        const channelScheduleReminder1 = this.timeCollection.getScheduleTime('channel_schedule_reminder_1');
        const clearRenderedScheduleSheetsTime = this.timeCollection.getScheduleTime('clear_rendered_schedule_sheets_time');
        const timeConfig = this.timeCollection.getTimeConfig('kyiv_time');

        cron.schedule(channelScheduleReminder1, this.clearAllPreviousScheduleReplies.bind(this), timeConfig);
        cron.schedule(clearRenderedScheduleSheetsTime, this.clearRenderedScheduleSheetTrips.bind(this), timeConfig);
    }

    async clearRenderedScheduleSheetTrips() {
        const renderedScheduleSheetTrips = new RenderedScheduleSheetTrips();
        const renderedScheduleSheetCenter = new RenderedScheduleSheetCenter();

        await renderedScheduleSheetCenter.setAllDaysUnworkable();
        await renderedScheduleSheetTrips.setAllDaysUnworkable();
    }

    async clearAllPreviousScheduleReplies() {
        await this.instructorsAvailabilitySheet.clearAllPreviousScheduleReplies();
    }
}

module.exports = ScheduleCleaner;
