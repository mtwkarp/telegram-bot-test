import {notAvailableInstructor} from "./scheduleSheetsConstants";
import {DayNames} from "../../../../types/types";

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