const {
  dayNamesByCellsLettersInSheet,
  dayNames,
  notAvailableInstructor,
  baseInstructorsByLetters,
  fullScheduleByDayLetters
} = require('../../constants/spreadsheetsConstants');
const {monday, tuesday, wednesday, thursday, friday, saturday, sunday} = dayNames;
const DateHelper = require('../../helpers/DateHelper.js');
const GoogleServicesManager = require('../../google/GoogleServicesManager.js');
const {sheets_service_name} = require('../../constants/googleServicesNames');
const FireStoreDB = require('../../google/FireStoreDB.js')

class ScheduleSheetsManager {
  constructor() {
    this.spreadsheet = GoogleServicesManager.getGoogleServiceByName(sheets_service_name);
    this.spreadsheet.setSpreadSheetId(process.env.SCHEDULE_SPREADSHEET_ID);
  }

  async sendConfirmedScheduleToSpreadsheet(ctx, userSchedule) {
    const userId = ctx.update.callback_query.from.id;
    const userFullName = await this.getFullNameByTelegramId(userId);
    const userRowIndex = await this.getUserRowIndexInAvailabilitySheet(
        userFullName
    );

    await this.clearPreviousSchedule(userRowIndex);
    await this.setScheduleInSpreadsheet(userRowIndex, userSchedule);
  }

  async setScheduleInSpreadsheet(rowIndex, userSchedule) {
    const mondayCell = dayNamesByCellsLettersInSheet[dayNames.monday] + rowIndex;
    const notAvailableCell = dayNamesByCellsLettersInSheet[notAvailableInstructor] + rowIndex;

    const range = `${FireStoreDB.getSheetsData('schedule_sheets_names', 'instructors_availability')}!${mondayCell}:${notAvailableCell}`;
    const values = [
      userSchedule[monday],
      userSchedule[tuesday],
      userSchedule[wednesday],
      userSchedule[thursday],
      userSchedule[friday],
      userSchedule[saturday],
      userSchedule[sunday],
      userSchedule[notAvailableInstructor]
    ].map((el) => [el.toString().toUpperCase()]);

    try {
      await this.spreadsheet.updateSheetValues({
        values,
        range
      }).then(() => {
        console.log('Schedule was successfully sent !');
      });
    } catch (err) {
      console.log('Schedule sending is unsuccessfull, abort !');
      throw err;
    }
  }

  async clearPreviousSchedule(rowIndex) {
    const mondayCell = dayNamesByCellsLettersInSheet[dayNames.monday] + rowIndex;
    const notAvailableCell = dayNamesByCellsLettersInSheet[notAvailableInstructor] + rowIndex;
    const range = `${FireStoreDB.getSheetsData('schedule_sheets_names', 'instructors_availability')}!${mondayCell}:${notAvailableCell}`;
    const values = [['FALSE'], ['FALSE'], ['FALSE'], ['FALSE'], ['FALSE'], ['FALSE'], ['FALSE'], ['FALSE']];

    try {
      await this.spreadsheet.updateSheetValues({range, values});
    } catch (err) {
      console.log('Schedule cleaning is unsuccessfull !');
      throw err;
    }
  }

  async getFullNameByTelegramId(userId) {
    const namesLetter = 'A';
    const instructorsNames = await this.spreadsheet.getSheetValues({
      range: `${FireStoreDB.getSheetsData('schedule_sheets_names', 'instructors_list')}!${namesLetter}:${namesLetter}`
    });

    if (!instructorsNames || instructorsNames.length === 0) {
      console.log('No names data found.');
      return;
    }

    const userIds = await this.getAsmInstructorsIds();

    if (!userIds || userIds.length === 0) {
      console.log('No nicknames data found.');
      return;
    }

    let name = '';

    for (let i = 0; i < userIds.length; i++) {
      const resultId = userIds[i][0];

      if (resultId === undefined) continue;

      if (resultId === userId.toString()) {
        name = instructorsNames[i][0];
        break;
      }
    }

    if (name === '') console.log('Name not found');

    return name;
  }

  async getUserRowIndexInAvailabilitySheet(userFullName) {
    const namesList = await this.spreadsheet.getSheetValues(
        {
          range: `${FireStoreDB.getSheetsData('schedule_sheets_names', 'instructors_availability')}!A:A`
        });

    let rowIndex = null;

    for (let i = 0; i < namesList.length; i++) {
      const name = namesList[i][0];

      if (userFullName === name) {
        rowIndex = i + 1;
        break;
      }
    }

    return rowIndex;
  }

