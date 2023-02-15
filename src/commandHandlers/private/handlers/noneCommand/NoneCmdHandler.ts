import PrivateCmdHandler from '../../PrivateCmdHandler';
import { CMD_NAMES } from '../../../../types/enums';
import { type DefaultCmdHandler } from '../../../../types/interfaces';
class NoneCmdHandler extends PrivateCmdHandler implements DefaultCmdHandler {
  constructor(userId: number) {
    super(userId, CMD_NAMES.NONE);
  }

  override copy(): PrivateCmdHandler {
    return new NoneCmdHandler(this.id);
  }

  public sendNotAvailableCmdMessage(): void {
    this.sendMessage('Дана команда наразі вам недоступна. Зверніться до адміністратора бота.');
  }
}

export default NoneCmdHandler;
