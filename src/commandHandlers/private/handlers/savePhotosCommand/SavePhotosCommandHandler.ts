import PrivateCmdHandler from '../../PrivateCmdHandler';
import ReplyMsgCollection from '../../../../db/firestore/collectionManagers/implementations/ReplyMsgCollection';
import { CMD_NAMES } from '../../../../types/enums';
import {IPrivateContextDecorator} from '../../../../tglib/tgTypes/contextDecoratorTypes';
import {IPrivatePhotoPayload} from '../../../../tglib/tgTypes/messagePayload/contextPayloadTypes';
import PhotosSaverDrive from '../../../../googleServices/gdrive/PhotosSaverDrive';
import {InputMediaPhoto, PhotoSize} from "typegram";
export default class SavePhotosCommandHandler extends PrivateCmdHandler {

    private drivePhotosSaver: PhotosSaverDrive;
    private allowResponseOnDocumentLoad: boolean;
    private uploadedImagesCounter: number
    private notLoadedImagesIds: string[]
    constructor(userId: number) {
        super(userId, CMD_NAMES.SAVE_PHOTO);

        this.uploadedImagesCounter = 0
        this.allowResponseOnDocumentLoad = true;
        this.notLoadedImagesIds = []

        this.drivePhotosSaver = new PhotosSaverDrive();
    }

    copy() {
        return new SavePhotosCommandHandler(this.id);
    }

    onCommand() {
        const reply = ReplyMsgCollection.getInstance().getSavePhotoCmdReply('command_reply');

        this.sendMessage(reply); // this.sendMessage(this.id, FirebaseDB.getReplyMessage('commands', 'commands_description'));
    }

    protected override async onPhoto(contextDecorator: IPrivateContextDecorator): Promise<void> {
        const payload = contextDecorator.payload as IPrivatePhotoPayload;
        const photo = payload.photo.pop() as PhotoSize
        const file = await this.tg.getFile(photo.file_id);
        const fileLink = await this.tg.getFileLink(file.file_id);

        this.uploadedImagesCounter ++
        this.drivePhotosSaver.savePhotoFromURL(fileLink.href, fileLink.pathname)
            .then((loadedSuccessfully: boolean) => {
                this.onImageLoadFinish(loadedSuccessfully, photo.file_id)
            });
    }

    private onImageLoadFinish(loadedSuccessfully: boolean, photoId: string): void {
        this.uploadedImagesCounter --

        if(!loadedSuccessfully) this.notLoadedImagesIds.push(photoId)

        if(this.uploadedImagesCounter === 0) {
            this.onAllImagesUploadFinish(photoId)
        }
    }

    private onAllImagesUploadFinish(photoId: string): void {
        if(this.notLoadedImagesIds.length > 0) {
            this.sendBackNotUploadedImages()

            return
        }

        this.sendMessage(ReplyMsgCollection.getInstance().getSavePhotoCmdReply('photos_finished_load'));
    }

    private async sendBackNotUploadedImages(): Promise<void> {
        const notLoadedImagesConfigs: InputMediaPhoto[]= []

        this.notLoadedImagesIds.forEach(imageId => {
            notLoadedImagesConfigs.push({type: 'photo', media: imageId})
        })

        this.notLoadedImagesIds = []

        await this.sendMessage(ReplyMsgCollection.getInstance().getSavePhotoCmdReply('some_photos_not_loaded'))
        this.tg.sendMediaGroup(this.id, notLoadedImagesConfigs)
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