  async checkASMInstructorIdExistence(userId) {
    const userIdString = userId.toString();

    const userIds = await this.getAsmInstructorsIds();

    if (userIds === undefined) return false;

    for (let i = 0; i < userIds.length; i++) {
      const resultId = userIds[i][0];

      if (resultId === undefined) continue;

      if (resultId === userIdString) {
        return true;
      }
    }

    return false;
  }

  async getAsmInstructorsIds() {
    const userIdLetter = 'C';

    const userIds = await this.spreadsheet.getSheetValues(
        {
          range: `${FireStoreDB.getSheetsData('schedule_sheets_names', 'instructors_list')}!${userIdLetter}:${userIdLetter}`
        });

    return userIds;
  }

  async getInstructorsChatIdsWithNoScheduleResponse() {
    const noResponseInstructorsColumn = 'M';
    const rowStart = 2;
    const noResponseInstructors = await this.spreadsheet.getSheetValues({
      range: `${FireStoreDB.getSheetsData('schedule_sheets_names', 'instructors_availability')}!${noResponseInstructorsColumn}${rowStart}:${noResponseInstructorsColumn}1000`
    });

    const noResponseInstructorsNames = noResponseInstructors.flat();

    const allInstructorsInfo = await this.spreadsheet.getSheetValues(
        {
          range: `${FireStoreDB.getSheetsData('schedule_sheets_names', 'instructors_list')}!A:D`
        });

    const noResponseInstructorsFinalList = [];

    for (let i = 0; i < noResponseInstructorsNames.length; i++) {
      const noResponseName = noResponseInstructorsNames[i];

      for (let j = 0; j < allInstructorsInfo.length; j++) {
        const name = allInstructorsInfo[j][0];

        if (name === noResponseName) {
          const chatId = allInstructorsInfo[j][2];

          noResponseInstructorsFinalList.push({
            name,
            chatId
          });
        }
      }
    }

    return noResponseInstructorsFinalList;
  }

  async getInstructorsIdsByNames(namesArr=[]) {
    const allInstructorsInfo = await this.spreadsheet.getSheetValues({
      range: `${FireStoreDB.getSheetsData('schedule_sheets_names', 'instructors_list')}!$A:D`
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

  // move bases names to constants
  // refactor !
  async getTomorrowInstructorsByBase(dayName) {
    const sheetLetters = baseInstructorsByLetters[dayName];
    const namesByBase = {['blood']: [], ['lungs']: [], ['heart']: [], ['evacuation']: []};
    const baseNamesByNumbers = {[0]: 'blood', [1]: 'lungs', [2]: 'heart', [3]: 'evacuation'};

    const instructorsByBase = await this.spreadsheet.getSheetValues({
      range: `${FireStoreDB.getSheetsData('schedule_sheets_names', 'instructors_by_bases_schedule')}!${sheetLetters['blood']}3:${sheetLetters['evacuation']}100`
    });

    const allNames = [];

    for (let i = 0; i < instructorsByBase.length; i++) {
      const row = instructorsByBase[i];
      // [0]-blood [1]-lungs [2]-heart [3]-evacuation
      for (let j = 0; j < row.length; j++) {
        const name = row[j];

        if (name === '' || name === '#N/A') continue;
        allNames.push(name);
        namesByBase[baseNamesByNumbers[j]].push(name);
      }
    }
    const namesWithIds = await this.getInstructorsIdsByNames(allNames);

    const finalObj = {
      ['blood']: [], ['lungs']: [], ['heart']: [], ['evacuation']: []
    };

    for (const baseName in namesByBase) {
      for (let i = 0; i < namesByBase[baseName].length; i++) {
        const instructorName = namesByBase[baseName][i];
        for (let j = 0; j < namesWithIds.length; j++) {
          const nameWithId = namesWithIds[j];

          if (instructorName === nameWithId.name) finalObj[baseName].push(nameWithId);
        }
      }
    }

    return finalObj;
  }

  async getNextDayFullSchedule() {
    const nextDayScheduleLetter = fullScheduleByDayLetters[DateHelper.nextDayName];
    const range = `${FireStoreDB.getSheetsData('schedule_sheets_names', 'schedule_rendered')}!${nextDayScheduleLetter}3:${nextDayScheduleLetter}100`;

    const nextDaySchedule = await this.spreadsheet.getSheetValues({range});

    return nextDaySchedule;
  }

  async isNextDayWorkable() {
    const nextDayScheduleLetter = fullScheduleByDayLetters[DateHelper.nextDayName];

    const nextDayWorkStatus = await this.spreadsheet.getSheetValues({
      range: `${FireStoreDB.getSheetsData('schedule_sheets_names', 'schedule_rendered')}!${nextDayScheduleLetter}2`
    });

    if (nextDayWorkStatus[0][0] === 'FALSE') return false;

    return true;
  }
}

module.exports = ScheduleSheetsManager;
