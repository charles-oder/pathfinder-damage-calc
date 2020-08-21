export class SingleAttackResult {

    readonly isHit: boolean;
    readonly isCrit: boolean;
    readonly baseDamage: number;
    readonly totalDamage: number;

    constructor(isHit: boolean, isCrit: boolean, baseDamage: number, totalDamage: number) {
        this.isHit = isHit;
        this.isCrit = isCrit;
        this.baseDamage = baseDamage;
        this.totalDamage = totalDamage;
    }
}

export class FullAttackResult {

    totalAttacks = 0;
    totalHits = 0;
    totalCrits = 0;
    totalBaseDamage = 0;
    totalDamage = 0;

    addResult(result: SingleAttackResult) {
        this.totalAttacks++;
        this.totalHits += result.isHit ? 1 : 0;
        this.totalCrits += result.isCrit ? 1 : 0;
        this.totalBaseDamage += result.baseDamage;
        this.totalDamage += result.totalDamage;
    }

    merge(results: FullAttackResult) {
        this.totalAttacks += results.totalAttacks;
        this.totalHits += results.totalHits;
        this.totalCrits += results.totalCrits;
        this.totalBaseDamage += results.totalBaseDamage;
        this.totalDamage += results.totalDamage;
    }

}

export class FullAttackResultSet {

    base: Array<FullAttackResult> = []
    baseColor = '#DDD'
    comp: Array<FullAttackResult> = []
    compColor = '#BBB'

}