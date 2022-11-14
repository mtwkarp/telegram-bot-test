
class MessengerModule {
  constructor(tg, scheduleSheetsManager) {
    this.tg = tg;
    this.scheduleSheetsManager = scheduleSheetsManager;
  }

  setScheduledMessages() {

  }

  async checkIfNextDayWorkable() {
    const nextDayStatus = await this.scheduleSheetsManager.getNextDayWorkStatusInfo();

    if (nextDayStatus === 'FALSE') return false;

    if (nextDayStatus === 'TRUE') return true;
  }
}

module.exports = MessengerModule;
