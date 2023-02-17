import {SPREADSHEET_REQUESTS} from "./enums";

export type SpreadSheetUpdateObj = {
    requestName: SPREADSHEET_REQUESTS,
    update: object
}