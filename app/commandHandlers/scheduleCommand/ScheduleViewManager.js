const {
  dayNames,
  notAvailableInstructor,
  confirmScheduleBtnText,
} = require("../../constants/spreadsheetsConstants");

class ScheduleViewManager {
  getUserReplyMarkup = (userSchedule, scheduleConfirmed = false) => {
    const { monday, tuesday, wednesday, thursday, friday, saturday, sunday } =
      dayNames;

    return {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [
            this.getChosenDayBtnMarkup(monday, monday, userSchedule[monday]),
            this.getChosenDayBtnMarkup(tuesday, tuesday, userSchedule[tuesday]),
            this.getChosenDayBtnMarkup(
              wednesday,
              wednesday,
              userSchedule[wednesday]
            ),
          ],
          [
            this.getChosenDayBtnMarkup(
              thursday,
              thursday,
              userSchedule[thursday]
            ),
            this.getChosenDayBtnMarkup(
              saturday,
              saturday,
              userSchedule[saturday]
            ),
            this.getChosenDayBtnMarkup(friday, friday, userSchedule[friday]),
          ],
          [
            this.getChosenDayBtnMarkup(sunday, sunday, userSchedule[sunday]),
            this.getChosenDayBtnMarkup(
              notAvailableInstructor,
              notAvailableInstructor,
              userSchedule[notAvailableInstructor]
            ),
          ],
          [this.getConfirmButtonMarkup(scheduleConfirmed)],
        ],
      }),
    };
  };

  getConfirmButtonMarkup(scheduleConfirmed = false) {
    const btnText =
      confirmScheduleBtnText + (scheduleConfirmed === false ? " ➡" : "🔥");

    return { text: btnText, callback_data: confirmScheduleBtnText };
  }

  getChosenDayBtnMarkup(text, callbackData, showTick = false) {
    const btnText = text + (showTick === true ? " ✅" : "");

    return { text: btnText, callback_data: callbackData };
  }
}

module.exports = ScheduleViewManager;
