import AbstractScheduleSheet from './AbstractScheduleSheet';
import {
    baseInstructorsByLetters,
    fullScheduleByDayLetters
} from '../../../../commandHandlers/private/handlers/scheduleCommand/static/scheduleSheetsConstants';
import DateHelper from '../../../../helpers/DateHelper';
import {DayNames} from '../../../../types/enums';

export default class RenderedScheduleSheet extends AbstractScheduleSheet {

    protected renderedSheetName: string;
    protected instructorsByBaseSheetName: string;
    constructor() {
        super();
    }

    public async getOneDaySchedule(dayName: DayNames): Promise<any[][]> {
        const nextDayScheduleLetter = fullScheduleByDayLetters[dayName];
        const range = `${this.sheetCollection.getSheetName(this.renderedSheetName)}!${nextDayScheduleLetter}3:${nextDayScheduleLetter}100`;

        return await this.getSheetValues({ range });
    }

    public async getNextDayFullSchedule(): Promise<any[][]> {
        return this.getOneDaySchedule(DateHelper.nextDayName)
    }

    public async getNextWeekWorkableDaysSchedule(): Promise<any[][]> {
        const workableDays = await this.getWorkableDaysNumbers();
        const mondayLetter = fullScheduleByDayLetters[DayNames.monday];
        const sundayLetter = fullScheduleByDayLetters[DayNames.sunday];

        const fullSchedule = await this.getSheetValues({
            range: `${this.sheetCollection.getSheetName(this.renderedSheetName)}!${mondayLetter}3:${sundayLetter}20`
        });

        const rawWorkableSchedule: any[][] = [];

        for (let i = 0; i < workableDays.length; i++) {
            const dayIndex = workableDays[i];
            rawWorkableSchedule.push([]);
            for (let j = 0; j < fullSchedule.length; j++) {
                const row = fullSchedule[j];
                const arr = [];

                if(row[dayIndex] !== undefined) arr.push(row[dayIndex]);

                rawWorkableSchedule[i].push(arr);
            }
        }

        return rawWorkableSchedule;
    }

    public async getWorkableDaysNumbers(): Promise<number[] | []> {
        const mondayLetter = fullScheduleByDayLetters[DayNames.monday];
        const sundayLetter = fullScheduleByDayLetters[DayNames.sunday];

        const nextDayWorkStatus = await this.getSheetValues({
            range: `${this.sheetCollection.getSheetName(this.renderedSheetName)}!${mondayLetter}2:${sundayLetter}2`
        });

        const workableDays: number[] = [];

        nextDayWorkStatus[0].forEach((el, i) => {
            if(el === 'TRUE') workableDays.push(i);
        });

        return workableDays;
    }

    public async isDayWorkable(dayName: DayNames) {
        const dayLetter = fullScheduleByDayLetters[dayName];

        const nextDayWorkStatus = await this.getSheetValues({
            range: `${this.sheetCollection.getSheetName(this.renderedSheetName)}!${dayLetter}2`
        });

        return nextDayWorkStatus[0][0] !== 'FALSE';
    }

    public async isNextDayWorkable(): Promise<boolean> {
        return await this.isDayWorkable(DateHelper.nextDayName);
    }


    public async getInstructorsByBase(dayName: DayNames): Promise<any[][]> {
        const sheetLetters = baseInstructorsByLetters[dayName];

        return  await this.getSheetValues({
            range: `${this.sheetCollection.getSheetName(this.instructorsByBaseSheetName)}!${sheetLetters.blood}3:${sheetLetters.evacuation}100`
        });
    }
    async getTomorrowInstructorsByBase(): Promise<Record<string, Array<{ name: string, chatId: string }>>> {
        const instructorsByBase = await this.getInstructorsByBase(DateHelper.nextDayName);

        return this.prepareInstructorsByBase(instructorsByBase);
    }
//refactor

    public prepareInstructorsByBase(instructorsByBase: any[][]): Record<string, Array<{ name: string, chatId: string }>> {
        const namesByBase: Record<string, string[]> = { blood: [], lungs: [], heart: [], evacuation: [] };
        const baseNamesByNumbers: Record<number, string> = { 0: 'blood', 1: 'lungs', 2: 'heart', 3: 'evacuation' };

        const allNames: string[] = [];

        for (let i = 0; i < instructorsByBase.length; i++) {
            const row = instructorsByBase[i];
            // [0]-blood [1]-lungs [2]-heart [3]-evacuation
            for (let j = 0; j < row.length; j++) {
                const name: string = row[j];

                if (name === '' || name === '#N/A') continue;

                if (!allNames.includes(name)) allNames.push(name);

                namesByBase[baseNamesByNumbers[j]].push(name);
            }
        }

        const namesWithIds: Array<{ name: string, chatId: string }> = this.getInstructorsIdsByNames(allNames);

        const finalObj: Record<string, Array<{ name: string, chatId: string }>> = {
            blood: [], lungs: [], heart: [], evacuation: []
        };

        for (const baseName in namesByBase) {
            for (let i = 0; i < namesByBase[baseName].length; i++) {
                const instructorName: string = namesByBase[baseName][i];

                for (let j = 0; j < namesWithIds.length; j++) {
                    const nameWithId = namesWithIds[j];

                    if (instructorName === nameWithId.name) finalObj[baseName].push(nameWithId);
                }
            }
        }

        return finalObj;
    }
}
