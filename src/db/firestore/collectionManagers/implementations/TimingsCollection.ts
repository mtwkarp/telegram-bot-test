import AbstractCollectionManager from '../AbstractCollectionManager';

export default class TimingsCollection extends AbstractCollectionManager {
    protected constructor() {
        super('timings');
    }

    getCenterTiming(): number[] {
        return this.getValueFromDocument('center', 'classes_timing')
    }

    public static getInstance(): TimingsCollection {
        if (TimingsCollection.uniqueInstance === null) {
            const newInstance = new TimingsCollection();

            TimingsCollection.uniqueInstance = newInstance;

            return newInstance;
        }

        return TimingsCollection.uniqueInstance;
    }

    private static uniqueInstance: TimingsCollection | null = null;
}
