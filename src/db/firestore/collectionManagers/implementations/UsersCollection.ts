import AbstractCollectionManager from "../AbstractCollectionManager";


export default class UsersCollection extends AbstractCollectionManager {
    protected constructor() {
        super('users');
    }

    public getUserName(valueId: string): string {
        return this.getValueFromDocument('names', valueId)
    }

    public getUserFullName(valueId: string): string {
        return this.getValueFromDocument('names', valueId)
    }
    public static getInstance(): AbstractCollectionManager {
        if(UsersCollection.uniqueInstance === null) {
            const newInstance = new UsersCollection()

            UsersCollection.uniqueInstance = newInstance

            return newInstance
        }

        return UsersCollection.uniqueInstance
    }

    private static uniqueInstance: UsersCollection | null = null
}
