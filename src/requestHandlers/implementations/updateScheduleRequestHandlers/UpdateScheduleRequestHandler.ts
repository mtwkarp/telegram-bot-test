import SpreadsheetRequestObserver from '../../../spreadsheetObserver/SpreadsheetRequestObserver';
import {SpreadSheetUpdateObj} from '../../../spreadsheetObserver/types/types';
import ScheduleUpdatesCollection from '../../../db/firestore/collectionManagers/implementations/ScheduleUpdatesCollection';
import RenderedScheduleSheet from '../../../googleServices/gsheets/scheduleSheet/scheduleSheets/RenderedScheduleSheet';


import {Telegram} from 'telegraf';
import {
    renderFullWorkableDaysSchedule,
    renderOneDayScheduleFromSheet
} from '../../../autoMessengers/scheduleMessengers/helpers';
import {DayNames} from '../../../types/enums';
import DateHelper from '../../../helpers/DateHelper';

export default abstract class UpdateScheduleRequestHandler extends SpreadsheetRequestObserver {

    protected readonly scheduleUpdateCollection: ScheduleUpdatesCollection;
    protected renderedScheduleSheet: RenderedScheduleSheet;
    protected readonly tg: Telegram;

    protected header: string;
    protected constructor() {
        super();

        this.scheduleUpdateCollection = ScheduleUpdatesCollection.getInstance();
        this.tg = new Telegram(process.env.TELEGRAM_BOT_TOKEN as string);
        this.header = '';
        this.requestsNames = [];
    }

    onUpdate(update: SpreadSheetUpdateObj): void {
        if(this.scheduleUpdateCollection.isUpdateAvailable === false) return;
        this.updateSchedule();
    }


    protected updateSchedule(): void {
        this.updateFullSchedule();
        this.updateScheduleByDays();
    }

    protected abstract getFullScheduleMsgId(): number

    protected async updateFullSchedule(): Promise<void> {
        const fullScheduleId = this.getFullScheduleMsgId();

        if(fullScheduleId === 0) return;

        const centerWorkDays = await this.renderedScheduleSheet.getNextWeekWorkableDaysSchedule();
        const updatedText = renderFullWorkableDaysSchedule(centerWorkDays, this.header);

        try {
            await this.tg.editMessageText(process.env.TELEGRAM_CHANNEL_ID, fullScheduleId, undefined, updatedText);
        }catch (err) {
            console.log(err);
        }
    }

    protected async updateScheduleByDays(): Promise<void> {
        const dayNames = DateHelper.dayNames;
        const daysToUpdate: {messageId: number, dayName: DayNames}[] = [];

        dayNames.forEach(name => {
            const messageId = this.scheduleUpdateCollection.getTripOneDayScheduleMsgId(name);

            if(messageId !== 0) {
                daysToUpdate.push({
                    messageId,
                    dayName: name
                });
            }
        });

        for (const {messageId, dayName} of daysToUpdate) {
            const workDay = await this.renderedScheduleSheet.getOneDaySchedule(dayName);
            const updatedText = renderOneDayScheduleFromSheet(workDay, this.header);

            try {
                await this.tg.editMessageText(process.env.TELEGRAM_CHANNEL_ID, messageId, undefined, updatedText);
            }catch (err) {
                console.log(err);
            }
        }
    }
}