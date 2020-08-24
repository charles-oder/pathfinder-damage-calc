export default class AppStorage {

    get iterations(): string {
        const value: string | undefined = localStorage['iterations']
        if (value) {
            return value;
        }
        return '100';
    }

    set iterations(newValue: string) {
        localStorage['iterations'] = newValue
    }

    get mods(): string {
        const value: string | undefined = localStorage['mods']
        if (value) {
            return value;
        }
        return '';
    }

    set mods(newValue: string) {
        localStorage['mods'] = newValue
    }

    get acMin(): string {
        const value: string | undefined = localStorage['acMin']
        if (value) {
            return value;
        }
        return '15';
    }

    set acMin(newValue: string) {
        localStorage['acMin'] = newValue
    }

    get acMax(): string {
        const value: string | undefined = localStorage['acMax']
        if (value) {
            return value;
        }
        return '40';
    }

    set acMax(newValue: string) {
        localStorage['acMax'] = newValue
    }

    get attacks(): string {
        const value: string | undefined = localStorage['attacks']
        if (value) {
            return value;
        }
        return '+0';
    }

    set attacks(newValue: string) {
        localStorage['attacks'] = newValue
    }

    get damage(): string {
        const value: string | undefined = localStorage['damage']
        if (value) {
            return value;
        }
        return '1d6';
    }

    set damage(newValue: string) {
        localStorage['damage'] = newValue
    }

    get critThreshold(): string {
        const value: string | undefined = localStorage['critThreshold']
        if (value) {
            return value;
        }
        return '20';
    }

    set critThreshold(newValue: string) {
        localStorage['critThreshold'] = newValue
    }

    get critBonusDamage(): string {
        const value: string | undefined = localStorage['critBonusDamage']
        if (value) {
            return value;
        }
        return '1d6';
    }

    set critBonusDamage(newValue: string) {
        localStorage['critBonusDamage'] = newValue
    }

    get jabbingStyle(): boolean {
        const value: boolean | undefined = localStorage['jabbingStyle']
        if (value) {
            return value;
        }
        return false;
    }

    set jabbingStyle(newValue: boolean) {
        localStorage['jabbingStyle'] = newValue
    }

    get jabbingMaster(): boolean {
        const value: boolean | undefined = localStorage['jabbingMaster']
        if (value) {
            return value;
        }
        return false;
    }

    set jabbingMaster(newValue: boolean) {
        localStorage['jabbingMaster'] = newValue
    }
}