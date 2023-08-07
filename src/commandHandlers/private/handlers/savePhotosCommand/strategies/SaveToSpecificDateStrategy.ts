import AbstractPhotosLoaderStrategy from './AbstractPhotosLoaderStrategy';
import {IPrivateContextDecorator} from '../../../../../tglib/tgTypes/contextDecoratorTypes';
import {
    IPrivatePhotoPayload,
    IPrivateTextPayload
} from '../../../../../tglib/tgTypes/messagePayload/contextPayloadTypes';
import {PhotoSize} from 'typegram';


export default class SaveToSpecificDateStrategy extends AbstractPhotosLoaderStrategy {

    private date: string | null;
    constructor(userId: number) {
        super(userId);

        this.date = null;

        this.onInit();
    }

    private onInit() {
        this.sendMessage('Надішліть мені дату зроблених фото у наступному форматі - "21.08"');
    }

    public override async onPhoto(contextDecorator: IPrivateContextDecorator): Promise<void> {
        if(this.date) {
            const payload = contextDecorator.payload as IPrivatePhotoPayload;
            const photo = payload.photo.pop() as PhotoSize;
            const fileLink = await this.tg.getFileLink(photo.file_id);
            const name = Math.random() + fileLink.pathname.slice(fileLink.pathname.lastIndexOf('/'));

            this.uploadedImagesCounter ++;

            this.drivePhotosSaver.savePhotoFromUrlToCurrentDayFolder({url: fileLink.href, name})
                .then((loadedSuccessfully: boolean) => {
                    this.onImageLoadFinish(loadedSuccessfully, photo.file_id);
                });
        }else {
            this.sendMessage('Спочатку вкажи дату в наступному форматі - "21.08"');
        }

    }

    private isValidDateFormat(input: string): boolean {
        // Regular expression to match the format DD.MM
        const regex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])$/;
        return regex.test(input);
    }


    public override onText(contextDecorator: IPrivateContextDecorator): void {
        const payload = contextDecorator.payload as IPrivateTextPayload;
        const result = this.isValidDateFormat(payload.text);

        if(result) {
            this.date = payload.text;
            this.sendMessage(`Ви вказали наступну дату - "${payload.text}". Тепер чекаю на світлини.`);
        }else {
            this.sendMessage('Не валідний формат дати. Вкажіть дату у наступній формі - "21.08"');
        }
    }
}
