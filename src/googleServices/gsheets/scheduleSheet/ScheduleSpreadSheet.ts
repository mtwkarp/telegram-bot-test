import InstructorsAvailabilitySheet from "./scheduleSheets/InstructorsAvailabilitySheet";
import RenderedScheduleSheet from "./scheduleSheets/RenderedScheduleSheet";

//FACADE pattern
export default class ScheduleSpreadSheet {
    private readonly instructorsAvailabilitySheet: InstructorsAvailabilitySheet
    private readonly renderedScheduleSheet: RenderedScheduleSheet
    constructor() {
        this.instructorsAvailabilitySheet = new InstructorsAvailabilitySheet()
        this.renderedScheduleSheet = new RenderedScheduleSheet()
    }

}
