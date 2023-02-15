import { type IPrivateContextDecorator } from '../../tglib/tgTypes/contextDecoratorTypes';

export interface UserPrivateScope {
  onUpdate: (contextDecorator: IPrivateContextDecorator) => void
}
