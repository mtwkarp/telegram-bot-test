import AbstractScheduleSheet from "./AbstractScheduleSheet";

export default class InstructorsAvailabilitySheet extends AbstractScheduleSheet {
    constructor() {
        super();
    }

    public async clearAllPreviousScheduleReplies() {
        // const mondayCell = dayNamesByCellsLettersInSheet[dayNames.monday];
        // const notAvailableCell = dayNamesByCellsLettersInSheet[notAvailableInstructor];
        // const sheetName = FireStoreDB.getSheetsData('schedule_sheets_names', 'instructors_availability')
        // const getRange = `${sheetName}!${mondayCell}2:${notAvailableCell}`
        // const data = await this.spreadsheet.getSheetValues({range: getRange})
        //
        // for (let i = 0; i < data.length; i++) {
        //     const row = data[i]
        //
        //     for (let j = 0; j < row.length; j++) {
        //         row[j] = 'FALSE'
        //     }
        // }
        //
        // const writeRange = `${sheetName}!${mondayCell}2:${notAvailableCell}${data.length + 1}`
        //
        // await this.spreadsheet.updateSheetValues({range: writeRange, values: data, majorDimension: 'ROWS'})
    }

    async sendConfirmedScheduleToSpreadsheet(
        // ctx, userSchedule
    ) {
        // const userId = ctx.update.callback_query.from.id;
        // const userFullName = await this.getFullNameByTelegramId(userId);
        // const userRowIndex = await this.getUserRowIndexInAvailabilitySheet(
        //     userFullName
        // );
        //
        // await this.clearPreviousSchedule(userRowIndex);
        // await this.setScheduleInSpreadsheet(userRowIndex, userSchedule);
    }

    async setScheduleInSpreadsheet(
        // rowIndex, userSchedule
    ) {
        // const mondayCell = dayNamesByCellsLettersInSheet[dayNames.monday] + rowIndex;
        // const notAvailableCell = dayNamesByCellsLettersInSheet[notAvailableInstructor] + rowIndex;
        //
        // const range = `${FireStoreDB.getSheetsData('schedule_sheets_names', 'instructors_availability')}!${mondayCell}:${notAvailableCell}`;
        // const values = [
        //     userSchedule[monday],
        //     userSchedule[tuesday],
        //     userSchedule[wednesday],
        //     userSchedule[thursday],
        //     userSchedule[friday],
        //     userSchedule[saturday],
        //     userSchedule[sunday],
        //     userSchedule[notAvailableInstructor]
        // ].map((el) => [el.toString().toUpperCase()]);
        //
        // try {
        //     await this.spreadsheet.updateSheetValues({
        //         values,
        //         range
        //     }).then(() => {
        //         console.log('Schedule was successfully sent !');
        //     });
        // } catch (err) {
        //     console.log('Schedule sending is unsuccessfull, abort !');
        //     throw err;
        // }
    }

    async clearPreviousSchedule(
        // rowIndex
    ) {
        // const mondayCell = dayNamesByCellsLettersInSheet[dayNames.monday] + rowIndex;
        // const notAvailableCell = dayNamesByCellsLettersInSheet[notAvailableInstructor] + rowIndex;
        // const range = `${FireStoreDB.getSheetsData('schedule_sheets_names', 'instructors_availability')}!${mondayCell}:${notAvailableCell}`;
        // const values = [['FALSE'], ['FALSE'], ['FALSE'], ['FALSE'], ['FALSE'], ['FALSE'], ['FALSE'], ['FALSE']];
        //
        // try {
        //     await this.spreadsheet.updateSheetValues({range, values});
        // } catch (err) {
        //     console.log('Schedule cleaning is unsuccessfull !');
        //     throw err;
        // }
    }

    async getInstructorsChatIdsWithNoScheduleResponse() {
        // const noResponseInstructorsColumn = 'M';
        // const rowStart = 2;
        // const noResponseInstructors = await this.spreadsheet.getSheetValues({
        //     range: `${FireStoreDB.getSheetsData('schedule_sheets_names', 'instructors_availability')}!${noResponseInstructorsColumn}${rowStart}:${noResponseInstructorsColumn}1000`
        // });
        //
        // const noResponseInstructorsNames = noResponseInstructors.flat();
        //
        // const allInstructorsInfo = await this.spreadsheet.getSheetValues(
        //     {
        //         range: `${FireStoreDB.getSheetsData('schedule_sheets_names', 'instructors_list')}!A:D`
        //     });
        //
        // const noResponseInstructorsFinalList = [];
        //
        // for (let i = 0; i < noResponseInstructorsNames.length; i++) {
        //     const noResponseName = noResponseInstructorsNames[i];
        //
        //     for (let j = 0; j < allInstructorsInfo.length; j++) {
        //         const name = allInstructorsInfo[j][0];
        //
        //         if (name === noResponseName) {
        //             const chatId = allInstructorsInfo[j][2];
        //
        //             noResponseInstructorsFinalList.push({
        //                 name,
        //                 chatId
        //             });
        //         }
        //     }
        // }
        //
        // return noResponseInstructorsFinalList;
    }
}