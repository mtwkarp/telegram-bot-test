
import AbstractCollectionManager from "../AbstractCollectionManager";


export default class SheetsCollection extends AbstractCollectionManager {
    protected constructor() {
        super('google_sheets');
    }

    public getSheetName(sheetName: string): string {
        return this.getValueFromDocument('schedule_sheets_names', sheetName)
    }

    public static getInstance(): SheetsCollection {
        if(SheetsCollection.uniqueInstance === null) {
            const newInstance = new SheetsCollection()

            SheetsCollection.uniqueInstance = newInstance

            return newInstance
        }

        return SheetsCollection.uniqueInstance
    }

    private static uniqueInstance: SheetsCollection | null = null
}
