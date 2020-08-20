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

    private resultArray = new Array<SingleAttackResult>();

    addResult(result: SingleAttackResult) {
        this.resultArray.push(result);
    }

    totalAttacks(): number {
        return this.resultArray.length;
    }

    totalHits(): number {
        const hitList: number[] = this.resultArray.map((e) => { return e.isHit ? 1 : 0 })
        return hitList.reduce((acc, value) => { return acc + value }, 0);
    }

    totalCrits(): number {
        const critList: number[] = this.resultArray.map((e) => { return e.isCrit ? 1 : 0 })
        return critList.reduce((acc, value) => { return acc + value }, 0);
    }

    totalBaseDamage(): number {
        const damageList: number[] = this.resultArray.map((e) => { return e.baseDamage })
        return damageList.reduce((acc, value) => { return acc + value }, 0);
    }

    totalDamage(): number {
        const damageList: number[] = this.resultArray.map((e) => { return e.totalDamage })
        return damageList.reduce((acc, value) => { return acc + value }, 0);
    }
}