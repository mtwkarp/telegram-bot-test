import {PRIVATE_UPDATE_TYPES} from "../tgTypes/botUpdatesTypes";
import {Context, Telegraf} from "telegraf";
import {Update} from "typegram"
import ScopeUpdateSubject from "./ScopeUpdateSubject";
import {IPrivateContextDecorator} from "../tgTypes/contextDecoratorTypes";
import PrivateContextDecoratorCreator from "../contextCreators/PrivateContextDecoratorCreator";

class PrivateUpdateSubject extends ScopeUpdateSubject<PRIVATE_UPDATE_TYPES, IPrivateContextDecorator> {

    protected readonly contextDecoratorCreator: PrivateContextDecoratorCreator
    protected receiveCommands: string[]
    constructor(receiveMessagesTypes: PRIVATE_UPDATE_TYPES[], receiveCommands: string[]) {
        super(receiveMessagesTypes);
        this.receiveCommands = receiveCommands
        this.contextDecoratorCreator = new PrivateContextDecoratorCreator()
    }
    override subscribeForBotUpdates(bot: Telegraf) {
        this.subscribeForCommands(bot)
        this.subscribeForMessages(bot)
    }

    protected subscribeForCommands(bot: Telegraf) {
        this.receiveCommands.forEach(commandName => {
            bot.command(commandName, (context: Context<Update>) => this.onUpdate(PRIVATE_UPDATE_TYPES.command, context))
        })
    }

    protected onUpdate(messageType: PRIVATE_UPDATE_TYPES, context: Context<Update>): void {
        if(context.chat?.type !== 'private') return
        
        const contextDecorator: null | IPrivateContextDecorator = this.contextDecoratorCreator.createDecorator(messageType, context)

        if(contextDecorator === null) return

        this.notifyObservers(contextDecorator)
    }
}


export default PrivateUpdateSubject