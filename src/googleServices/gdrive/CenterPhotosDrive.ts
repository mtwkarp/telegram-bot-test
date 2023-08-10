import PhotosSaverDrive from './PhotosSaverDrive';
import DateHelper from '../../helpers/DateHelper';
import {PhotoFromUrlNoFolder} from './types/types';
import {format} from 'ts-date';


export default class CenterPhotosDrive extends PhotosSaverDrive {

    private existingFolderNames: string[];
    private folderCreationPromise: Promise<string> | null;
    private readonly folderId: string;
    constructor(folderId: string) {
        super();
        this.folderCreationPromise = null;
        this.existingFolderNames = [];
        this.folderId = folderId;
    }

    private checkCurrentMonthFolderExistenceLocal(): boolean {
        return this.existingFolderNames.includes(this.currentMonthFolderName);
    }

    private async saveImageImmediatelyToDriveFolder(params: PhotoFromUrlNoFolder): Promise<boolean> {
        const folderId = await this.getCurrentDayFolderId();
        return super.savePhotoFromURL({url: params.url, name: params.name, folderId, photoId: params.photoId});
    }

    private async createDriveFolderAndSaveImage(params: PhotoFromUrlNoFolder): Promise<boolean> {
        if(this.folderCreationPromise === null) {
            this.folderCreationPromise = this.getCurrentDayFolderId();
            this.folderCreationPromise.then(() => {
                this.folderCreationPromise = null;
            });
        }

        return new Promise(async(resolve) => {
            if(this.folderCreationPromise === null) {
                resolve(false);

                return;
            }
            const folderId = await this.folderCreationPromise;
            const result = await super.savePhotoFromURL({url: params.url, name: params.name, folderId, photoId: params.photoId});

            resolve(result);
        });
    }

    savePhotoFromUrlToCurrentDayFolder(params: PhotoFromUrlNoFolder, onCompleteCallback: (result: boolean, photoId: string) => void): void {
        // if(this.checkCurrentMonthFolderExistenceLocal()) {
        //    return this.saveImageImmediatelyToDriveFolder(params);
        // }

        const loadCallback = async () => {
            return this.createDriveFolderAndSaveImage(params)
                .then(result => onCompleteCallback(result, params.photoId));
        }

        this.loadPhoto(loadCallback, onCompleteCallback)
    }
    private async getCurrentMonthFolderId(): Promise<string> {
        const query = `mimeType='application/vnd.google-apps.folder' and '${this.folderId}' in parents and name='${this.currentMonthFolderName}'`;
        const files = await this.drive.files.list({
            spaces: 'drive',
            q: query
        });

        let id = '';

        if(files.data.files?.length === 1) {
            id = files.data.files[0].id as string;
        }else if(files.data.files?.length === 0) {
            id = await this.createCurrentMonthFolder();
        }

        // if(!this.existingFolderNames.includes(this.currentMonthFolderName)) this.existingFolderNames.push(this.currentMonthFolderName)

        return id;
    }

    public savePhotoFromURLToSpecificDate(params: PhotoFromUrlNoFolder, date: string, onCompleteCallback: (result: boolean, photoId: string) => void) {
        const loadCallback = async (): Promise<boolean | void> => {
            const month = DateHelper.getMonthNames()[Number(date.split('.')[1]) - 1];
            const fullYear = new Date().getFullYear();
            const monthFolderName = `${month} ${fullYear}`;

            let monthFolderId = await this.getFolderId(this.folderId as string, monthFolderName);
            if (!monthFolderId) {
                monthFolderId = await this.createPhotoStorageFolder(monthFolderName, this.folderId as string);
            }

            let dayFolderId = await this.getFolderId(monthFolderId, date);

            if (!dayFolderId) {
                dayFolderId = await this.createPhotoStorageFolder(date, monthFolderId);
            }

            return super.savePhotoFromURL({url: params.url, name: params.name, folderId: dayFolderId, photoId: params.photoId})
                .then((result) => {
                    onCompleteCallback(result, params.photoId)
                });
        }

        this.loadPhoto(loadCallback, onCompleteCallback)
    }

    private loadPhoto(loadCallback: () => Promise<boolean | void>, onCompleteCallback: (result: boolean, photoId: string) => void) {

        if(!CenterPhotosDrive.queue.length) {
            CenterPhotosDrive.queue.push({loadCallback, onCompleteCallback})
            this.startLoad()
        }else {
            CenterPhotosDrive.queue.push({loadCallback, onCompleteCallback})
        }
    }

    private startLoad() {
        if(CenterPhotosDrive.queue[0]) {
            const {loadCallback} = CenterPhotosDrive.queue[0];


                loadCallback()
                    .then(() => {
                        CenterPhotosDrive.queue.splice(0,1);
                         this.startLoad();
                    })
                    .catch(() => {
                        CenterPhotosDrive.queue.splice(0,1);

                    })


        }
    }

    private async getFolderId(folderParent: string, folderName: string): Promise<string> {
        const query = `mimeType='application/vnd.google-apps.folder' and '${folderParent}' in parents and name='${folderName}'`;
        const files = await this.drive.files.list({
            spaces: 'drive',
            q: query
        });
        let id = '';
// @ts-ignore
        if(files.data.files?.length > 0) {
            // @ts-ignore
            id = files.data.files[0].id as string;
        }

        return id;
    }

    private async getCurrentDayFolderId(): Promise<string> {
        const currentMonthFolderId = await this.getCurrentMonthFolderId();
        const query = `mimeType='application/vnd.google-apps.folder' and '${currentMonthFolderId}' in parents and name='${this.currentDayFolderName}'`;
        const files = await this.drive.files.list({
            spaces: 'drive',
            q: query
        });

        let id = '';
        // @ts-ignore

        if(files.data.files?.length > 0) {
            // @ts-ignore
            id = files.data.files[0].id as string;
        }else if(files.data.files?.length === 0) {
            id = await this.createCurrentDayFolder();
        }

        // if(!this.existingFolderNames.includes(this.currentMonthFolderName)) this.existingFolderNames.push(this.currentMonthFolderName)

        return id;
    }

    private async createPhotoStorageFolder(folderName: string, folderParentId: string): Promise<string> {
        const fileMetadata = {
            name: folderName,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [folderParentId]
        };

        try {
            const file = await this.drive.files.create({
                // @ts-ignore
                resource: fileMetadata,
                fields: 'id',
            });
            // @ts-ignore
            return file.data.id;
        } catch (err) {
            console.warn('Can`t create folder', err);
        }

        return '';
    }

    private async createCurrentDayFolder(): Promise<string> {
       return await this.createPhotoStorageFolder(this.currentDayFolderName, await this.getCurrentMonthFolderId());
    }

    private async createCurrentMonthFolder(): Promise<string> {
        const fileMetadata = {
            name: this.currentMonthFolderName,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [this.folderId]
        };

        try {
            const file = await this.drive.files.create({
                // @ts-ignore
                resource: fileMetadata,
                fields: 'id',
            });
            // @ts-ignore
            return file.data.id;
        } catch (err) {
            console.warn('Can`t create folder', err);
        }

        return '';
    }
    private get currentDayFolderName(): string {
        return `${format(new Date(), 'DD.MM')}`;
    }
    private get currentMonthFolderName(): string {
        const date = new Date();
        const month = DateHelper.getMonthNames()[date.getMonth()];
        const fullYear = date.getFullYear();

        return `${month} ${fullYear}`;
    }

    protected static queue: {loadCallback: () => Promise<boolean | void>, onCompleteCallback: (result: boolean, photoId: string) => void}[] = []
}
