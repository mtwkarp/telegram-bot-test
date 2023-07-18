import AbstractTeachingTracker from "./AbstractTeachingTracker";
import RenderedScheduleSheetCenter
    from "../googleServices/gsheets/scheduleSheet/scheduleSheets/RenderedScheduleSheetCenter";
import RenderedScheduleSheet from "../googleServices/gsheets/scheduleSheet/scheduleSheets/RenderedScheduleSheet";
import RenderedScheduleSheetTrips
    from "../googleServices/gsheets/scheduleSheet/scheduleSheets/RenderedScheduleSheetTrips";


export default class TripsTracker extends AbstractTeachingTracker {

    protected readonly renderedScheduleSheet: RenderedScheduleSheet;

    constructor() {
        super('Виїзд звітність ');

        this.renderedScheduleSheet = new RenderedScheduleSheetTrips();
    }
}