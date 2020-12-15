export default class AboutViewModel {
  versionNumber() {
    const version = process.env.VUE_APP_VERSION;
    return version;
  }
}
