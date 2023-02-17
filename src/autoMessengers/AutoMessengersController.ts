import type AbstractAutoMessenger from './AbstractAutoMessenger';
import EveryDayCenterScheduleMessenger from './scheduleMessengers.ts/channelScheduleReminders/EveryDayCenterScheduleMessenger';
import NextDayInstructorReminderMessenger from './scheduleMessengers.ts/NextDayInstructorReminderMessenger';
import ScheduleEnrolmentMessenger from './scheduleMessengers.ts/ScheduleEnrolmentMessenger';
import EveryDayTripScheduleReminder
  from "./scheduleMessengers.ts/channelScheduleReminders/EveryDayTripScheduleReminder";
export default class AutoMessengersController {
  public initMessengerModules(): void {
    const messengerModules: Array<new() => AbstractAutoMessenger> = [
        EveryDayCenterScheduleMessenger,
        NextDayInstructorReminderMessenger,
        ScheduleEnrolmentMessenger,
        EveryDayTripScheduleReminder
    ];

    messengerModules.forEach((M) => {
      const module = new M();
      module.setScheduledMessages();
    });
  }
}
