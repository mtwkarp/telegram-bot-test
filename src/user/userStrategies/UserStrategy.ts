import {Context} from "telegraf";
import {UserPrivateScope} from "../../types/types";
import {IContextDecorator, IPrivateContextDecorator} from "../../tglib/tgTypes/contextDecoratorTypes";

abstract class UserStrategy implements UserPrivateScope{


    onUpdate(context: IPrivateContextDecorator) {

    }

}

export default UserStrategy