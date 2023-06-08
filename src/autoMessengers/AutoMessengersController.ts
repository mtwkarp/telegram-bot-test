import type AbstractAutoMessenger from './AbstractAutoMessenger';
import EveryDayCenterScheduleMessenger from './scheduleMessengers/channelScheduleReminders/EveryDayCenterScheduleMessenger';
import NextDayCenterInstructorReminder from './scheduleMessengers/privateScheduleReminders/NextDayCenterInstructorReminder';
import ScheduleEnrolmentMessenger from './scheduleMessengers/ScheduleEnrolmentMessenger';
import EveryDayTripScheduleReminder
  from './scheduleMessengers/channelScheduleReminders/EveryDayTripScheduleReminder';
import NextDayTripInstructorReminder
    from './scheduleMessengers/privateScheduleReminders/NextDayTripInstructorReminder';
import ScheduleCleaner from './scheduleMessengers/ScheduleCleaner';

export default class AutoMessengersController {
  public initMessengerModules(): void {
    const messengerModules: Array<new() => AbstractAutoMessenger> = [
        EveryDayCenterScheduleMessenger,
        NextDayCenterInstructorReminder,
        ScheduleEnrolmentMessenger,
        EveryDayTripScheduleReminder,
        NextDayTripInstructorReminder,
        ScheduleCleaner
    ];

    messengerModules.forEach((M) => {
      const module = new M();
      module.setScheduledMessages();
    });
  }
}
