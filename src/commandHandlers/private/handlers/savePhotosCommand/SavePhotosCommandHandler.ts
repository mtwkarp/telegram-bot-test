import PrivateCmdHandler from '../../PrivateCmdHandler';
import ReplyMsgCollection from '../../../../db/firestore/collectionManagers/implementations/ReplyMsgCollection';
import { CMD_NAMES } from '../../../../types/enums';
import {IPrivateContextDecorator} from '../../../../tglib/tgTypes/contextDecoratorTypes';
import {IPrivatePhotoPayload} from '../../../../tglib/tgTypes/messagePayload/contextPayloadTypes';
import PhotosSaverDrive from '../../../../googleServices/gdrive/PhotosSaverDrive';
import {clear} from "google-auth-library/build/src/auth/envDetect";
export default class SavePhotosCommandHandler extends PrivateCmdHandler {

    private drivePhotosSaver: PhotosSaverDrive;
    // private imagesLoadFinished: boolean
    private imageLoadedResponseTimer: ReturnType<typeof setTimeout>
    private allowResponseOnDocumentLoad: boolean
    constructor(userId: number) {
        super(userId, CMD_NAMES.SAVE_PHOTO);

        // this.imagesLoadFinished = true
        this.allowResponseOnDocumentLoad = true

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
        // @ts-ignore
        const file = await this.tg.getFile(payload.photo.pop().file_id);
        const fileLink = await this.tg.getFileLink(file.file_id);

        this.restartTimerOnImageLoad()

        this.drivePhotosSaver.savePhotoFromURL(fileLink.href, fileLink.pathname)
    }

    private restartTimerOnImageLoad() {
        if(this.imageLoadedResponseTimer) {
            clearTimeout(this.imageLoadedResponseTimer)
        }

        this.imageLoadedResponseTimer = setTimeout(() => {
            this.sendMessage(ReplyMsgCollection.getInstance().getSavePhotoCmdReply('photos_finished_load'))
        }, 3000)
    }

    protected override onDocument(contextDecorator: IPrivateContextDecorator) {
        if(this.allowResponseOnDocumentLoad) {
            this.sendMessage(ReplyMsgCollection.getInstance().getSavePhotoCmdReply('document_load_reply'))

            this.allowResponseOnDocumentLoad = false

            setTimeout(() => {
                this.allowResponseOnDocumentLoad = true
            }, 10000)
        }
    }
}
