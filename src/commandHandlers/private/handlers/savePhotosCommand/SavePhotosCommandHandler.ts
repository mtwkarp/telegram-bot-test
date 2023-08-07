import PrivateCmdHandler from '../../PrivateCmdHandler';
import { CMD_NAMES } from '../../../../types/enums';
import {IPrivateContextDecorator} from '../../../../tglib/tgTypes/contextDecoratorTypes';
import {
    IPrivateCbQueryPayload
} from '../../../../tglib/tgTypes/messagePayload/contextPayloadTypes';
import {CallbackQuery} from 'typegram';
import AbstractPhotosLoaderStrategy from './strategies/AbstractPhotosLoaderStrategy';
import DefaultStrategy from './strategies/DefaultStrategy';
import DataQuery = CallbackQuery.DataQuery;
import {Markup} from 'telegraf';
import SaveToCurrentDayDate from './strategies/SaveToCurrentDayDate';
import SaveToSpecificDateStrategy from './strategies/SaveToSpecificDateStrategy';
export default class SavePhotosCommandHandler extends PrivateCmdHandler {

    private strategy: AbstractPhotosLoaderStrategy;
    constructor(userId: number) {
        super(userId, CMD_NAMES.SAVE_PHOTO);
        this.strategy = new DefaultStrategy(userId);
    }

    copy() {
        return new SavePhotosCommandHandler(this.id);
    }

    private setStrategy(updatedStrategy: AbstractPhotosLoaderStrategy): void {
        this.strategy = updatedStrategy;
    }

    onCommand(): void {
        const message = 'Виберіть спосіб збереження світлини.';
        const markup = Markup.inlineKeyboard([
            [
                { text: 'Вказати дату.', callback_data: 'choose_date' }
            ],
            [
                { text: 'Зберегти на сьогоднішню дату.', callback_data: 'today' },

            ]
        ]);

        this.tg.sendMessage(this.id, message, markup);
    }

    protected override onCallbackQuery(contextDecorator: IPrivateContextDecorator) {
        this.onButtonClick(contextDecorator);
    }

    protected async onButtonClick(contextDecorator: IPrivateContextDecorator): Promise<void> {
        const payload = contextDecorator.payload as IPrivateCbQueryPayload;
        const cbQuery = payload.callback_query as DataQuery;
        const data = cbQuery.data;

        if(data === 'choose_date') {
            this.strategy = new SaveToSpecificDateStrategy(this.id);
        }else if(data === 'today'){
            this.setStrategy(new SaveToCurrentDayDate(this.id));
        }
        console.log(data);
    }

    protected override onPhoto(contextDecorator: IPrivateContextDecorator): void {
       this.strategy.onPhoto(contextDecorator);
    }

    protected override onDocument(contextDecorator: IPrivateContextDecorator): void {
        this.strategy.onDocument(contextDecorator);
    }

    protected override onText(contextDecorator: IPrivateContextDecorator): void {
        this.strategy.onText(contextDecorator);
    }
}
