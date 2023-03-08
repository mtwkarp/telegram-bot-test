import DriveService from '../services/DriveService';
import {Readable, Transform} from 'stream';
import https from "https";

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

                response.on('end', async () => {
                    const result = await this.savePhotoToDriveFolder(Readable.from(data.read()), {name: pathname});
                    resolve(result)
                });

            }).end();
        })
    }

    async savePhotoToDriveFolder(buffer: Readable, options: {name: string}): Promise<boolean> {
            try {
                await this.drive.files.create({
                    // @ts-ignore
                    uploadType: 'media',
                    requestBody: {
                        name: options.name,
                        parents: [process.env.PHOTOS_DRIVE_FOLDER_ID as string]
                    },
                    media: {
                        body: buffer
                    }
                })

                console.log("Photo saved successfully")
                return true
            }catch(err) {
                console.warn("Can't save photos", err)

                return false
            }
    }
}