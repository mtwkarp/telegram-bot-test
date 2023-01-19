import AbstractCollectionManager from "../AbstractCollectionManager";


export default class TimeCollection extends AbstractCollectionManager {
    protected constructor() {
        super('time_values');
    }

    public getScheduleTime(valueId: string): string {
        return this.getValueFromDocument('schedule', valueId)
    }

    public getTimeConfig(valueId: string): object {
        return this.getValueFromDocument('time_configs', valueId)
    }

    public static getInstance(): AbstractCollectionManager {
        if(TimeCollection.uniqueInstance === null) {
            const newInstance = new TimeCollection()

            TimeCollection.uniqueInstance = newInstance

            return newInstance
        }

        return TimeCollection.uniqueInstance
    }

    private static uniqueInstance: TimeCollection | null = null
}
