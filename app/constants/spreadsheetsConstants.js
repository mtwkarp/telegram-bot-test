const SPREADSHEETID = "19bq0nUJQBanrYNviq_FRTGMsztjhGcXjgbxrFqdCwOQ";

const notAvailableInstructor = "Відсутній(ня)";

const confirmScheduleBtnText = "ПІДТВЕРДИТИ";

const dayNames = {
  monday: "ПН",
  tuesday: "ВТ",
  wednesday: "СР",
  thursday: "ЧТ",
  friday: "ПТ",
  saturday: "СБ",
  sunday: "НД",
};

const dayNamesByCellsLettersInSheet = {
  [dayNames.monday]: "C",
  [dayNames.tuesday]: "D",
  [dayNames.wednesday]: "E",
  [dayNames.thursday]: "F",
  [dayNames.friday]: "G",
  [dayNames.saturday]: "H",
  [dayNames.sunday]: "I",
  [notAvailableInstructor]: "J",
};

module.exports = {
  SPREADSHEETID,
  dayNames,
  dayNamesByCellsLettersInSheet,
  notAvailableInstructor,
  confirmScheduleBtnText,
};
