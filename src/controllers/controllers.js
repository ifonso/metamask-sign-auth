import streamService from "../services/StreamService.js";

export default class Controller {
  constructor() {
    this.fileStreamService = new streamService();
  }

  async getFileStream(filename) {
    return this.fileStreamService.getFileStream(filename)
  }
}