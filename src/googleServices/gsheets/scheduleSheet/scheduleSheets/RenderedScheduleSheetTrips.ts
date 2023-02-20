import RenderedScheduleSheet from "./RenderedScheduleSheet";

export default class RenderedScheduleSheetTrips extends RenderedScheduleSheet {
    constructor() {
        super();

        this.instructorsByBaseSheetName = 'intstructors_by_bases_trip_schedule'
        this.renderedSheetName = 'schedule_trip_rendered'
    }
}
