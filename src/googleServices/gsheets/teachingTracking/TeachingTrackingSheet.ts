import SheetsService from '../../services/SheetsService';
import {format} from 'ts-date';
import UsersCollection from '../../../db/firestore/collectionManagers/implementations/UsersCollection';

export default class TeachingTrackingSheet extends SheetsService {
    constructor(sheetId: string) {
        super(sheetId);
    }

    async fillNewSheetWithDatesAndInstructorNames(numberOfDaysInCurrentMonth: number) {
        const range = 'B1';
        const values = [];

        for (let i = 1; i < numberOfDaysInCurrentMonth; i++) {
            values.push([`${i}/${format(new Date(), 'MM')}`]);
        }

        const allInstructorsNames = Object.values(
            UsersCollection.getInstance()
                .getAllDocumentValues('fullNames')) as string[];

        const instructorNamesSheetValues = allInstructorsNames.map(el => [el]);

        try {
            await this.updateSheetValues({ values: instructorNamesSheetValues, range: 'A2', majorDimension: 'ROWS' })
                .then(() => {
                    console.log('Accounting spreadsheet filled with raw data');
                });
            await this.updateSheetValues({ values, range })
                .then(() => {
                    console.log('Accounting spreadsheet filled with raw data');
                });
        } catch (err) {
            console.log('Accounting spreadsheet fill unsuccessful, abort !');
            throw err;
        }
    }

    async writeTomorrowInstructorsToSpreadsheet(instructorNames: string[]) {
        const day = Number(format(new Date(), 'D')) + 2;
        const instructorIndexes = [];
        const columnLetter = this.getColumnLetter(day);

        for (let i = 0; i < instructorNames.length; i++) {
            const rowIndex = await this.getUserRowIndexInSheet(instructorNames[i]);

            if(rowIndex === null) continue;

            instructorIndexes.push(rowIndex);
        }

        const biggestIndex = Math.max(...instructorIndexes);

        const values: number[][] = Array.from({length: biggestIndex}, () => []);

        instructorIndexes.forEach(index => values[index - 1].push(1));

        await this.updateSheetValues({range: `${columnLetter}:${columnLetter}`, values, majorDimension: 'ROWS'})
            .then(() => console.log('Accounting info was sent.'));
    }

    private async getUserRowIndexInSheet(userFullName: string): Promise<number | null> {
        const range = '!A:A';
        const namesList = await this.getSheetValues({ range });

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

    private getColumnLetter(columnNumber: number) {
        let columnLetter = '';

        while (columnNumber > 0) {
            const remainder = (columnNumber - 1) % 26;
            columnLetter = String.fromCharCode(65 + remainder) + columnLetter;
            columnNumber = Math.floor((columnNumber - 1) / 26);
        }
        return columnLetter;
    }
}