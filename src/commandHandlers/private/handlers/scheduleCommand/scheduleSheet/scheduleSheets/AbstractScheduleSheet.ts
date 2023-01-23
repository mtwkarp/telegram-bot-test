import SheetsService from "../../../../../../googleServices/services/SheetsService";

export default abstract class AbstractScheduleSheet extends SheetsService {
    protected constructor() {
        super(process.env.SCHEDULE_SPREADSHEET_ID as string);
    }
}