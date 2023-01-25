import AbstractScheduleSheet from "./AbstractScheduleSheet";
import {fullScheduleByDayLetters} from "../../../../commandHandlers/private/handlers/scheduleCommand/static/scheduleSheetsConstants";
import DateHelper from "../../../../helpers/DateHelper";

export default class RenderedScheduleSheet extends AbstractScheduleSheet {
    constructor() {
        super();
    }

    public async getNextDayFullSchedule(): Promise<any[][]> {
        const nextDayScheduleLetter = fullScheduleByDayLetters[DateHelper.nextDayName];
        const range = `${this.sheetCollection.getSheetName('schedule_rendered')}!${nextDayScheduleLetter}3:${nextDayScheduleLetter}100`;

        const nextDaySchedule = await this.getSheetValues({range});

        return nextDaySchedule;
    }

    public async isNextDayWorkable(): Promise<boolean> {
        const nextDayScheduleLetter = fullScheduleByDayLetters[DateHelper.nextDayName];

        const nextDayWorkStatus = await this.getSheetValues({
            range: `${this.sheetCollection.getSheetName('schedule_rendered')}!${nextDayScheduleLetter}2`
        });

        if (nextDayWorkStatus[0][0] === 'FALSE') return false;

        return true;
    }
}