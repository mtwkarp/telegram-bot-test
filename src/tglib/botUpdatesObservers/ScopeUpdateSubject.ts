import Subject from '../lib/observer/Subject';
import type { SCOPE_UPDATE_TYPES } from '../tgTypes/botUpdatesTypes';
import { type Context, type Telegraf } from 'telegraf';
import { type Update } from 'typegram';
import { type IContextDecorator } from '../tgTypes/contextDecoratorTypes';
import { type IContextDecoratorCreator } from '../tgTypes/contextDecoratorCreator';

abstract class ScopeUpdateSubject<B extends SCOPE_UPDATE_TYPES, U extends IContextDecorator> extends Subject<U> {
  protected receiveMessagesTypes: B[];
  protected abstract contextDecoratorCreator: IContextDecoratorCreator<B>
  protected constructor(receiveMessagesTypes: B[]) {
    super();

    this.receiveMessagesTypes = receiveMessagesTypes;
  }

  protected subscribeForBotUpdates(bot: Telegraf) {
    this.subscribeForMessages(bot);
  }

  protected subscribeForMessages(bot: Telegraf) {
    this.receiveMessagesTypes.forEach(messageType => {
      if (messageType !== 'command') bot.on(messageType, (context: Context<Update>) => { this.onUpdate(messageType, context); });
    });
  }

  protected abstract onUpdate (updateType: B, context: Context<Update>): void
}

export default ScopeUpdateSubject;
