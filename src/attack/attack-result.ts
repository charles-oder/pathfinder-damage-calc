export class SingleAttackResult {

    readonly targetAc: number;
    readonly isHit: boolean;
    readonly isCrit: boolean;
    readonly baseDamage: number;
    readonly totalDamage: number;

    constructor(targetAc: number, isHit: boolean, isCrit: boolean, baseDamage: number, totalDamage: number) {
        this.targetAc = targetAc;
        this.isHit = isHit;
        this.isCrit = isCrit;
        this.baseDamage = baseDamage;
        this.totalDamage = totalDamage;
    }
}

export class FullAttackResult {

    targetAc = 0;
    totalAttacks = 0;
    totalHits = 0;
    totalCrits = 0;
    totalBaseDamage = 0;
    totalDamage = 0;

    addResult(result: SingleAttackResult) {
        this.targetAc = result.targetAc;
        this.totalAttacks++;
        this.totalHits += result.isHit ? 1 : 0;
        this.totalCrits += result.isCrit ? 1 : 0;
        this.totalBaseDamage += result.baseDamage;
        this.totalDamage += result.totalDamage;
    }

    merge(results: FullAttackResult) {
        this.targetAc = results.targetAc;
        this.totalAttacks += results.totalAttacks;
        this.totalHits += results.totalHits;
        this.totalCrits += results.totalCrits;
        this.totalBaseDamage += results.totalBaseDamage;
        this.totalDamage += results.totalDamage;
    }

}

export class FullAttackResultSet {

    results: Array<Array<FullAttackResult>> = []
    colors: Array<string> = []

    addResult(index: number, attackSet: number, result: FullAttackResult) {
        if (this.results.length < index + 1) {
            this.results.push([]);
        }
        if (this.results[index].length < attackSet + 1) {
            this.results[index].push(new FullAttackResult());
        }
        this.results[index][attackSet].merge(result);
    }

    reset() {
        this.results = []
    }

}