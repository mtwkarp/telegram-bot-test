const GoogleService = require("./GoogleServiceInterface.js");

class DriveService extends GoogleService {
  constructor(authenticationObj) {
    super(authenticationObj);
  }
}

module.exports = DriveService;
