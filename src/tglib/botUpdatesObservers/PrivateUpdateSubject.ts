import {PRIVATE_UPDATE_TYPES} from "../tgTypes/botUpdatesTypes";
import {Context, Telegraf} from "telegraf";
import {Update} from "typegram"
import ScopeUpdateSubject from "./ScopeUpdateSubject";
import {IPrivateContextDecorator} from "../tgTypes/contextDecoratorTypes";
import PrivateContextDecoratorCreator from "../contextCreators/PrivateContextDecoratorCreator";

class PrivateUpdateSubject extends ScopeUpdateSubject<PRIVATE_UPDATE_TYPES, IPrivateContextDecorator> {

    protected readonly contextDecoratorCreator: PrivateContextDecoratorCreator

    constructor() {
        super();

        this.contextDecoratorCreator = new PrivateContextDecoratorCreator()
    }
    subscribeForBotUpdates(bot: Telegraf) {
        bot.on(PRIVATE_UPDATE_TYPES.text, (context: Context<Update>) => this.onUpdate(PRIVATE_UPDATE_TYPES.text, context))
    }
    protected onUpdate(messageType: PRIVATE_UPDATE_TYPES, context: Context<Update>): void {
        if(context.chat?.type !== 'private') return
        
        const contextDecorator: IPrivateContextDecorator = this.contextDecoratorCreator.createDecorator(messageType, context)

        this.notifyObservers(contextDecorator)
    }
}


export default PrivateUpdateSubject