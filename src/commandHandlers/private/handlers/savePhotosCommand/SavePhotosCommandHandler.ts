import PrivateCmdHandler from '../../PrivateCmdHandler';
import ReplyMsgCollection from '../../../../db/firestore/collectionManagers/implementations/ReplyMsgCollection';
import { CMD_NAMES } from '../../../../types/enums';
import {IPrivateContextDecorator} from '../../../../tglib/tgTypes/contextDecoratorTypes';
import {IPrivatePhotoPayload} from '../../../../tglib/tgTypes/messagePayload/contextPayloadTypes';
import {InputMediaPhoto, PhotoSize} from 'typegram';
import CenterPhotosDrive from '../../../../googleServices/gdrive/CenterPhotosDrive';
export default class SavePhotosCommandHandler extends PrivateCmdHandler {

    private drivePhotosSaver: CenterPhotosDrive;
    private allowResponseOnDocumentLoad: boolean;
    private uploadedImagesCounter: number;
    private notLoadedImagesIds: string[];
    constructor(userId: number) {
        super(userId, CMD_NAMES.SAVE_PHOTO);

        this.uploadedImagesCounter = 0;
        this.allowResponseOnDocumentLoad = true;
        this.notLoadedImagesIds = [];

        this.drivePhotosSaver = new CenterPhotosDrive();
    }

    copy() {
        return new SavePhotosCommandHandler(this.id);
    }

    onCommand() {
        this.sendMessage(ReplyMsgCollection.getInstance().getSavePhotoCmdReply('command_reply'));
    }

    protected override async onPhoto(contextDecorator: IPrivateContextDecorator): Promise<void> {
        const payload = contextDecorator.payload as IPrivatePhotoPayload;
        const photo = payload.photo.pop() as PhotoSize;
        const fileLink = await this.tg.getFileLink(photo.file_id);
        const name = Math.random() + fileLink.pathname.slice(fileLink.pathname.lastIndexOf('/'));

        this.uploadedImagesCounter ++;

        this.drivePhotosSaver.savePhotoFromUrlToCurrentMonthFolder({url: fileLink.href, name})
            .then((loadedSuccessfully: boolean) => {
                this.onImageLoadFinish(loadedSuccessfully, photo.file_id);
            });
    }

    private onImageLoadFinish(loadedSuccessfully: boolean, photoId: string): void {
        this.uploadedImagesCounter --;

        if(!loadedSuccessfully) this.notLoadedImagesIds.push(photoId);

        if(this.uploadedImagesCounter === 0) {
            this.onAllImagesUploadFinish(photoId);
        }
    }

    private onAllImagesUploadFinish(photoId: string): void {
        if(this.notLoadedImagesIds.length > 0) {
            this.sendBackNotUploadedImages();

            return;
        }

        this.sendMessage(ReplyMsgCollection.getInstance().getSavePhotoCmdReply('photos_finished_load'));
    }

    private async sendBackNotUploadedImages(): Promise<void> {
        const notLoadedImagesConfigs: InputMediaPhoto[]= [];

        this.notLoadedImagesIds.forEach(imageId => {
            notLoadedImagesConfigs.push({type: 'photo', media: imageId});
        });

        this.notLoadedImagesIds = [];

        await this.sendMessage(ReplyMsgCollection.getInstance().getSavePhotoCmdReply('some_photos_not_loaded'));
        this.tg.sendMediaGroup(this.id, notLoadedImagesConfigs);
    }
    protected override onDocument(contextDecorator: IPrivateContextDecorator) {
        if(this.allowResponseOnDocumentLoad) {
            this.sendMessage(ReplyMsgCollection.getInstance().getSavePhotoCmdReply('document_load_reply'));

            this.allowResponseOnDocumentLoad = false;

            setTimeout(() => {
                this.allowResponseOnDocumentLoad = true;
            }, 10000);
        }
    }
}
