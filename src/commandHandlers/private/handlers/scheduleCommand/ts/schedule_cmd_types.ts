import { type notAvailableInstructor } from '../static/scheduleSheetsConstants';
import { type DayNames } from '../../../../../types/enums';

export interface UserScheduleObj {
  [DayNames.monday]: boolean
  [DayNames.tuesday]: boolean
  [DayNames.wednesday]: boolean
  [DayNames.thursday]: boolean
  [DayNames.friday]: boolean
  [DayNames.saturday]: boolean
  [DayNames.sunday]: boolean
  [notAvailableInstructor]: boolean
}
