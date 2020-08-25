import AppStorage from '@/storage'

export default class AttackSettings {

    color = '#CCC'
    name = 'Attack'
    attacks = '';
    damage = '';
    critThreshold = '20';
    critBonusDamage = '';
    mods = '';
    damageReduction = '';

    constructor(storage: AppStorage | null = new AppStorage()) {
        this.attacks = storage?.attacks ?? '';
        this.damage = storage?.damage ?? '';
        this.critThreshold = storage?.critThreshold ?? '20';
        this.critBonusDamage = storage?.critBonusDamage ?? '';
        this.mods = storage?.mods ?? '';
        this.damageReduction = storage?.damageReduction ?? '0';
    }

    save(storage: AppStorage | null = new AppStorage()) {
        if (storage) {
            storage.attacks = this.attacks;
            storage.damage = this.damage;
            storage.critThreshold = this.critThreshold;
            storage.critBonusDamage = this.critBonusDamage;
            storage.mods = this.mods;
            storage.damageReduction = this.damageReduction;
        }
    }
}