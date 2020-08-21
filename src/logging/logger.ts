export default class Logger {

    static logDebug = false;
    static logError = true;
    

    static log(data: any) {
        if (this.logDebug) {
            console.log('DEBUG: ' + data)
        }
    }

    static error(data: any) {
        if (this.logError) {
            console.error('ERROR: ' +data)
        }
    }
}