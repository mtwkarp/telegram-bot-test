import DriveService from '../services/DriveService';
import {Readable} from 'stream';

export default class PhotosSaverDrive extends DriveService {
    constructor() {
        super();
    }

    async savePhoto(buffer: Readable) {

            // const media = {
            //     mimeType: 'image/jpeg',
            //     name: 'ddddd',
            //     body: fs.createReadStream(buffer),
            //     parents: ['1J6u-SBx3WpG61_71kOYNX1glFKWCVSAk']
            // }
            //
            // const fileMetadata = {
            //     name: 'photo.jpg',
            // };

            this.drive.files.create({
                // @ts-ignore
                // resource: fileMetadata,
                // fields: 'id, name',
                // media

                uploadType: 'media',
                requestBody: {
                    name: 'somephoto.jpg',
                    parents: ['1J6u-SBx3WpG61_71kOYNX1glFKWCVSAk']
                },
                media: {
                    body: buffer
                }
            }).then((e) => console.log('photo uploaded', e))
                .catch(err => console.log(err));

    }
}