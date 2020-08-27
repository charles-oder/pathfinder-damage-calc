import AppStorage from "@/storage";
export default class SimSettings {
  constructor() {
    const storage = new AppStorage();
    this.iterations = storage.iterations;
    this.acMin = storage.acMin;
    this.acMax = storage.acMax;
  }

  iterations = "";
  acMin = "";
  acMax = "";

  save() {
    const storage = new AppStorage();
    storage.iterations = this.iterations;
    storage.acMin = this.acMin;
    storage.acMax = this.acMax;
  }
}
