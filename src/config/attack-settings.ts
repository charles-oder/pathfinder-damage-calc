import AppStorage from "@/storage";

export default class AttackSettings {
  color = "#CCC";
  name = "Attack";
  attacks = "0";
  attackBonus = "0";
  critConfirmBonus = "0";
  damage = "0";
  critThreshold = "20";
  critBonusDamage = "0";
  mods = "";
  damageReduction = "0";

  constructor(storage: AppStorage | null = new AppStorage()) {
    this.attacks = storage?.attacks ?? "";
    this.damage = storage?.damage ?? "0";
    this.attackBonus = storage?.attackBonus ?? "0";
    this.critConfirmBonus = storage?.critConfirmBonus ?? "0";
    this.critThreshold = storage?.critThreshold ?? "20";
    this.critBonusDamage = storage?.critBonusDamage ?? "0";
    this.mods = storage?.mods ?? "";
    this.damageReduction = storage?.damageReduction ?? "0";
  }

  save(storage: AppStorage | null = new AppStorage()) {
    if (storage) {
      storage.attacks = this.attacks;
      storage.attackBonus = this.attackBonus;
      storage.critConfirmBonus = this.critConfirmBonus;
      storage.damage = this.damage;
      storage.critThreshold = this.critThreshold;
      storage.critBonusDamage = this.critBonusDamage;
      storage.mods = this.mods;
      storage.damageReduction = this.damageReduction;
    }
  }
}
