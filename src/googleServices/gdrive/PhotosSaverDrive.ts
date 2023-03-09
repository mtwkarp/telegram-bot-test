import DriveService from '../services/DriveService';
import {Readable, Transform} from 'stream';
import https from 'https';
import {PhotoFromUrlParams, SavePhotoToDriveParams} from './types/types';

export default class PhotosSaverDrive extends DriveService {
    constructor() {
        super();
    }

    async savePhotoFromURL(params: PhotoFromUrlParams): Promise<boolean> {
        return new Promise((resolve, reject) => {
            https.request(params.url, (response) => {
                const data = new Transform();

                response.on('data', (chunk) => {
                    data.push(chunk);
                });

                response.on('end', async() => {
                    const buffer = Readable.from(data.read());
                    const result = await this.savePhotoToDriveFolder({buffer, name: params.name, folderId: params.folderId});
                    resolve(result);
                });

            }).end();
        });
    }


    async savePhotoToDriveFolder(params: SavePhotoToDriveParams): Promise<boolean> {
            try {
                await this.drive.files.create({
                    // @ts-ignore
                    uploadType: 'media',
                    requestBody: {
                        name: params.name,
                        parents: [params.folderId]
                    },
                    media: {
                        body: params.buffer
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