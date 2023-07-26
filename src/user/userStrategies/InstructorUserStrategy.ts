import UserStrategy from './UserStrategy';
import { type IPrivateContextDecorator } from '../../tglib/tgTypes/contextDecoratorTypes';
import PrivateCmdHandlersManager from '../../commandHandlers/private/PrivateCmdHandlersManager';
import ScheduleCmdHandler from '../../commandHandlers/private/handlers/scheduleCommand/ScheduleCmdHandler';
import CommandsInfoHandler from '../../commandHandlers/private/handlers/ infoCommand/CommandsInfoCmdHandler';
import StartCmdHandler from '../../commandHandlers/private/handlers/startCommand/StartCmdHandler';
import SavePhotosCommandHandler
  from '../../commandHandlers/private/handlers/savePhotosCommand/SavePhotosCommandHandler';
import TimingCmdHandler from "../../commandHandlers/private/handlers/timingCommand/TimingCmdHandler";

class InstructorUserStrategy extends UserStrategy {
  protected cmdHandlerManager: PrivateCmdHandlersManager;
  constructor(userId: number) {
    super();

    this.cmdHandlerManager = new PrivateCmdHandlersManager(userId, [
        ScheduleCmdHandler,
        CommandsInfoHandler,
        StartCmdHandler,
        SavePhotosCommandHandler,
        TimingCmdHandler
    ]);
  }

  override onUpdate(context: IPrivateContextDecorator) {
    this.cmdHandlerManager.onUpdate(context);
  }
}

export default InstructorUserStrategy;
