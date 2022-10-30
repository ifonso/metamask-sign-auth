import streamService from "../services/StreamService.js";

class Controller {
  constructor() {
    this.fileStreamService = new streamService();
  }

  // (file name) -> Return file type & redable stream
  async getFileStream(filename) {
    return this.fileStreamService.getFileStream(filename)
  }
}

export default Controller;