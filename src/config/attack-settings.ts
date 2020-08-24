import AppStorage from '@/storage'

export default class AttackSettings {

    color = '#CCC'
    name = 'Attack'
    attacks = '';
    damage = '';
    critThreshold = '';
    critBonusDamage = '';
    mods = '';
    damageReduction = '';

    constructor() {
        const storage = new AppStorage();
        this.attacks = storage.attacks;
        this.damage = storage.damage;
        this.critThreshold = storage.critThreshold;
        this.critBonusDamage = storage.critBonusDamage;
        this.mods = storage.mods;
        this.damageReduction = storage.damageReduction;
    }

    save() {
        const storage = new AppStorage();
        storage.attacks = this.attacks;
        storage.damage = this.damage;
        storage.critThreshold = this.critThreshold;
        storage.critBonusDamage = this.critBonusDamage;
        storage.mods = this.mods;
        storage.damageReduction = this.damageReduction;

    }
}