import ContextDecoratorCreator from './ContextDecoratorCreator';
import { UPDATE_SCOPES } from '../tgTypes/botUpdatesScopes';
import PrivatePayloadCreator from '../payloadCreators/PrivatePayloadCreator';
import { type PRIVATE_UPDATE_TYPES } from '../tgTypes/botUpdatesTypes';
import { type IPrivateContextDecorator } from '../tgTypes/contextDecoratorTypes';
import { type Context } from 'telegraf';
import { type Update } from 'typegram';
import { type IPrivateContextPayload } from '../tgTypes/messagePayload/contextPayloadTypes';

export default class PrivateContextDecoratorCreator extends ContextDecoratorCreator<PRIVATE_UPDATE_TYPES> {
  protected readonly updateScope: UPDATE_SCOPES.PRIVATE = UPDATE_SCOPES.PRIVATE;
  protected readonly payloadCreator: PrivatePayloadCreator = new PrivatePayloadCreator();

  createDecorator(updateType: PRIVATE_UPDATE_TYPES, context: Context<Update>): IPrivateContextDecorator | null {
    const payload: null | IPrivateContextPayload = this.payloadCreator.create(updateType, context);

    if (payload === null) {
      return null;
    }

    return {
      payload,
      messagePayloadType: payload.type,
      updateType,
      updateScope: this.updateScope,
      context
    };
  }
}
