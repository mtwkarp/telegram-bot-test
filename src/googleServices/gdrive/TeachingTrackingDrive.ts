import DriveService from "../services/DriveService";
import {format, parse} from "ts-date";
import SheetsService from "../services/SheetsService";
import {DayNames} from "../../types/enums";
import {
    notAvailableInstructor
} from "../../commandHandlers/private/handlers/scheduleCommand/static/scheduleSheetsConstants";
import UsersCollection from "../../db/firestore/collectionManagers/implementations/UsersCollection";

export default class TeachingTrackingDrive extends DriveService {
    name: string
    constructor(name: string) {
        super();

        this.name = name
    }

    get numberOfDaysInCurrentMonth(): number {
        return new Date(new Date().getFullYear(), new Date().getMonth()+1, 0).getDate()
    }

    async getCurrentMonthSheetId() {
        const query = `mimeType='application/vnd.google-apps.spreadsheet' and '${process.env.ACCOUNTING_DRIVE_FOLDER_ID}' in parents and name='${this.currentMonthSheetName}'`;
        const files = await this.drive.files.list({
            spaces: 'drive',
            q: query
        });


        let id = '';

        if(files.data.files?.length === 1) {
            id = files.data.files[0].id as string;
            this.fillNewSheetWithDatesAndInstructorNames(id)
        }else if(files.data.files?.length === 0) {
            id = await this.createSheetForCurrentMonth();
        }

        return id;
    }
    get currentMonthSheetName() {
        return `${this.name}${format(new Date(), 'MM.YYYY')}`
    }
    async createSheetForCurrentMonth() {
        const fileMetadata = {
            name: this.currentMonthSheetName,
            mimeType: 'application/vnd.google-apps.spreadsheet',
            parents: [process.env.ACCOUNTING_DRIVE_FOLDER_ID as string]
        };

        try {
            const file = await this.drive.files.create({
                // @ts-ignore
                resource: fileMetadata,
                fields: 'id',
            });

            // @ts-ignore
            await this.fillNewSheetWithDatesAndInstructorNames(file.data.id)

            // @ts-ignore
            return file.data.id;
        } catch (err) {
            console.warn('Can`t create spreadsheet', err);
        }

        return '';
    }

    async fillNewSheetWithDatesAndInstructorNames(sheetId: string) {
        const SpreadSheet = new SheetsService(sheetId)

        const range = `B1`;
        const values = [];

        for (let i = 1; i < this.numberOfDaysInCurrentMonth; i++) {
            values.push([`${i}/${format(new Date(), 'MM')}`])
        }

        const allInstructorsNames = Object.values(
            UsersCollection.getInstance()
            .getAllDocumentValues('fullNames')) as string[];

        const instructorNamesSheetValues = allInstructorsNames.map(el => [el])

        try {
            await SpreadSheet.updateSheetValues({ values: instructorNamesSheetValues, range: 'A2', majorDimension: 'ROWS' })
                .then(() => {
                    console.log('Accounting spreadsheet filled with raw data');
                });
            await SpreadSheet.updateSheetValues({ values, range })
                .then(() => {
                    console.log('Accounting spreadsheet filled with raw data');
                });
        } catch (err) {
            console.log('Accounting spreadsheet fill unsuccessful, abort !');
            throw err;
        }
    }
}