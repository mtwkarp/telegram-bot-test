import {CommandsDictionary, CommandDescription} from "./commandTypes";
import {Context} from "telegraf";
import {Update} from 'typegram'
import {IContextDecorator, IPrivateContextDecorator} from "../tglib/tgTypes/contextDecoratorTypes";
interface UserPrivateScope {
    onUpdate(contextDecorator: IPrivateContextDecorator): void
}

export {
    CommandsDictionary,
    CommandDescription,
    UserPrivateScope
}