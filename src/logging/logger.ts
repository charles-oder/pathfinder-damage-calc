export default class Logger {

    static logMock = 0;
    static logDebug = 0;
    static logError = 1;
    

    static mock(data: string) {
        if (this.logMock) {
            console.log('MOCK: ' + data)
        }
    }

    static log(data: string) {
        if (this.logDebug) {
            console.log('DEBUG: ' + data)
        }
    }

    static error(data: string) {
        if (this.logError) {
            console.error('ERROR: ' +data)
        }
    }
}