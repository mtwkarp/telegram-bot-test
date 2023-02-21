
import AbstractCollectionManager from '../AbstractCollectionManager';
import {DayNames} from '../../../../types/enums';
import {ScheduleFullMessages} from '../../../../requestHandlers/implementations/types/types';
import cron from 'node-cron';

export default class ScheduleUpdatesCollection extends AbstractCollectionManager {
    protected constructor() {
        super('schedule_updates');

        this.setupDelayedUpdates();
    }

    private setupDelayedUpdates() {
        const config = {scheduled: true, timeZone: 'Europe/Kiev'};
        const autoEraseTime = '0 0 0 * * Sunday';
        const autoAllowEditingTime = '0 0 20 * * Sunday';
        
        cron.schedule(autoEraseTime, this.eraseLastWeekMessagesData.bind(this), config);
        cron.schedule(autoAllowEditingTime, this.allowMessagesEditing.bind(this), config);
    }

    private async eraseLastWeekMessagesData() {
        const updateObj: Record<string, number> = {
            [DayNames.monday]: 0,
            [DayNames.tuesday]: 0,
            [DayNames.wednesday]: 0,
            [DayNames.thursday]: 0,
            [DayNames.friday]: 0,
            [DayNames.saturday]: 0,
            [DayNames.sunday]: 0,
            lastFullScheduleMessageId: 0
        };

        await this.updateMultipleValues('center', updateObj);
        await this.updateMultipleValues('trips', updateObj);
    }

    private allowMessagesEditing() {
        this.setUpdateAvailability(true);
    }

    public async updateScheduleMessagesIdsAndAllowEdit(messages: ScheduleFullMessages): Promise<void> {
        const {fullScheduleTripsMsg, fullScheduleCenterMsg} = messages;

        if(fullScheduleCenterMsg || fullScheduleTripsMsg) {
            await this.setUpdateAvailability(true);
            await this.eraseLastWeekMessagesData();
        }

        if(fullScheduleCenterMsg !== undefined) {
            await this.setCenterFullScheduleId(fullScheduleCenterMsg.message_id);
        }

        if(fullScheduleTripsMsg !== undefined) {
            await this.setTripFullScheduleId(fullScheduleTripsMsg.message_id);
        }
    }

    public get isUpdateAvailable() {
        return this.getValueFromDocument('options', 'updateAvailable');
    }

    public getCenterOneDayScheduleMsgId(dayName: DayNames): number {
        return this.getValueFromDocument('center', dayName);
    }

    public getCenterFullScheduleMsgId(): number {
        return this.getValueFromDocument('center', 'lastFullScheduleMessageId');
    }

    public getTripFullScheduleMsgId(): number {
        return this.getValueFromDocument('trips', 'lastFullScheduleMessageId');
    }

    public getTripOneDayScheduleMsgId(dayName: DayNames): number {
        return this.getValueFromDocument('trips', dayName);
    }

    public setCenterFullScheduleId(msgId: number): Promise<FirebaseFirestore.WriteResult> {
        return this.updateCenterScheduleValue('lastFullScheduleMessageId', msgId);

    }

    public setTripFullScheduleId(msgId: number): Promise<FirebaseFirestore.WriteResult> {
        return this.updateTripScheduleValue('lastFullScheduleMessageId', msgId);

    }

    public setCenterOneDayScheduleMessageId(dayName: DayNames, msgId: number): Promise<FirebaseFirestore.WriteResult>{
        return this.updateCenterScheduleValue(dayName, msgId);
    }
    public setTripOneDayScheduleMessageId(dayName: DayNames, msgId: number): Promise<FirebaseFirestore.WriteResult>  {
        return this.updateTripScheduleValue(dayName, msgId);
    }

    public setUpdateAvailability(isAvailable: boolean) {
        return this.updateValue('options', 'updateAvailable', isAvailable);
    }

    private async updateCenterScheduleValue(key: string, value: any): Promise<FirebaseFirestore.WriteResult>  {
        return this.updateValue('center', key, value);
    }

    private async updateTripScheduleValue(key: string, value: any): Promise<FirebaseFirestore.WriteResult>  {
        return this.updateValue('trips', key, value);
    }
    public static getInstance(): ScheduleUpdatesCollection {
        if (ScheduleUpdatesCollection.uniqueInstance === null) {
            const newInstance = new ScheduleUpdatesCollection();

            ScheduleUpdatesCollection.uniqueInstance = newInstance;

            return newInstance;
        }

        return ScheduleUpdatesCollection.uniqueInstance;
    }

    private static uniqueInstance: ScheduleUpdatesCollection | null = null;
}
