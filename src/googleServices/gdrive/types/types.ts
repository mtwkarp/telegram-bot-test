import {Readable} from 'stream';

export type PhotoFromUrlParams = {
    url: string,
    name: string,
    folderId: string,
    photoId: string
}

export type PhotoFromUrlNoFolder = Omit<PhotoFromUrlParams, 'folderId'>

export type SavePhotoToDriveParams = {
    buffer: Readable,
    name: string,
    folderId: string
}
