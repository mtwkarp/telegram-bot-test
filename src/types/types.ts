import {CommandsDictionary, CommandDescription} from "./commandTypes";
import {IPrivateContextDecorator} from "../tglib/tgTypes/contextDecoratorTypes";
interface UserPrivateScope {
    onUpdate(contextDecorator: IPrivateContextDecorator): void
}

export {
    CommandsDictionary,
    CommandDescription,
    UserPrivateScope
}