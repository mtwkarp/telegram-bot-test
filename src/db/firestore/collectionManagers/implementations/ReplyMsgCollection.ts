import AbstractCollectionManager from '../AbstractCollectionManager';

export default class ReplyMsgCollection extends AbstractCollectionManager {
  protected constructor() {
    super('reply_messages');
  }

  public getScheduleCmdReply(valueId: string): string {
    return this.getValueFromDocument('schedule', valueId);
  }

  public getSavePhotoCmdReply(valueId: string): string {
    return this.getValueFromDocument('save_photos', valueId);
  }

  public getMakingPhotosReply(valueId: string): string {
    return this.getValueFromDocument('makePhotosReminder', valueId);
  }

  public static getInstance(): ReplyMsgCollection {
    if (ReplyMsgCollection.uniqueInstance === null) {
      const newInstance = new ReplyMsgCollection();

      ReplyMsgCollection.uniqueInstance = newInstance;

      return newInstance;
    }

    return ReplyMsgCollection.uniqueInstance;
  }

  private static uniqueInstance: ReplyMsgCollection | null = null;
}
