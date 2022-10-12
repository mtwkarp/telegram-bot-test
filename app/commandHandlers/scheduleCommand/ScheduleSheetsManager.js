const {
    dayNamesByCellsLettersInSheet,
    dayNames,
    notAvailableInstructor,
    SPREADSHEETID
} = require("../../constants/spreadsheetsConstants");

class ScheduleSheetsManager {
    constructor(sheets) {
        this.spreadsheet = sheets.spreadsheet
    }

    async sendConfirmedScheduleToSpreadsheet(ctx, userSchedule) {
        const userId = ctx.update.callback_query.from.id
        const userFullName = await this.getFullNameByTelegramId(userId)
        const userRowIndex = await this.getUserRowIndexInAvailabilitySheet(userFullName)

        await this.clearPreviousSchedule(userRowIndex)
        await this.setScheduleInSpreadsheet(userRowIndex, userSchedule)
    }

    async setScheduleInSpreadsheet(rowIndex, userSchedule) {
        const mondayCell = dayNamesByCellsLettersInSheet[dayNames.monday] + rowIndex
        const notAvailableCell = dayNamesByCellsLettersInSheet[notAvailableInstructor] + rowIndex
        const range = `Доступність інструкторів!${mondayCell}:${notAvailableCell}`

        try {
            await this.spreadsheet.spreadsheets.values.update({
                spreadsheetId: SPREADSHEETID,
                range,
                valueInputOption: 'USER_ENTERED',
                resource: { range, majorDimension: "COLUMNS", values: [
                        [userSchedule[dayNames.monday].toString().toUpperCase()],
                        [userSchedule[dayNames.tuesday].toString().toUpperCase()],
                        [userSchedule[dayNames.wednesday].toString().toUpperCase()],
                        [userSchedule[dayNames.thursday].toString().toUpperCase()],
                        [userSchedule[dayNames.friday].toString().toUpperCase()],
                        [userSchedule[dayNames.saturday].toString().toUpperCase()],
                        [userSchedule[dayNames.sunday].toString().toUpperCase()],
                        [userSchedule[notAvailableInstructor].toString().toUpperCase()]
                    ] },
                // auth
            }).then(() => {
                console.log('Schedule was successfully sent !')
            });
        }catch (err) {
            console.log('Schedule sending is unsuccessfull, abort !')
            throw err;
        }
    }

    async clearPreviousSchedule(rowIndex) {
        const mondayCell = dayNamesByCellsLettersInSheet[dayNames.monday] + rowIndex
        const notAvailableCell = dayNamesByCellsLettersInSheet[notAvailableInstructor] + rowIndex
        const range = `Доступність інструкторів!${mondayCell}:${notAvailableCell}`

        try {
            await this.spreadsheet.spreadsheets.values.update({
                spreadsheetId: SPREADSHEETID,
                range,
                valueInputOption: 'USER_ENTERED',
                resource: { range, majorDimension: "COLUMNS", values: [
                        ['FALSE'],
                        ['FALSE'],
                        ['FALSE'],
                        ['FALSE'],
                        ['FALSE'],
                        ['FALSE'],
                        ['FALSE'],
                        ['FALSE']
                    ] },
            });
        }catch (err) {
            console.log('Schedule cleaning is unsuccessfull')
            throw err;
        }
    }

    async getFullNameByTelegramId (userId) {
        const namesLetter = 'A'

        const namesData = await this.spreadsheet.spreadsheets.values.get({
            spreadsheetId: SPREADSHEETID,
            range: `Список інструкторів!${namesLetter}:${namesLetter}`,
        });

        const instructorsNames = namesData.data.values;

        if (!instructorsNames || instructorsNames.length === 0) {
            console.log('No names data found.');
            return;
        }

        const userIds = await this.getAsmInstructorsIds();

        if (!userIds || userIds.length === 0) {
            console.log('No nicknames data found.');
            return;
        }

        let name = ''

        for (let i = 0; i < userIds.length; i++) {
            const resultId = userIds[i][0]

            if(resultId === undefined) continue

            if(resultId === userId.toString()) {
                name = instructorsNames[i][0]
                break
            }
        }

        if(name === '') console.log('Name not found')

        return name
    }

    async getUserRowIndexInAvailabilitySheet(userFullName) {
        const namesData = await this.spreadsheet.spreadsheets.values.get({
            spreadsheetId: SPREADSHEETID,
            range: `Доступність інструкторів!A:A`,
        });
        const namesList = namesData.data.values

        let rowIndex = null

        for (let i = 0; i < namesList.length; i++) {
            const name = namesList[i][0]

            if(userFullName === name) {
                rowIndex = i + 1
                break
            }
        }

        return rowIndex
    }

    async checkASMInstructorIdExistence(userId) {
        const userIdString = userId.toString()

        const userIds = await this.getAsmInstructorsIds()

        if(userIds === undefined) return false

        for (let i = 0; i < userIds.length; i++) {
            const resultId = userIds[i][0]

            if(resultId === undefined) continue

            if(resultId === userIdString) {
                return true
            }
        }

        return false
    }

    async getAsmInstructorsIds() {
        const userIdLetter = 'C'

        const usersIdData = await this.spreadsheet.spreadsheets.values.get({
            spreadsheetId: SPREADSHEETID,
            range: `Список інструкторів!${userIdLetter}:${userIdLetter}`,
        });

        const userIds = usersIdData.data.values;

        return userIds
    }
}

module.exports = ScheduleSheetsManager