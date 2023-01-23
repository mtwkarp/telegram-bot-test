import {CommandsDictionary, CommandDescription} from "./commandTypes";
import {IPrivateContextDecorator} from "../tglib/tgTypes/contextDecoratorTypes";
export {DayNames} from './dateTypes'
interface UserPrivateScope {
    onUpdate(contextDecorator: IPrivateContextDecorator): void
}

interface DefaultCmdHandler {
    sendNotAvailableCmdMessage(): void
}

interface ITimeAccessController {
    init(): void,
    readonly accessible: boolean
}

export {
    CommandsDictionary,
    CommandDescription,
    UserPrivateScope,
    DefaultCmdHandler,
    ITimeAccessController
}