import {notAvailableInstructor} from "../static/scheduleSheetsConstants";
import {DayNames} from "../../../../../types/enums";

export type UserScheduleObj = {
    [DayNames.monday]: boolean,
    [DayNames.tuesday]: boolean,
    [DayNames.wednesday]: boolean,
    [DayNames.thursday]: boolean,
    [DayNames.friday]: boolean,
    [DayNames.saturday]: boolean,
    [DayNames.sunday]: boolean,
    [notAvailableInstructor]: boolean
}