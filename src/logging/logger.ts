export default class Logger {

    static logDebug = 0;
    static logError = 1;
    

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