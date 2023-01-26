import { type IPrivateContextDecorator } from '../../../tglib/tgTypes/contextDecoratorTypes';

export interface IPrivateCmdHandler {
  onUpdate: (contextDecorator: IPrivateContextDecorator) => void
  onCommand: (contextDecorator: IPrivateContextDecorator) => void

}
