const {google} = require("googleapis");
const {SPREADSHEETID} = require('../constants/spreadsheetsConstants')
const {dayNames, dayNamesByCellsLettersInSheet, notAvailableInstructor} = require('../constants/spreadsheetsConstants')
const namesLetter = 'A'
const nicknameLetter = 'B'

async function getUserNameByNickname (auth, nickname) {

    const sheets = google.sheets({version: 'v4', auth});
    const namesData = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEETID,
        range: `Список інструкторів!${namesLetter}:${namesLetter}`,
    });

    const instructorsNames = namesData.data.values;

    if (!instructorsNames || instructorsNames.length === 0) {
        console.log('No names data found.');
        return;
    }

    const nicknamesData = await sheets.spreadsheets.values.get({
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

const testWrite = async () => {
    const service = google.sheets({version: 'v4', auth});
    let values = [
        [
            'E41:E41'
        ],
        // Additional rows ...
    ];
    const resource = {
        values,
    };
    try {
        const result = await service.spreadsheets.values.update({
            SPREADSHEETID,
            range: 'Доступність інструкторів!E45',
            valueInputOption: 'USER_ENTERED',
            resource: { range: "Доступність інструкторів!E45", majorDimension: "ROWS", values: [["b"]] },
            auth
        });
        console.log('%d cells updated.', result.data.updatedCells);
        return result;
    } catch (err) {
        console.log('blyat')
        // TODO (Developer) - Handle exception
        throw err;
    }
}

async function getUserRowIndexInAvailabilitySheet(auth, userFullName) {
    const sheets = google.sheets({version: 'v4', auth});
    const namesData = await sheets.spreadsheets.values.get({
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

async function toggleDayOfTheWeek(auth, rowIndex, dayLetter) {
    const sheets = google.sheets({version: 'v4', auth});
    const cellIndex = dayLetter + rowIndex;
    const range = `Доступність інструкторів!${cellIndex}`
    const cellData = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEETID,
        range,
    });

    const cellValue = cellData.data.values[0][0]

    const finalCheckboxValue = cellValue === "FALSE" ? "TRUE" : "FALSE";

    try {
        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEETID,
            range,
            valueInputOption: 'USER_ENTERED',
            resource: { range, majorDimension: "ROWS", values: [[finalCheckboxValue]] },
            auth
        });
    }catch (err) {
        console.log('blyat')
        // TODO (Developer) - Handle exception
        throw err;
    }

    // console.log(cellValue.data.values)
}

async function clearAllSelectedDaysByInstructor(auth, rowIndex) {
    const sheets = google.sheets({version: 'v4', auth});
    const mondayCell = dayNamesByCellsLettersInSheet[dayNames.monday] + rowIndex
    const fridayCell = dayNamesByCellsLettersInSheet[dayNames.friday] + rowIndex
    const range = `Доступність інструкторів!${mondayCell}:${fridayCell}`

    try {
        await sheets.spreadsheets.values.update({
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
            auth
        });
    }catch (err) {
        console.log('blyat')
        throw err;
    }
}

async function normalizeUnavailableCheckbox(auth, rowIndex) {
    const sheets = google.sheets({version: 'v4', auth});
    const cellIndex = dayNamesByCellsLettersInSheet[notAvailableInstructor] + rowIndex;
    const range = `Доступність інструкторів!${cellIndex}`;
    const cellData = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEETID,
        range,
    });

    const cellValue = cellData.data.values[0][0]

    if(cellValue === 'FALSE') return

    try {
        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEETID,
            range,
            valueInputOption: 'USER_ENTERED',
            resource: { range, majorDimension: "COLUMNS", values: [['FALSE']] },
            auth
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