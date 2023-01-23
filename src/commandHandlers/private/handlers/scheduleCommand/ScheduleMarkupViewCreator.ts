import {notAvailableInstructor, confirmScheduleBtnText} from "./scheduleSheetsConstants";
import {DayNames} from "../../../../types/types";
import {UserScheduleObj} from "./scheduleCmdTypes";
import {Markup} from "telegraf/typings/markup";
import {InlineKeyboardButton, InlineKeyboardMarkup} from "typegram";
import CallbackButton = InlineKeyboardButton.CallbackButton;
class ScheduleMarkupViewCreator {
    public getUserReplyMarkup (userScheduleObj: UserScheduleObj, scheduleConfirmed: boolean = false): Markup<InlineKeyboardMarkup> {
        const {monday, tuesday, wednesday, thursday, friday, saturday, sunday} = DayNames;
        const inlineKeyboard: InlineKeyboardMarkup = {
            inline_keyboard: [
                [
                    this.getChosenDayBtnMarkup(monday, monday, userScheduleObj[monday]),
                    this.getChosenDayBtnMarkup(tuesday, tuesday, userScheduleObj[tuesday]),
                    this.getChosenDayBtnMarkup(wednesday, wednesday, userScheduleObj[wednesday])
                ],
                [
                    this.getChosenDayBtnMarkup(thursday, thursday, userScheduleObj[thursday]),
                    this.getChosenDayBtnMarkup(friday, friday, userScheduleObj[friday]),
                    this.getChosenDayBtnMarkup(saturday, saturday, userScheduleObj[saturday])
                ],
                [
                    this.getChosenDayBtnMarkup(sunday, sunday, userScheduleObj[sunday]),
                    this.getChosenDayBtnMarkup(notAvailableInstructor, notAvailableInstructor, userScheduleObj[notAvailableInstructor])
                ],
                [this.getConfirmButtonMarkup(scheduleConfirmed)]
            ]
        }

        return new Markup(inlineKeyboard)
    };

    public getConfirmButtonMarkup(scheduleConfirmed: boolean = false): CallbackButton {
        const btnText =
            confirmScheduleBtnText + (scheduleConfirmed === false ? ' ➡' : '🔥');

        return { text: btnText, callback_data: confirmScheduleBtnText };
    }

    public getChosenDayBtnMarkup(text: string, callbackData: string, showTick: boolean = false): CallbackButton {
        const btnText = text + (showTick === true ? ' ✅' : '');

        return { text: btnText, callback_data: callbackData };
    }
}

module.exports = ScheduleMarkupViewCreator;
