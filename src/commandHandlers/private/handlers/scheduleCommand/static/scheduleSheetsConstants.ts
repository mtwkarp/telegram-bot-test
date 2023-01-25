import {DayNames} from "../../../../../types/enums";
const notAvailableInstructor = 'Відсутній(ня)';
const noResponseInstructorsColumn = 'M';


const confirmScheduleBtnText: string = 'ПІДТВЕРДИТИ';

const dayNamesByCellsLettersInSheet = {
    [DayNames.monday]: 'C',
    [DayNames.tuesday]: 'D',
    [DayNames.wednesday]: 'E',
    [DayNames.thursday]: 'F',
    [DayNames.friday]: 'G',
    [DayNames.saturday]: 'H',
    [DayNames.sunday]: 'I',
    [notAvailableInstructor]: 'J'
};

const baseInstructorsByLetters = {
    Monday: {
        ['blood']: 'A',
        ['lungs']: 'B',
        ['heart']: 'C',
        ['evacuation']: 'D'
    },
    Tuesday: {
        ['blood']: 'F',
        ['lungs']: 'G',
        ['heart']: 'H',
        ['evacuation']: 'I'
    },
    Wednesday: {
        ['blood']: 'K',
        ['lungs']: 'L',
        ['heart']: 'M',
        ['evacuation']: 'N'
    },
    Thursday: {
        ['blood']: 'P',
        ['lungs']: 'Q',
        ['heart']: 'R',
        ['evacuation']: 'S'
    },
    Friday: {
        ['blood']: 'U',
        ['lungs']: 'V',
        ['heart']: 'W',
        ['evacuation']: 'X'
    },
    Saturday: {
        ['blood']: 'Z',
        ['lungs']: 'AA',
        ['heart']: 'AB',
        ['evacuation']: 'AC'
    },
    Sunday: {
        ['blood']: 'AE',
        ['lungs']: 'AF',
        ['heart']: 'AG',
        ['evacuation']: 'AH'
    }
};

const fullScheduleByDayLetters = {
    ['Monday']: 'A',
    ['Tuesday']: 'B',
    ['Wednesday']: 'C',
    ['Thursday']: 'D',
    ['Friday']: 'E',
    ['Saturday']: 'F',
    ['Sunday']: 'G'
};

const numberOfRowsInRenderedSchedule = 14;

export {
    dayNamesByCellsLettersInSheet,
    notAvailableInstructor,
    confirmScheduleBtnText,
    baseInstructorsByLetters,
    fullScheduleByDayLetters,
    numberOfRowsInRenderedSchedule,
    noResponseInstructorsColumn
};
