import InstructorsAvailabilitySheet from "./scheduleSheets/InstructorsAvailabilitySheet";
import RenderedScheduleSheet from "./scheduleSheets/RenderedScheduleSheet";
import {UserScheduleObj} from "../../../commandHandlers/private/handlers/scheduleCommand/static/scheduleCmdTypes";

//FACADE pattern
export default class ScheduleSpreadSheet {
    private readonly instructorsAvailabilitySheet: InstructorsAvailabilitySheet
    private readonly renderedScheduleSheet: RenderedScheduleSheet
    constructor() {
        this.instructorsAvailabilitySheet = new InstructorsAvailabilitySheet()
        this.renderedScheduleSheet = new RenderedScheduleSheet()
    }

}
