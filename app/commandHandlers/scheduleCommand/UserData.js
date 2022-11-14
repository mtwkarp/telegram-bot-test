class UserData {
  constructor(telegramId) {
    this.scheduleConfirmed = false;
    this.userId = telegramId;
    this.asmUserId = null;
    this.schedule = {};
    this.isASMInstructor = false;
    this.previouslySentReplyMarkup = {};
  }
}

module.exports = UserData;
