import SpreadsheetRequestObserver from "../../spreadsheetObserver/SpreadsheetRequestObserver";
import {SpreadSheetUpdateObj} from "../../spreadsheetObserver/types/types";
import {SPREADSHEET_REQUESTS} from "../../spreadsheetObserver/types/enums";

export default class UpdateScheduleRequestHandler extends SpreadsheetRequestObserver {
    constructor() {
        super();

        this.requestsNames = [
            SPREADSHEET_REQUESTS.update_center_schedule_in_tg_channel,
            SPREADSHEET_REQUESTS.update_trips_schedule_in_tg_channel
        ]
    }

    onUpdate(update: SpreadSheetUpdateObj) {

    }
}