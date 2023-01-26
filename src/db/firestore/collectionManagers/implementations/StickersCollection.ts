import AbstractCollectionManager from '../AbstractCollectionManager';

export default class StickersCollection extends AbstractCollectionManager {
  protected constructor() {
    super('stickers');
  }

  public getStickerId(valueId: string): string {
    return this.getValueFromDocument('sticker_strings', valueId);
  }

  public static getInstance(): StickersCollection {
    if (StickersCollection.uniqueInstance === null) {
      const newInstance = new StickersCollection();

      StickersCollection.uniqueInstance = newInstance;

      return newInstance;
    }

    return StickersCollection.uniqueInstance;
  }

  private static uniqueInstance: StickersCollection | null = null;
}
