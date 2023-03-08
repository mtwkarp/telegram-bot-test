import DriveService from '../services/DriveService';
import {Readable, Transform} from 'stream';
import https from 'https';
import DateHelper from "../../helpers/DateHelper";

export default class PhotosSaverDrive extends DriveService {
    constructor() {
        super();
    }

    async savePhotoFromURL(url: string, pathname: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            https.request(url, (response) => {
                const data = new Transform();

                response.on('data', (chunk) => {
                    data.push(chunk);
                });

                response.on('end', async() => {
                    const result = await this.savePhotoToDriveFolder(Readable.from(data.read()), {name: pathname});
                    resolve(result);
                });

            }).end();
        });
    }

    private async getCurrentMontFolderId(): Promise<string> {
        const query = `mimeType='application/vnd.google-apps.folder' and '${process.env.PHOTOS_DRIVE_FOLDER_ID}' in parents and name='${this.currentMonthFolderName}'`
        const files = await this.drive.files.list({
            spaces: 'drive',
            q: query
        })

        let id: string = ''

        if(files.data.files?.length === 1) {
            id = files.data.files[0].id as string
        }else if(files.data.files?.length === 0) {
            id = await this.createCurrentMonthFolder()
        }

        return id
    }

    private async createCurrentMonthFolder(): Promise<string> {
        const fileMetadata = {
            name: this.currentMonthFolderName,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [process.env.PHOTOS_DRIVE_FOLDER_ID as string]
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
            console.warn('Can`t create folder', err)
        }

        return ''
    }

    private get currentMonthFolderName(): string {
        const date = new Date()
        const month = DateHelper.getMonthNames()[date.getMonth()]
        const fullYear = date.getFullYear()

        return `${month} ${fullYear}`
    }
    async savePhotoToDriveFolder(buffer: Readable, options: {name: string}): Promise<boolean> {
        const folderId = await this.getCurrentMontFolderId()
            try {
                await this.drive.files.create({
                    // @ts-ignore
                    uploadType: 'media',
                    requestBody: {
                        name: options.name,
                        parents: [folderId]
                    },
                    media: {
                        body: buffer
                    }
                });

                console.log('Photo saved successfully');
                return true;
            }catch(err) {
                console.warn('Can\'t save photos', err);

                return false;
            }
    }
}