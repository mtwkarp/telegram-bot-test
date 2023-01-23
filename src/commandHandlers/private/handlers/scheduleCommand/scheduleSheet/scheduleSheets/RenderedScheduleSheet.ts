import AbstractScheduleSheet from "./AbstractScheduleSheet";

export default class RenderedScheduleSheet extends AbstractScheduleSheet {
    constructor() {
        super();
    }

    async getNextDayFullSchedule() {
        // const nextDayScheduleLetter = fullScheduleByDayLetters[DateHelper.nextDayName];
        // const range = `${FireStoreDB.getSheetsData('schedule_sheets_names', 'schedule_rendered')}!${nextDayScheduleLetter}3:${nextDayScheduleLetter}100`;
        //
        // const nextDaySchedule = await this.spreadsheet.getSheetValues({range});
        //
        // return nextDaySchedule;
    }

    async isNextDayWorkable() {
        // const nextDayScheduleLetter = fullScheduleByDayLetters[DateHelper.nextDayName];
        //
        // const nextDayWorkStatus = await this.spreadsheet.getSheetValues({
        //     range: `${FireStoreDB.getSheetsData('schedule_sheets_names', 'schedule_rendered')}!${nextDayScheduleLetter}2`
        // });
        //
        // if (nextDayWorkStatus[0][0] === 'FALSE') return false;
        //
        // return true;
    }
}