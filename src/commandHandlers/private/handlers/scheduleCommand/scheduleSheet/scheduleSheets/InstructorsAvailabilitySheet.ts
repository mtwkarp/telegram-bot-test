import AbstractScheduleSheet from "./AbstractScheduleSheet";
import {dayNamesByCellsLettersInSheet, notAvailableInstructor, noResponseInstructorsColumn} from "../../scheduleSheetsConstants";
import {DayNames} from "../../../../../../types/types";
import {UserScheduleObj} from "../../scheduleCmdTypes";
import UsersCollection from "../../../../../../db/firestore/collectionManagers/implementations/UsersCollection";

export default class InstructorsAvailabilitySheet extends AbstractScheduleSheet {
    private readonly usersCollection: UsersCollection
    constructor() {
        super();
        this.usersCollection = UsersCollection.getInstance()
    }

    public async clearAllPreviousScheduleReplies(): Promise<void> {
        const mondayCell: string = dayNamesByCellsLettersInSheet[DayNames.monday];
        const notAvailableCell: string = dayNamesByCellsLettersInSheet[notAvailableInstructor];
        const sheetName: string = this.sheetCollection.getSheetName( 'instructors_availability')
        const getRange: string = `${sheetName}!${mondayCell}2:${notAvailableCell}`
        const data: any[][] = await this.getSheetValues({range: getRange})

        for (let i = 0; i < data.length; i++) {
            const row = data[i]

            for (let j = 0; j < row.length; j++) {
                row[j] = 'FALSE'
            }
        }

        const writeRange: string = `${sheetName}!${mondayCell}2:${notAvailableCell}${data.length + 1}`

        await this.updateSheetValues({range: writeRange, values: data, majorDimension: 'ROWS'})
    }

    public async updateUserSchedule(userId: number, userSchedule: UserScheduleObj) {
        const userFullName: string = this.usersCollection.getUserFullName(userId.toString());
        const userRowIndex = await this.getUserRowIndexInAvailabilitySheet(userFullName);

        if(userRowIndex === null) {
            console.log('No such instructor in availability sheet !')
            return
        }

        await this.clearPreviousSchedule(userRowIndex);
        await this.setScheduleInSpreadsheet(userRowIndex, userSchedule);
    }

    public async getUserRowIndexInAvailabilitySheet(userFullName: string): Promise<number | null> {
        const range = `${this.sheetCollection.getSheetName('instructors_availability')}!A:A`
        const namesList = await this.getSheetValues({range});

        let rowIndex: null | number = null;

        for (let i = 0; i < namesList.length; i++) {
            const name = namesList[i][0];

            if (userFullName === name) {
                rowIndex = i + 1;
                break;
            }
        }

        return rowIndex;
    }

    public async setScheduleInSpreadsheet(rowIndex: number, userSchedule: UserScheduleObj): Promise<void> {
        const mondayCell = dayNamesByCellsLettersInSheet[DayNames.monday] + rowIndex;
        const notAvailableCell = dayNamesByCellsLettersInSheet[notAvailableInstructor] + rowIndex;

        const range = `${this.sheetCollection.getSheetName('instructors_availability')}!${mondayCell}:${notAvailableCell}`;
        const values = [
            userSchedule[DayNames.monday],
            userSchedule[DayNames.tuesday],
            userSchedule[DayNames.wednesday],
            userSchedule[DayNames.thursday],
            userSchedule[DayNames.friday],
            userSchedule[DayNames.saturday],
            userSchedule[DayNames.sunday],
            userSchedule[notAvailableInstructor]
        ].map((el) => [el.toString().toUpperCase()]);

        try {
            await this.updateSheetValues({values, range})
                .then(() => {
                    console.log('Schedule was successfully sent !');
                });
        } catch (err) {
            console.log('Schedule sending is unsuccessfull, abort !');
            throw err;
        }
    }

    public async clearPreviousSchedule(rowIndex: number) {
        const mondayCell: string = dayNamesByCellsLettersInSheet[DayNames.monday] + rowIndex;
        const notAvailableCell: string = dayNamesByCellsLettersInSheet[notAvailableInstructor] + rowIndex;
        const range: string = `${this.sheetCollection.getSheetName('instructors_availability')}!${mondayCell}:${notAvailableCell}`;
        const values: string[][] = [['FALSE'], ['FALSE'], ['FALSE'], ['FALSE'], ['FALSE'], ['FALSE'], ['FALSE'], ['FALSE']];

        try {
            await this.updateSheetValues({range, values});
        } catch (err) {
            console.log('Schedule cleaning is unsuccessfull !');
            throw err;
        }
    }

    public async getInstructorsChatIdsWithNoScheduleResponse(): Promise<{ fullName: string, chatId: number }[] | []> {
        const rowStart = 2;
        const noResponseInstructors: any[][] = await this.getSheetValues({
            range: `${this.sheetCollection.getSheetName('instructors_availability')}!${noResponseInstructorsColumn}${rowStart}:${noResponseInstructorsColumn}1000`
        });

        const noResponseInstructorsNames: any[] = noResponseInstructors.flat();

        const instructorsFullNames = await this.usersCollection.getAllDocumentValues('fullNames') as {[key: string]: string};

        const noResponseInstructorsFinalList = [];

        for (let i = 0; i < noResponseInstructorsNames.length; i++) {
            const noResponseName = noResponseInstructorsNames[i];

            for (const instructorId in instructorsFullNames) {
                const fullName = instructorsFullNames[instructorId]

                    if (fullName === noResponseName) {
                        noResponseInstructorsFinalList.push({
                            fullName: fullName,
                            chatId: Number(instructorId)
                        });
                    }

            }

        }

        return noResponseInstructorsFinalList;
    }
}