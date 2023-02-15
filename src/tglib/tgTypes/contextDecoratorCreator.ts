import { type SCOPE_UPDATE_TYPES } from './botUpdatesTypes';
import { type Context } from 'telegraf';
import { type Update } from 'typegram';
import { type IContextDecorator } from './contextDecoratorTypes';

export interface IContextDecoratorCreator<U extends SCOPE_UPDATE_TYPES> {
  createDecorator: (updateType: U, context: Context<Update>) => IContextDecorator | null
}
