import {CommandsDictionary, CommandDescription} from "./commandTypes";
import {IPrivateContextDecorator} from "../tglib/tgTypes/contextDecoratorTypes";
interface UserPrivateScope {
    onUpdate(contextDecorator: IPrivateContextDecorator): void
}

interface DefaultCmdHandler {
    sendNotAvailableCmdMessage(): void
}

export {
    CommandsDictionary,
    CommandDescription,
    UserPrivateScope, DefaultCmdHandler
}