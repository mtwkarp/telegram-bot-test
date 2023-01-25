import {UserPrivateScope} from "../ts/user_interfaces";
import {IPrivateContextDecorator} from "../../tglib/tgTypes/contextDecoratorTypes";

abstract class UserStrategy implements UserPrivateScope {
    onUpdate(context: IPrivateContextDecorator) {
    }
}

export default UserStrategy