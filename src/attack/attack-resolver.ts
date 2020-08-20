import MultiDieRoller from '@/dice/multi-die-roller';
import Logger from '@/logging/logger';

export default class AttackResolver {

    private dieRoller: MultiDieRoller;

    constructor(dieRoller: MultiDieRoller = new MultiDieRoller()) {
        this.dieRoller = dieRoller;
    }

    resolveSingleAttack(targetAc: number, bonusToHit: number, critThreshold: number, critMult: number, damage: string): number {
        const naturalRoll = this.dieRoller.rollDieString('1d20');
        Logger.log('naturalRoll: ' + naturalRoll);
        if (naturalRoll == 1) {
            return 0;
        }
        const modifiedRoll = naturalRoll + bonusToHit;
        Logger.log('modifiedRoll: ' + modifiedRoll);
        const isHit = modifiedRoll >= targetAc || naturalRoll == 20;

        Logger.log('isHit: ' + isHit);
        if (isHit) {
            const critThreat = naturalRoll >= critThreshold;
            const baseDamage = this.dieRoller.rollDieString(damage);
            if (critThreat) {
                Logger.log('critical threat');
                const confirmRoll = this.dieRoller.rollDieString('1d20');
                Logger.log('confirm roll' + confirmRoll);
                const modifiedConfirm = confirmRoll + bonusToHit;
                Logger.log('confirm roll' + confirmRoll);
                const isCrit = modifiedConfirm >= targetAc;
                Logger.log('isCrit: ' + isCrit);
                if (isCrit) {
                    return baseDamage * critMult;
                }
            }
            return baseDamage;
        }

        return 0
    }

}