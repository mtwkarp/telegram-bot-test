import { type UserPrivateScope } from '../ts/user_interfaces';
import { type IPrivateContextDecorator } from '../../tglib/tgTypes/contextDecoratorTypes';

abstract class UserStrategy implements UserPrivateScope {
  abstract onUpdate(context: IPrivateContextDecorator): void
}

export default UserStrategy;
