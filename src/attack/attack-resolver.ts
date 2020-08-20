import MultiDieRoller from '@/dice/multi-die-roller';
import Logger from '@/logging/logger';
import { SingleAttackResult, FullAttackResult } from './attack-result';

export default class AttackResolver {

    private dieRoller: MultiDieRoller;

    constructor(dieRoller: MultiDieRoller = new MultiDieRoller()) {
        this.dieRoller = dieRoller;
    }

    private getAttacksFromString(str: string): number[] {
        const attacks: number[] = [];
        const attackStrings = str.split('/');
        attackStrings.forEach(str => { attacks.push(parseInt(str)) });
        console.log('attacks: ' + JSON.stringify(attacks));
        return attacks;
    }

    jabbingStyleMod(attack: number, hit: number, roller: MultiDieRoller): () => number {
        if (hit > 1) {
            return () => { 
                Logger.log('Hit at least once already, bonus 1d6');
                return roller.rollDieString('1d6') 
            }
        }
        return () => { 
            Logger.log('First hit, no bonus');
            return 0 
        }
    }

    jabbingMasterMod(attack: number, hit: number, roller: MultiDieRoller): () => number {
        if (hit > 2) {
            return () => { 
                Logger.log('Hit at least twice already, bonus 4d6');
                return roller.rollDieString('4d6') 
            }
        }
        if (hit > 1) {
            return () => { 
                Logger.log('Hit at least once already, bonus 2d6');
                return roller.rollDieString('2d6') 
            }
        }
        return () => { 
            Logger.log('First hit, no bonus');
            return 0 
        }
    }

    resolveFullAttack(targetAc: number, attackBonuses: string, critThreshold: number, critMult: number, 
                      damage: string, damageMod: ((attack: number, hit: number, roller: MultiDieRoller) => () => number) | null = null): FullAttackResult {
        const result = new FullAttackResult();
        const attacks = this.getAttacksFromString(attackBonuses);
        attacks.forEach(attack => {
            let attackMod: (() => number) | null = null;
            if (damageMod) {
                attackMod = damageMod(result.totalAttacks() + 1, result.totalHits() + 1, this.dieRoller)
            }
            const attackResult = this.resolveSingleAttack(targetAc, attack, critThreshold, critMult, damage, attackMod)
            result.addResult(attackResult);
        });
        return result;
    }

    resolveSingleAttack(targetAc: number, bonusToHit: number, critThreshold: number, critMult: number, 
                        damage: string, damageMod: (() => number) | null = null): SingleAttackResult {
        const naturalRoll = this.dieRoller.rollDieString('1d20');
        Logger.log('naturalRoll: ' + naturalRoll);
        if (naturalRoll == 1) {
            return new SingleAttackResult(false, false, 0, 0);
        }
        const modifiedRoll = naturalRoll + bonusToHit;
        Logger.log('modifiedRoll: ' + modifiedRoll);
        const isHit = modifiedRoll >= targetAc || naturalRoll == 20;

        Logger.log('isHit: ' + isHit);
        if (isHit) {
            const critThreat = naturalRoll >= critThreshold;
            let baseDamage = this.dieRoller.rollDieString(damage);
            if (damageMod) {
                const modDamage = damageMod();
                Logger.log('Mod Damage: ' + modDamage);
                baseDamage += modDamage;
            }
            if (critThreat) {
                Logger.log('critical threat');
                const confirmRoll = this.dieRoller.rollDieString('1d20');
                Logger.log('confirm roll' + confirmRoll);
                const modifiedConfirm = confirmRoll + bonusToHit;
                Logger.log('confirm roll' + confirmRoll);
                const isCrit = modifiedConfirm >= targetAc;
                Logger.log('isCrit: ' + isCrit);
                if (isCrit) {
                    return new SingleAttackResult(isHit, isCrit, baseDamage, baseDamage * critMult);
                }
            }
            return new SingleAttackResult(isHit, false, baseDamage, baseDamage);
        }

        return new SingleAttackResult(false, false, 0, 0);
    }

}