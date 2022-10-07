const {google} = require("googleapis");
const {SPREADSHEETID} = require('../constants/spreadsheetsConstants')
const {dayNames, dayNamesByCellsLettersInSheet, notAvailableInstructor} = require('../constants/spreadsheetsConstants')



async function getUserNameByNickname (sheet, nickname) {
    const namesLetter = 'A'
    const nicknameLetter = 'B'
    // const sheet = google.sheets({version: 'v4', auth});
    const namesData = await sheet.spreadsheets.values.get({
        spreadsheetId: SPREADSHEETID,
        range: `Список інструкторів!${namesLetter}:${namesLetter}`,
    });

    const instructorsNames = namesData.data.values;

    if (!instructorsNames || instructorsNames.length === 0) {
        console.log('No names data found.');
        return;
    }

    const nicknamesData = await sheet.spreadsheets.values.get({
        spreadsheetId: SPREADSHEETID,
        range: `Список інструкторів!${nicknameLetter}:${nicknameLetter}`,
    });

    const instructorsNicks = nicknamesData.data.values;

    if (!instructorsNicks || instructorsNicks.length === 0) {
        console.log('No nicknames data found.');
        return;
    }
    let name = ''

    for (let i = 0; i < instructorsNicks.length; i++) {
        const resultNickname = instructorsNicks[i][0]

        if(resultNickname === undefined) continue

        if(resultNickname === nickname) {
            name = instructorsNames[i][0]
            break
        }
    }

    if(name === '') console.log('Name not found')

    return name
}

async function getUserRowIndexInAvailabilitySheet(sheet, userFullName) {
    // const sheet = google.sheets({version: 'v4', auth});
    const namesData = await sheet.spreadsheets.values.get({
        spreadsheetId: SPREADSHEETID,
        range: `Доступність інструкторів!A:A`,
    });
    const namesList = namesData.data.values
// console.log(namesList, userFullName)
    let rowIndex = null

    for (let i = 0; i < namesList.length; i++) {
        const name = namesList[i][0]

        if(userFullName === name) {
            rowIndex = i
            break
        }
    }

    return rowIndex
}

async function toggleDayOfTheWeek(sheet, rowIndex, dayLetter) {
    // const sheet = google.sheets({version: 'v4', auth});
    const cellIndex = dayLetter + rowIndex;
    const range = `Доступність інструкторів!${cellIndex}`
    const cellData = await sheet.spreadsheets.values.get({
        spreadsheetId: SPREADSHEETID,
        range,
    });

    const cellValue = cellData.data.values[0][0]

    const finalCheckboxValue = cellValue === "FALSE" ? "TRUE" : "FALSE";

    try {
        await sheet.spreadsheets.values.update({
            spreadsheetId: SPREADSHEETID,
            range,
            valueInputOption: 'USER_ENTERED',
            resource: { range, majorDimension: "ROWS", values: [[finalCheckboxValue]] }});
    }catch (err) {
        console.log('blyat')
        // TODO (Developer) - Handle exception
        throw err;
    }

    // console.log(cellValue.data.values)
}

async function clearAllSelectedDaysByInstructor(sheet, rowIndex) {
    // const sheet = google.sheets({version: 'v4', auth});
    const mondayCell = dayNamesByCellsLettersInSheet[dayNames.monday] + rowIndex
    const fridayCell = dayNamesByCellsLettersInSheet[dayNames.friday] + rowIndex
    const range = `Доступність інструкторів!${mondayCell}:${fridayCell}`

    try {
        await sheet.spreadsheets.values.update({
            spreadsheetId: SPREADSHEETID,
            range,
            valueInputOption: 'USER_ENTERED',
            resource: { range, majorDimension: "COLUMNS", values: [
                    ['FALSE'],
                    ['FALSE'],
                    ['FALSE'],
                    ['FALSE'],
                    ['FALSE']
                ] },
            // auth
        });
    }catch (err) {
        console.log('blyat')
        throw err;
    }
}

async function normalizeUnavailableCheckbox(sheet, rowIndex) {
    // const sheet = google.sheets({version: 'v4', auth});
    const cellIndex = dayNamesByCellsLettersInSheet[notAvailableInstructor] + rowIndex;
    const range = `Доступність інструкторів!${cellIndex}`;
    const cellData = await sheet.spreadsheets.values.get({
        spreadsheetId: SPREADSHEETID,
        range,
    });

    const cellValue = cellData.data.values[0][0]

    if(cellValue === 'FALSE') return

    try {
        await sheet.spreadsheets.values.update({
            spreadsheetId: SPREADSHEETID,
            range,
            valueInputOption: 'USER_ENTERED',
            resource: { range, majorDimension: "COLUMNS", values: [['FALSE']] },
        });
    }catch (err) {
        console.log('blyat')
        throw err;
    }
}



module.exports = {
    getUserNameByNickname,
    getUserRowIndexInAvailabilitySheet,
    toggleDayOfTheWeek,
    clearAllSelectedDaysByInstructor,
    normalizeUnavailableCheckbox
}