import api from "../api/api";

export abstract class BaseService {
  protected api: typeof api;

  constructor() {
    this.api = api;
  }
}
