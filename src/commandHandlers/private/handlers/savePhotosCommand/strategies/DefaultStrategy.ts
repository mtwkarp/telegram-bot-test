import AbstractPhotosLoaderStrategy from './AbstractPhotosLoaderStrategy';
import {IPrivateContextDecorator} from '../../../../../tglib/tgTypes/contextDecoratorTypes';


export default class DefaultStrategy extends AbstractPhotosLoaderStrategy {
    constructor(userId: number, folderId: string) {
        super(userId, folderId);
    }

    public override async onPhoto(contextDecorator: IPrivateContextDecorator): Promise<void> {
        this.sendMessage('Виберіть яким чином ви хочете зберігти фото.');
    }

    public override onDocument(contextDecorator: IPrivateContextDecorator) {
        this.sendMessage('Виберіть яким чином ви хочете зберігти фото.');
    }
}
