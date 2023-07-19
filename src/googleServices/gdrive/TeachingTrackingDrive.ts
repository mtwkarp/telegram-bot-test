import DriveService from '../services/DriveService';
import {addHours, format} from 'ts-date';
import TeachingTrackingSheet from '../gsheets/teachingTracking/TeachingTrackingSheet';

export default class TeachingTrackingDrive extends DriveService {
    name: string;
    constructor(name: string) {
        super();

        this.name = name;
    }

    get numberOfDaysInCurrentMonth(): number {
        return new Date(new Date().getFullYear(), new Date().getMonth()+1, 0).getDate();
    }

    private async getCurrentMonthSheetId() {
        const query = `mimeType='application/vnd.google-apps.spreadsheet' and '${process.env.ACCOUNTING_DRIVE_FOLDER_ID}' in parents and name='${this.currentMonthSheetName}'`;
        const files = await this.drive.files.list({
            spaces: 'drive',
            q: query
        });


        let id = '';

        if(files.data.files?.length === 1) {
            id = files.data.files[0].id as string;
        }else if(files.data.files?.length === 0) {
            id = await this.createSheetForCurrentMonth();
        }

        return id;
    }
    private get currentMonthSheetName() {
        const nextDayDate = addHours(new Date(), 24)
        return `${this.name}${format(nextDayDate, 'MM.YYYY')}`;
    }
    private async createSheetForCurrentMonth() {
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
            await new TeachingTrackingSheet(file.data.id).fillNewSheetWithDatesAndInstructorNames(this.numberOfDaysInCurrentMonth);

            // @ts-ignore
            return file.data.id;
        } catch (err) {
            console.warn('Can`t create spreadsheet', err);
        }

        return '';
    }

    async writeTomorrowInstructorsToAccountingSheet(instructorNames: string[]) {
        const SpreadSheet = new TeachingTrackingSheet(await this.getCurrentMonthSheetId());

        await SpreadSheet.writeTomorrowInstructorsToSpreadsheet(instructorNames);
    }

}