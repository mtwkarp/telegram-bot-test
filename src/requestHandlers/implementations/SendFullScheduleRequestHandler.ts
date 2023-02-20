import SpreadsheetRequestObserver from '../../spreadsheetObserver/SpreadsheetRequestObserver';
import {SpreadSheetUpdateObj} from '../../spreadsheetObserver/types/types';
import {SPREADSHEET_REQUESTS} from '../../spreadsheetObserver/types/enums';

export default class SendFullScheduleRequestHandler extends SpreadsheetRequestObserver {

    constructor() {
        super();

        this.requestsNames = [SPREADSHEET_REQUESTS.send_full_schedule_to_tg_channel];


    }
    onUpdate(update: SpreadSheetUpdateObj): void {
        this.sendFullScheduleToTgChannel();
    }

    private sendFullScheduleToTgChannel(): void {
        this.sendCenterScheduleToChannel();
        this.sendTripsScheduleToChannel();
    }

    private sendCenterScheduleToChannel() {

    }

    private sendTripsScheduleToChannel() {

    }
}