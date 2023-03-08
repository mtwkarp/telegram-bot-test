import PrivateCmdHandler from '../../PrivateCmdHandler';
import ReplyMsgCollection from '../../../../db/firestore/collectionManagers/implementations/ReplyMsgCollection';
import { CMD_NAMES } from '../../../../types/enums';
import {IPrivateContextDecorator} from '../../../../tglib/tgTypes/contextDecoratorTypes';
import {IPrivatePhotoPayload} from '../../../../tglib/tgTypes/messagePayload/contextPayloadTypes';
import PhotosSaverDrive from '../../../../googleServices/gdrive/PhotosSaverDrive';
import https from 'https';
import { Readable, Transform} from 'stream';
export default class SavePhotosCommandHandler extends PrivateCmdHandler {

    private drivePhotosSaver: PhotosSaverDrive;
    constructor(userId: number) {
        super(userId, CMD_NAMES.SAVE_PHOTO);
        this.drivePhotosSaver = new PhotosSaverDrive();
    }

    copy() {
        return new SavePhotosCommandHandler(this.id);
    }

    onCommand() {
        const reply = ReplyMsgCollection.getInstance().getValueFromDocument('save_photos', 'command_reply');

        this.sendMessage(reply); // this.sendMessage(this.id, FirebaseDB.getReplyMessage('commands', 'commands_description'));
    }

    protected override async onPhoto(contextDecorator: IPrivateContextDecorator): Promise<void> {
        const payload = contextDecorator.payload as IPrivatePhotoPayload;

        // @ts-ignore
        const file = await this.tg.getFile(payload.photo.pop().file_id);
        const fileLink = await this.tg.getFileLink(file.file_id);

        https.request(fileLink.href, (response) => {
            const data = new Transform();

            response.on('data', (chunk) => {
                data.push(chunk);
            });
            response.on('end', () => {
                this.drivePhotosSaver.savePhoto(Readable.from(data.read()));
            });

        }).end();
    }
}
