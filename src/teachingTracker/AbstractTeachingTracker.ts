import {format} from "ts-date";
import DriveService from "../googleServices/services/DriveService";
import TeachingTrackingDrive from "../googleServices/gdrive/TeachingTrackingDrive";

export default class AbstractTeachingTracker {
    protected name: string
    protected driveService: TeachingTrackingDrive
    constructor() {
        this.name = 'Центр звітність '
        this.driveService= new TeachingTrackingDrive(this.name)
        console.log(this.driveService.getCurrentMonthSheetId())
    }


}