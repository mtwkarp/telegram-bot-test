import SpreadsheetRequestObserver from "../SpreadsheetRequestObserver";
import {SpreadSheetUpdateObj} from "../types/types";
import {SPREADSHEET_REQUESTS} from "../types/enums";

export default class SendFullScheduleRequestHandler extends SpreadsheetRequestObserver {

    constructor() {
        super();

        this.requestsNames = [SPREADSHEET_REQUESTS.send_full_schedule_to_tg_channel]
    }
    onUpdate(update: SpreadSheetUpdateObj): void {
        console.log(update.requestName)
    }
}