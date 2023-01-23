import SheetsService from "../../../../../../googleServices/services/SheetsService";
import SheetsCollection from "../../../../../../db/firestore/collectionManagers/implementations/SheetsCollection";

export default abstract class AbstractScheduleSheet extends SheetsService {
    protected readonly sheetCollection: SheetsCollection

    protected constructor() {
        super(process.env.SCHEDULE_SPREADSHEET_ID as string);

        this.sheetCollection = SheetsCollection.getInstance()

    }
}