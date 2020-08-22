import AppStorage from '@/storage'

export default class AttackSettings {

    color = '#CCC'
    name = 'Attack'
    attacks = '';
    damage = '';
    critThreshold = '';
    critMultiplier = '';
    mods = '';

    constructor() {
        const storage = new AppStorage();
        this.attacks = storage.attacks;
        this.damage = storage.damage;
        this.critThreshold = storage.critThreshold;
        this.critMultiplier = storage.critMultiplier;
        this.mods = storage.mods;
    }

    save() {
        const storage = new AppStorage();
        storage.attacks = this.attacks;
        storage.damage = this.damage;
        storage.critThreshold = this.critThreshold;
        storage.critMultiplier = this.critMultiplier;
        storage.mods = this.mods;

    }
}