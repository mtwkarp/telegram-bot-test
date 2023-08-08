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
    private step: number
    private level: string
    constructor(userId: number) {
        super(userId, CMD_NAMES.SAVE_PHOTO);
        this.strategy = new DefaultStrategy(userId, '');
        this.step = 1
    }

    copy() {
        return new SavePhotosCommandHandler(this.id);
    }

    private setStrategy(updatedStrategy: AbstractPhotosLoaderStrategy): void {
        this.strategy = updatedStrategy;
    }

    onCommand(): void {
        this.step = 1
        this.level = ''

        this.sendChooseLevelMarkup()
    }

    protected override onCallbackQuery(contextDecorator: IPrivateContextDecorator) {
        this.onButtonClick(contextDecorator);
    }

    protected async onButtonClick(contextDecorator: IPrivateContextDecorator): Promise<void> {
        const payload = contextDecorator.payload as IPrivateCbQueryPayload;
        const cbQuery = payload.callback_query as DataQuery;
        const data = cbQuery.data;

        if(this.step === 1) {
            this.level = data === 'ASM' ? process.env.PHOTOS_DRIVE_FOLDER_ASM_ID as string : process.env.PHOTOS_DRIVE_FOLDER_CLS_ID as string
            this.step ++

            this.sendChooseDateMarkup()
        }else if(this.step === 2){
            if(data === 'choose_date') {
                this.strategy = new SaveToSpecificDateStrategy(this.id, this.level);
            }else if(data === 'today'){
                this.setStrategy(new SaveToCurrentDayDate(this.id, this.level));
            }
        }
    }

    private sendChooseDateMarkup() {
        const message = 'Виберіть спосіб збереження світлини.';
        const markup = Markup.inlineKeyboard([
            [
                { text: 'Вказати дату', callback_data: 'choose_date' }
            ],
            [
                { text: 'Зберегти на сьогоднішню дату', callback_data: 'today' },

            ]
        ]);

        this.tg.sendMessage(this.id, message, markup);
    }

    private sendChooseLevelMarkup() {
        const message = 'Виберіть в яку папку зберегти світлини.';
        const markup = Markup.inlineKeyboard([
            [
                { text: 'CLS', callback_data: 'cls' },
                { text: 'ASM', callback_data: 'ASM' },
            ]
        ]);

        this.tg.sendMessage(this.id, message, markup);
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
