import AbstractScheduleSheet from './AbstractScheduleSheet';
import {
    baseInstructorsByLetters,
    fullScheduleByDayLetters
} from '../../../../commandHandlers/private/handlers/scheduleCommand/static/scheduleSheetsConstants';
import DateHelper from '../../../../helpers/DateHelper';
import { type DayNames } from '../../../../types/enums';

export default class RenderedScheduleSheetTrips extends AbstractScheduleSheet {
    constructor() {
        super();
    }

    public async getTripNextDayFullSchedule(): Promise<any[][]> {
        const nextDayScheduleLetter = fullScheduleByDayLetters[DateHelper.nextDayName];
        const range = `${this.sheetCollection.getSheetName('schedule_trip_rendered')}!${nextDayScheduleLetter}3:${nextDayScheduleLetter}100`;

        const nextDaySchedule = await this.getSheetValues({ range });

        return nextDaySchedule;
    }


    public async isTripNextDayAvailable(): Promise<boolean> {
        const nextDayScheduleLetter = fullScheduleByDayLetters[DateHelper.nextDayName];

        const nextDayWorkStatus = await this.getSheetValues({
            range: `${this.sheetCollection.getSheetName('schedule_trip_rendered')}!${nextDayScheduleLetter}2`
        });

        if (nextDayWorkStatus[0][0] === 'FALSE') return false;

        return true;
    }
}
