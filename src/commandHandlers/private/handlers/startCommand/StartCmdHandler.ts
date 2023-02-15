import PrivateCmdHandler from '../../PrivateCmdHandler';
import { CMD_NAMES } from '../../../../types/enums';
import ReplyMsgCollection from '../../../../db/firestore/collectionManagers/implementations/ReplyMsgCollection';

export default class StartCmdHandler extends PrivateCmdHandler {
  constructor(userId: number) {
    super(userId, CMD_NAMES.START);
  }

  copy(): PrivateCmdHandler {
    return new StartCmdHandler(this.id);
  }

  protected override onCommand() {
    const reply = ReplyMsgCollection.getInstance().getValueFromDocument('start', 'bot_introduction');

    this.sendMessage(reply);
  }
}
