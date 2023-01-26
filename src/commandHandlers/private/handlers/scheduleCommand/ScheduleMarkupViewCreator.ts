import { notAvailableInstructor, confirmScheduleBtnText } from './static/scheduleSheetsConstants';
import { DayNames } from '../../../../types/enums';
import { type IMarkupViewCreator } from '../../../../types/interfaces';
import { type UserScheduleObj } from './ts/schedule_cmd_types';
import { Markup } from 'telegraf';
import { InlineKeyboardButton, type InlineKeyboardMarkup } from 'typegram';
import CallbackButton = InlineKeyboardButton.CallbackButton

const markupDayNames = {
  [DayNames.monday]: 'ПН',
  [DayNames.tuesday]: 'ВТ',
  [DayNames.wednesday]: 'СР',
  [DayNames.thursday]: 'ЧТ',
  [DayNames.friday]: 'ПТ',
  [DayNames.saturday]: 'СБ',
  [DayNames.sunday]: 'НД'
};
export default class ScheduleMarkupViewCreator implements IMarkupViewCreator {
  public getDefaultMarkup(userScheduleObj: UserScheduleObj, scheduleConfirmed = false): Markup.Markup<InlineKeyboardMarkup> {
    const inlineKeyboard = this.getMarkup(userScheduleObj);

    inlineKeyboard.push([this.getConfirmButtonMarkup(scheduleConfirmed)]);

    return Markup.inlineKeyboard(inlineKeyboard);
  }

  getMarkup(userScheduleObj: UserScheduleObj): any[][] {
    const { monday, tuesday, wednesday, thursday, friday, saturday, sunday } = DayNames;
    return [
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
      ]
    ];
  }

  public getPendingMarkup(userScheduleObj: UserScheduleObj): Markup.Markup<InlineKeyboardMarkup> {
    const inlineKeyboard = this.getMarkup(userScheduleObj);

    inlineKeyboard.push([this.getPendingConfirmButtonMarkup()]);

    return Markup.inlineKeyboard(inlineKeyboard);
  }

  public getConfirmButtonMarkup(scheduleConfirmed = false): CallbackButton {
    const btnText = confirmScheduleBtnText + (!scheduleConfirmed ? ' ➡' : '🔥');

    return { text: btnText, callback_data: confirmScheduleBtnText };
  }

  public getPendingConfirmButtonMarkup(): CallbackButton {
    const btnText = confirmScheduleBtnText + '...';

    return { text: btnText, callback_data: confirmScheduleBtnText };
  }

  public getBtnMarkup(text: string, callbackData: string, showTick = false) {
    const btnText = text + (showTick ? ' ✅' : '');

    return { text: btnText, callback_data: callbackData };
  }

  public getChosenDayBtnMarkup(text: DayNames, callbackData: string, showTick = false): CallbackButton {
    let textValue: string = text;

    if (markupDayNames[text] !== undefined) {
      textValue = markupDayNames[text];
    }

    return this.getBtnMarkup(textValue, callbackData, showTick);
  }
}
