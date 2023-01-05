import {IContextDecorator} from "../tglib/tgTypes/contextDecoratorTypes";

export interface ICmdHandler {
    onUpdate(contextDecorator: IContextDecorator): void
    onCommand(contextDecorator: IContextDecorator): void
}
