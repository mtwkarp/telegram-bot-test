import type AbstractAutoMessenger from './AbstractAutoMessenger';
import EveryDayCenterScheduleMessenger from './scheduleMessengers.ts/channelScheduleReminders/EveryDayCenterScheduleMessenger';
import NextDayCenterInstructorReminder from './scheduleMessengers.ts/privateScheduleReminders/NextDayCenterInstructorReminder';
import ScheduleEnrolmentMessenger from './scheduleMessengers.ts/ScheduleEnrolmentMessenger';
import EveryDayTripScheduleReminder
  from './scheduleMessengers.ts/channelScheduleReminders/EveryDayTripScheduleReminder';
import NextDayTripInstructorReminder
    from './scheduleMessengers.ts/privateScheduleReminders/NextDayTripInstructorReminder';
export default class AutoMessengersController {
  public initMessengerModules(): void {
    const messengerModules: Array<new() => AbstractAutoMessenger> = [
        EveryDayCenterScheduleMessenger,
        NextDayCenterInstructorReminder,
        ScheduleEnrolmentMessenger,
        EveryDayTripScheduleReminder,
        NextDayTripInstructorReminder
    ];

    messengerModules.forEach((M) => {
      const module = new M();
      module.setScheduledMessages();
    });
  }
}
