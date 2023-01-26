import AbstractMessageResponder from '../../../../messagesResponder/AbstractMessageResponder';
import ReplyMsgCollection from '../../../../db/firestore/collectionManagers/implementations/ReplyMsgCollection';
import { type Markup } from 'telegraf';
import { type InlineKeyboardMarkup } from 'typegram';
import StickersCollection from '../../../../db/firestore/collectionManagers/implementations/StickersCollection';

export default class ScheduleCmdResponder extends AbstractMessageResponder {
  protected repliesCollection: ReplyMsgCollection;
  constructor(userId: number) {
    super(userId);

    this.repliesCollection = ReplyMsgCollection.getInstance();
  }

  public async sendDefaultMarkupWithDescription(markup: Markup.Markup<InlineKeyboardMarkup>): Promise<void> {
    const message = this.repliesCollection.getScheduleCmdReply('schedule_markup_description');
    this.tg.sendMessage(this.targetId, message, markup);
  }

  public async editMarkup(messageId: number, inlineMessage: string | undefined, markup: Markup.Markup<InlineKeyboardMarkup>): Promise<void> {
    await this.tg.editMessageReplyMarkup(this.targetId, messageId, undefined, markup.reply_markup);
  }

  public notifyUserAboutClosedSchedule(): void {
    this.sendMessage(this.repliesCollection.getScheduleCmdReply('schedule_closed'));
  }

  public notifyUserToFillSchedule(): void {
    this.sendMessage(this.repliesCollection.getScheduleCmdReply('schedule_must_be_filled_before_sending'));
  }

  public sendConfirmedScheduleReply(): void {
    this.sendMessage(this.repliesCollection.getScheduleCmdReply('confirmed_schedule_reply'));
    this.tg.sendSticker(this.targetId, StickersCollection.getInstance().getStickerId('maks_tak_trimaty'));
  }

  public respondWithUnsuccessfulSpreadsheetInput() {
    this.sendMessage(this.repliesCollection.getScheduleCmdReply('unsuccessful_schedule_input'));
  }

  public async respondWithWaitForScheduleSending() {
    return await this.sendMessage(this.repliesCollection.getScheduleCmdReply('schedule_is_being_sent_response'));
  }

  public notifyUserAboutUnactiveMarkup() {
    this.sendMessage(this.repliesCollection.getScheduleCmdReply('chosen_schedule_markup_not_active'));
  }
}
