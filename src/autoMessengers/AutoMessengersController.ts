import AbstractAutoMessenger from "./AbstractAutoMessenger";
import EveryDayScheduleMessenger from "./scheduleMessengers.ts/EveryDayScheduleMessenger";
import NextDayInstructorReminderMessenger from "./scheduleMessengers.ts/NextDayInstructorReminderMessenger";
import ScheduleEnrolmentMessenger from "./scheduleMessengers.ts/ScheduleEnrolmentMessenger";
export default class AutoMessengersController {
    public initMessengerModules(): void {
        const messengerModules: { new(): AbstractAutoMessenger }[] = [EveryDayScheduleMessenger, NextDayInstructorReminderMessenger, ScheduleEnrolmentMessenger];

        messengerModules.forEach((M) => {
            const module = new M();
            module.setScheduledMessages();
        });
    }
}