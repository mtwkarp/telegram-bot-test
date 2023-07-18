import TeachingTrackingDrive from '../googleServices/gdrive/TeachingTrackingDrive';
import RenderedScheduleSheet from "../googleServices/gsheets/scheduleSheet/scheduleSheets/RenderedScheduleSheet";

export default abstract class AbstractTeachingTracker {
    protected readonly name: string;
    protected readonly driveService: TeachingTrackingDrive;
    protected abstract readonly renderedScheduleSheet: RenderedScheduleSheet;

    protected constructor(name: string) {
        this.name = name;
        this.driveService= new TeachingTrackingDrive(this.name);
    }

    async writeInstructorsToAccountingSheet() {
        const instructorNames = await this.sortInstructors()

        await this.driveService.writeTomorrowInstructorsToAccountingSheet(instructorNames)
    }

    protected async sortInstructors(): Promise<string[]> {
        const nextDayFullSchedule = await this.renderedScheduleSheet.getTomorrowInstructorsByBase();
        let instructorsArr: string[]= []

        for (const key in nextDayFullSchedule) {
            const base = nextDayFullSchedule[key]

            for (let i = 0; i < base.length; i++) {
                const {name} = base[i]

                if(!instructorsArr.includes(name)) {
                    instructorsArr.push(name)
                }
            }
        }

        return instructorsArr
    }
}