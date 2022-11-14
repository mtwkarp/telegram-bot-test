const SPREADSHEETID = '19bq0nUJQBanrYNviq_FRTGMsztjhGcXjgbxrFqdCwOQ';

const notAvailableInstructor = 'Відсутній(ня)';

const confirmScheduleBtnText = 'ПІДТВЕРДИТИ';

const dayNames = {
  monday: 'ПН',
  tuesday: 'ВТ',
  wednesday: 'СР',
  thursday: 'ЧТ',
  friday: 'ПТ',
  saturday: 'СБ',
  sunday: 'НД'
};

const dayNamesByCellsLettersInSheet = {
  [dayNames.monday]: 'C',
  [dayNames.tuesday]: 'D',
  [dayNames.wednesday]: 'E',
  [dayNames.thursday]: 'F',
  [dayNames.friday]: 'G',
  [dayNames.saturday]: 'H',
  [dayNames.sunday]: 'I',
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

module.exports = {
  SPREADSHEETID,
  dayNames,
  dayNamesByCellsLettersInSheet,
  notAvailableInstructor,
  confirmScheduleBtnText,
  baseInstructorsByLetters,
  fullScheduleByDayLetters,
  numberOfRowsInRenderedSchedule
};
