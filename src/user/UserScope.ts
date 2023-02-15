import type UserStrategy from './userStrategies/UserStrategy';
import InstructorUserStrategy from './userStrategies/InstructorUserStrategy';
import { type UserPrivateScope } from './ts/user_interfaces';
import { type IPrivateContextDecorator } from '../tglib/tgTypes/contextDecoratorTypes';

class UserScope implements UserPrivateScope {
  private readonly id: number;
  private readonly strategy: UserStrategy;

  constructor(id: number) {
    this.id = id;
    this.strategy = new InstructorUserStrategy(id);
  }

  onUpdate(context: IPrivateContextDecorator) {
    this.strategy.onUpdate(context);
  }
}

export default UserScope;
