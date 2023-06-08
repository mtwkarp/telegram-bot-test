import UpdateScheduleRequestHandler from './UpdateScheduleRequestHandler';
import {SPREADSHEET_REQUESTS} from '../../../spreadsheetObserver/types/enums';
import RenderedScheduleSheetCenter
    from '../../../googleServices/gsheets/scheduleSheet/scheduleSheets/RenderedScheduleSheetCenter';


export default class CenterScheduleUpdateHandler extends UpdateScheduleRequestHandler {
    constructor() {
        super();
        this.header = 'ЦЕНТР';
        this.requestsNames = [SPREADSHEET_REQUESTS.update_center_schedule_in_tg_channel];
        this.renderedScheduleSheet = new RenderedScheduleSheetCenter();
    }

    protected override getFullScheduleMsgId(): number {
        return this.scheduleUpdateCollection.getCenterFullScheduleMsgId();
    }
}