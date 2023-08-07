import PrivateCmdHandler from '../../../PrivateCmdHandler';
import CenterPhotosDrive from '../../../../../googleServices/gdrive/CenterPhotosDrive';
import {CMD_NAMES} from '../../../../../types/enums';
import ReplyMsgCollection from '../../../../../db/firestore/collectionManagers/implementations/ReplyMsgCollection';
import {IPrivateContextDecorator} from '../../../../../tglib/tgTypes/contextDecoratorTypes';
import {InputMediaPhoto} from 'typegram';

export default class AbstractPhotosLoaderStrategy extends PrivateCmdHandler {

    protected drivePhotosSaver: CenterPhotosDrive;
    protected allowResponseOnDocumentLoad: boolean;
    protected uploadedImagesCounter: number;
    protected notLoadedImagesIds: string[];
    protected constructor(userId: number) {
        super(userId, CMD_NAMES.SAVE_PHOTO);

        this.uploadedImagesCounter = 0;
        this.allowResponseOnDocumentLoad = true;
        this.notLoadedImagesIds = [];

        this.drivePhotosSaver = new CenterPhotosDrive();
    }

    copy() {
        return new AbstractPhotosLoaderStrategy(this.id);
    }

    onCommand() {
    }

    public override async onPhoto(contextDecorator: IPrivateContextDecorator): Promise<void> {

    }

    protected onImageLoadFinish(loadedSuccessfully: boolean, photoId: string): void {
        this.uploadedImagesCounter --;

        if(!loadedSuccessfully) this.notLoadedImagesIds.push(photoId);

        if(this.uploadedImagesCounter === 0) {
            this.onAllImagesUploadFinish(photoId);
        }
    }

    protected onAllImagesUploadFinish(photoId: string): void {
        if(this.notLoadedImagesIds.length > 0) {
            this.sendBackNotUploadedImages();

            return;
        }

        this.sendMessage(ReplyMsgCollection.getInstance().getSavePhotoCmdReply('photos_finished_load'));
    }

    protected async sendBackNotUploadedImages(): Promise<void> {
        const notLoadedImagesConfigs: InputMediaPhoto[]= [];

        this.notLoadedImagesIds.forEach(imageId => {
            notLoadedImagesConfigs.push({type: 'photo', media: imageId});
        });

        this.notLoadedImagesIds = [];

        await this.sendMessage(ReplyMsgCollection.getInstance().getSavePhotoCmdReply('some_photos_not_loaded'));
        this.tg.sendMediaGroup(this.id, notLoadedImagesConfigs);
    }
    public override onDocument(contextDecorator: IPrivateContextDecorator) {
        if(this.allowResponseOnDocumentLoad) {
            this.sendMessage(ReplyMsgCollection.getInstance().getSavePhotoCmdReply('document_load_reply'));

            this.allowResponseOnDocumentLoad = false;

            setTimeout(() => {
                this.allowResponseOnDocumentLoad = true;
            }, 10000);
        }
    }

    public override onText(contextDecorator: IPrivateContextDecorator): void {
        super.onText(contextDecorator);
    }
}
