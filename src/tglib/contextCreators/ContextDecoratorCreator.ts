import { type IContextDecoratorCreator } from '../tgTypes/contextDecoratorCreator';
import { type SCOPE_UPDATE_TYPES } from '../tgTypes/botUpdatesTypes';
import { type Context } from 'telegraf';
import { type Update } from 'typegram';
import { type IContextDecorator } from '../tgTypes/contextDecoratorTypes';
import { type IPayloadCreator } from '../tgTypes/messagePayload/payloadCreator';
import { type BOT_UPDATE_SCOPE } from '../tgTypes/botUpdatesScopes';

export default abstract class ContextDecoratorCreator<U extends SCOPE_UPDATE_TYPES> implements IContextDecoratorCreator<U> {
  protected abstract updateScope: BOT_UPDATE_SCOPE
  protected abstract payloadCreator: IPayloadCreator

  public abstract createDecorator (updateType: U, context: Context<Update>): IContextDecorator | null
}
