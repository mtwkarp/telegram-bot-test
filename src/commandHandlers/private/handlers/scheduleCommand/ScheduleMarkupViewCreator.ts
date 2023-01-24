import {notAvailableInstructor, confirmScheduleBtnText, markupDayNames} from "./static/scheduleSheetsConstants";
import {DayNames} from "../../../../types/types";
import {UserScheduleObj} from "./static/scheduleCmdTypes";
import {Markup} from "telegraf";
import {InlineKeyboardButton, InlineKeyboardMarkup} from "typegram";
import CallbackButton = InlineKeyboardButton.CallbackButton;

export default class ScheduleMarkupViewCreator {
    public getUserReplyMarkup (userScheduleObj: UserScheduleObj, scheduleConfirmed: boolean = false): Markup.Markup<InlineKeyboardMarkup> {
        const {monday, tuesday, wednesday, thursday, friday, saturday, sunday} = DayNames;
        const inlineKeyboard =  [
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
                    this.getBtnMarkup(notAvailableInstructor, notAvailableInstructor, userScheduleObj[notAvailableInstructor])
                ],
                [this.getConfirmButtonMarkup(scheduleConfirmed)]
            ]


        return Markup.inlineKeyboard(inlineKeyboard)
    };

    public getConfirmButtonMarkup(scheduleConfirmed: boolean = false): CallbackButton {
        const btnText = confirmScheduleBtnText + (!scheduleConfirmed ? ' ➡' : '🔥');

        return { text: btnText, callback_data: confirmScheduleBtnText };
    }

    getBtnMarkup(text: string, callbackData: string, showTick: boolean = false) {
        const btnText = text + (showTick ? ' ✅' : '');

        return { text: btnText, callback_data: callbackData };
    }

    public getChosenDayBtnMarkup(text: DayNames, callbackData: string, showTick: boolean = false): CallbackButton {
        let textValue: string = text

        if(markupDayNames[text] !== undefined) {
            textValue = markupDayNames[text]
        }

        return this.getBtnMarkup(textValue, callbackData, showTick)
    }
}

module.exports = ScheduleMarkupViewCreator;
