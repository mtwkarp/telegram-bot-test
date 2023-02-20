
import AbstractCollectionManager from '../AbstractCollectionManager';
import {DayNames} from '../../../../types/enums';

export default class ScheduleUpdatesCollection extends AbstractCollectionManager {
    protected constructor() {
        super('schedule_updates');
    }

    public getCenterOneDayScheduleMsgId(dayName: DayNames): string {
        return this.getValueFromDocument('center', dayName);
    }

    public getCenterFullScheduleMsgId(): number {
        return this.getValueFromDocument('center', 'lastFullScheduleMessageId');
    }

    public getTripFullScheduleMsgId(): number {
        return this.getValueFromDocument('trip', 'lastFullScheduleMessageId');
    }

    public getTripOneDayScheduleMsgId(dayName: DayNames): number {
        return this.getValueFromDocument('trip', dayName);
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

    private async updateCenterScheduleValue(key: string, value: any): Promise<FirebaseFirestore.WriteResult>  {
        return this.updateValue('center', key, value);
    }

    private async updateTripScheduleValue(key: string, value: any): Promise<FirebaseFirestore.WriteResult>  {
        return this.updateValue('trip', key, value);
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
