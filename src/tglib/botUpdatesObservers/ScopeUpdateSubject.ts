import Subject from "../lib/observer/Subject";
import type {SCOPE_UPDATE_TYPES} from "../tgTypes/botUpdatesTypes";
import {Context} from "telegraf";
import {Update} from "typegram"
import {IContextDecorator} from "../tgTypes/contextDecoratorTypes";
import ContextDecoratorCreator from "../contextCreators/ContextDecoratorCreator";
import {IContextDecoratorCreator} from "../tgTypes/contextDecoratorCreator";

abstract class ScopeUpdateSubject<B extends SCOPE_UPDATE_TYPES, U extends IContextDecorator> extends Subject<U> {

    protected abstract contextDecoratorCreator: IContextDecoratorCreator<SCOPE_UPDATE_TYPES>
    protected abstract onUpdate(updateType: B, context: Context<Update>): void
}



export default ScopeUpdateSubject