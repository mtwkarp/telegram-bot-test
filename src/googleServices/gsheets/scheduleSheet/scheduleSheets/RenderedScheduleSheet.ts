import AbstractScheduleSheet from "./AbstractScheduleSheet";
import {
    baseInstructorsByLetters,
    fullScheduleByDayLetters
} from "../../../../commandHandlers/private/handlers/scheduleCommand/static/scheduleSheetsConstants";
import DateHelper from "../../../../helpers/DateHelper";
import {DayNames} from "../../../../types/enums";

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

    async getInstructorsIdsByNames(namesArr: string[] = []): Promise<{name: string, chatId: string}[]> {
        const allInstructorsInfo = await this.getSheetValues({
            range: `${this.sheetCollection.getSheetName('instructors_list')}!$A:D`
        });

        const finalList = [];

        for (let i = 0; i < namesArr.length; i++) {
            const requestedName = namesArr[i];

            for (let j = 0; j < allInstructorsInfo.length; j++) {
                const name = allInstructorsInfo[j][0];

                if (name === requestedName) {
                    const chatId = allInstructorsInfo[j][2];

                    finalList.push({
                        name,
                        chatId
                    });
                }
            }
        }

        return finalList;
    }

    async getTomorrowInstructorsByBase(dayName: DayNames): Promise<{[key: string]: {name: string, chatId: string}[]}> {
        console.log(dayName)
        const sheetLetters = baseInstructorsByLetters[dayName];
        const namesByBase: {[key: string]: string[]} = {['blood']: [], ['lungs']: [], ['heart']: [], ['evacuation']: []};
        const baseNamesByNumbers: {[key: number]: string} = {[0]: 'blood', [1]: 'lungs', [2]: 'heart', [3]: 'evacuation'};

        const instructorsByBase = await this.getSheetValues({
            range: `${this.sheetCollection.getSheetName('instructors_by_bases_schedule')}!${sheetLetters['blood']}3:${sheetLetters['evacuation']}100`
        });

        const allNames: string[] = [];

        for (let i = 0; i < instructorsByBase.length; i++) {
            const row = instructorsByBase[i];
            // [0]-blood [1]-lungs [2]-heart [3]-evacuation
            for (let j = 0; j < row.length; j++) {
                const name: string = row[j];

                if (name === '' || name === '#N/A') continue;

                if(!allNames.includes(name)) allNames.push(name);

                namesByBase[baseNamesByNumbers[j]].push(name);
            }
        }

        const namesWithIds: {name: string, chatId: string}[] = await this.getInstructorsIdsByNames(allNames);

        const finalObj: {[key: string]: {name: string, chatId: string}[]} = {
            ['blood']: [], ['lungs']: [], ['heart']: [], ['evacuation']: []
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