import SheetsService from '../../../services/SheetsService';
import SheetsCollection from '../../../../db/firestore/collectionManagers/implementations/SheetsCollection';

export default abstract class AbstractScheduleSheet extends SheetsService {
  protected readonly sheetCollection: SheetsCollection;

  protected constructor() {
    super(process.env.SCHEDULE_SPREADSHEET_ID as string);

    this.sheetCollection = SheetsCollection.getInstance();
  }

  async getInstructorsIdsByNames(namesArr: string[] = []): Promise<Array<{ name: string, chatId: string }>> {
    const allInstructorsInfo = await this.getSheetValues({
      range: `${this.sheetCollection.getSheetName('instructors_list')}!$A:D`
    });

    const finalList = [];

    for (let i = 0; i < namesArr.length; i++) {
      const requestedName = namesArr[i];

      for (let j = 0; j < allInstructorsInfo.length; j++) {
        const name = allInstructorsInfo[j][0];

        if (name === requestedName) {
          const chatId = allInstructorsInfo[j][2];

          finalList.push({
            name,
            chatId
          });
        }
      }
    }

    return finalList;
  }
}
