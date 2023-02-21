import UpdateScheduleRequestHandler from './UpdateScheduleRequestHandler';
import {SPREADSHEET_REQUESTS} from '../../../spreadsheetObserver/types/enums';
import RenderedScheduleSheetTrips
    from '../../../googleServices/gsheets/scheduleSheet/scheduleSheets/RenderedScheduleSheetTrips';


export default class TripsScheduleUpdateHandler extends UpdateScheduleRequestHandler {
    constructor() {
        super();
        this.header = 'ВИЇЗД';
        this.requestsNames = [SPREADSHEET_REQUESTS.update_trips_schedule_in_tg_channel];
        this.renderedScheduleSheet = new RenderedScheduleSheetTrips();
    }
}