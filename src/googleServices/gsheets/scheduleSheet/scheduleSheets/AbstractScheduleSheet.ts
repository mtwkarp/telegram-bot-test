import SheetsService from '../../../services/SheetsService';
import SheetsCollection from '../../../../db/firestore/collectionManagers/implementations/SheetsCollection';
import UsersCollection from '../../../../db/firestore/collectionManagers/implementations/UsersCollection';

export default abstract class AbstractScheduleSheet extends SheetsService {
  protected readonly sheetCollection: SheetsCollection;

  protected constructor() {
    super(process.env.SCHEDULE_SPREADSHEET_ID as string);

    this.sheetCollection = SheetsCollection.getInstance();
  }

  getInstructorsIdsByNames(namesArr: string[] = []): Array<{ name: string, chatId: string }> {
    const allInstructorsInfo = UsersCollection.getInstance().getAllDocumentValues('ids') as Record<string, string>;
    const finalList = [];

    for (let i = 0; i < namesArr.length; i++) {
      const name = namesArr[i];
      const chatId = allInstructorsInfo[name];

      finalList.push({
        name,
        chatId
      });
    }

    return finalList;
  }
}
