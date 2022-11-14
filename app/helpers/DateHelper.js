
class DateHelper {
  static get dayNames() {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  }

  static get nextDayName() {
    let nextDayNumber = new Date().getDay() + 1;

    if (nextDayNumber > 6) nextDayNumber = 0;

    return DateHelper.dayNames[nextDayNumber];
  }

  static get currentDayName() {
    return DateHelper.dayNames[new Date().getDay()];
  }
}

module.exports = DateHelper;
