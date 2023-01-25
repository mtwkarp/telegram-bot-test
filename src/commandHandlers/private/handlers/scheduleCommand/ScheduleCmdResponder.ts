import AbstractMessageResponder from "../../../../messagesResponder/AbstractMessageResponder";
import ReplyMsgCollection from "../../../../db/firestore/collectionManagers/implementations/ReplyMsgCollection";

export default class ScheduleCmdResponder extends AbstractMessageResponder {

    protected repliesCollection: ReplyMsgCollection
    constructor(userId: number) {
        super(userId)
    }

    public notifyUserAboutClosedSchedule(): void {
        this.sendMessage(this.repliesCollection.getScheduleCmdReply('schedule_closed'));
    }

    public notifyUserToFillSchedule(): void {
        this.sendMessage(this.repliesCollection.getScheduleCmdReply('schedule_must_be_filled_before_sending'));
    }

    public sendConfirmedScheduleReply(): void {
        this.sendMessage(this.repliesCollection.getScheduleCmdReply( 'confirmed_schedule_reply'));
    }

}