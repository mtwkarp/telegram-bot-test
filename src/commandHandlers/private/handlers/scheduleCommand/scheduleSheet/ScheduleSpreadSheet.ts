import InstructorsAvailabilitySheet from "./scheduleSheets/InstructorsAvailabilitySheet";
import RenderedScheduleSheet from "./scheduleSheets/RenderedScheduleSheet";
import {UserScheduleObj} from "../scheduleCmdTypes";

//FACADE pattern
export default class ScheduleSpreadSheet {
    private readonly instructorsAvailabilitySheet: InstructorsAvailabilitySheet
    private readonly renderedScheduleSheet: RenderedScheduleSheet
    constructor() {
        this.instructorsAvailabilitySheet = new InstructorsAvailabilitySheet()
        this.renderedScheduleSheet = new RenderedScheduleSheet()
    }
    public sendConfirmedScheduleToSpreadsheet(userId: number, userScheduleObj: UserScheduleObj): void {
        this.instructorsAvailabilitySheet.updateUserSchedule(userId, userScheduleObj)
    }
}
