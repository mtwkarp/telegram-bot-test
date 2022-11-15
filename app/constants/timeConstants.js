// # ┌────────────── second (optional)
// # │ ┌──────────── minute
// # │ │ ┌────────── hour
// # │ │ │ ┌──────── day of month
// # │ │ │ │ ┌────── month
// # │ │ │ │ │ ┌──── day of week
// # │ │ │ │ │ │
// # │ │ │ │ │ │
// # * * * * * *

const openScheduleTime = '0 0 18 * * Thursday';
const closeScheduleTime = '0 0 17 * * Sunday';

const channelScheduleReminder1 = '0 0 18 * * Thursday';
const channelScheduleReminder2 = '0 0 18 * * Friday';
const privateMsgScheduleReminder1 = '0 0 15 * * Saturday';
const privateMsgScheduleReminder2 = '0 0 12 * * Sunday';

const everyDayTeachingReminder = '0 0 18 * * Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday';
const everyDayFullScheduleReminder = '0 0 20 * * Monday,Tuesday,Wednesday,Thursday,Friday,Saturday';

const timeConfig = {
  scheduled: true,
  timezone: 'Europe/Kiev'
};

module.exports = {
  openScheduleTime,
  closeScheduleTime,
  privateMsgScheduleReminder1,
  privateMsgScheduleReminder2,
  channelScheduleReminder1,
  channelScheduleReminder2,
  timeConfig,
  everyDayTeachingReminder,
  everyDayFullScheduleReminder
};
