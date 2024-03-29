import AbstractPhotosLoaderStrategy from './AbstractPhotosLoaderStrategy';
import {IPrivateContextDecorator} from '../../../../../tglib/tgTypes/contextDecoratorTypes';
import {IPrivatePhotoPayload} from '../../../../../tglib/tgTypes/messagePayload/contextPayloadTypes';
import {PhotoSize} from 'typegram';


export default class SaveToCurrentDayDate extends AbstractPhotosLoaderStrategy {
    constructor(userId: number, folderId: string) {
        super(userId, folderId);

        this.onInit();
    }

    private onInit() {
        this.sendMessage('Висилайте мені фотографії, я збережу їх на гугл диску.');
    }

    public override async onPhoto(contextDecorator: IPrivateContextDecorator): Promise<void> {
        const payload = contextDecorator.payload as IPrivatePhotoPayload;
        const photo = payload.photo.pop() as PhotoSize;
        const fileLink = await this.tg.getFileLink(photo.file_id);
        const name = Math.random() + fileLink.pathname.slice(fileLink.pathname.lastIndexOf('/'));

        this.uploadedImagesCounter ++;

        this.drivePhotosSaver.savePhotoFromUrlToCurrentDayFolder({url: fileLink.href, name, photoId: photo.file_id}, this.onImageLoadFinish.bind(this));

    }

}
