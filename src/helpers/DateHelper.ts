import {DayNames, MonthNames} from '../types/enums';
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

  static getMonthNames(): MonthNames[] {
    return [
      MonthNames.january,
      MonthNames.february,
      MonthNames.march,
      MonthNames.april,
      MonthNames.may,
      MonthNames.june,
      MonthNames.july,
      MonthNames.august,
      MonthNames.september,
      MonthNames.october,
      MonthNames.november,
      MonthNames.december
    ]
  }

  static get nextDayName(): DayNames {
    let nextDayNumber = new Date().getDay() + 1;

    if (nextDayNumber > 6) nextDayNumber = 0;

    return DateHelper.dayNames[nextDayNumber];
  }
  //0 - monday 6 - sunday
  static getDayByNumber(num: number): DayNames {
    const dayNames = DateHelper.dayNames;
    const modifiedNum = num + 1;

    if(modifiedNum > 7) return dayNames[1]; //monday
    if(modifiedNum > 6) return dayNames[0]; // sunday

    return dayNames[modifiedNum];
  }

  static get currentDayName(): DayNames {
    return DateHelper.dayNames[new Date().getDay()];
  }
}
