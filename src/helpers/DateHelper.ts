import { DayNames } from '../types/enums';
export default class DateHelper {
  static get dayNames(): DayNames[] {
    return [
      DayNames.sunday,
      DayNames.monday,
      DayNames.tuesday,
      DayNames.wednesday,
      DayNames.thursday,
      DayNames.friday,
      DayNames.saturday
    ];
  }

  static get nextDayName(): DayNames {
    let nextDayNumber = new Date().getDay() + 1;

    if (nextDayNumber > 6) nextDayNumber = 0;

    return DateHelper.dayNames[nextDayNumber];
  }

  static get currentDayName(): DayNames {
    return DateHelper.dayNames[new Date().getDay()];
  }
}
