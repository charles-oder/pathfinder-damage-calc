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
        Logger.log('attacks: ' + JSON.stringify(attacks));
        return attacks;
    }

    static createModFromString(str: string): (attack: number, hit: number, roller: MultiDieRoller) => () => number {
        const commands = str.split(';');
        const mods: ((attack: number, hit: number, roller: MultiDieRoller) => number)[] = [];
        commands.forEach((command) => {
            mods.push(this.createCommand(command))
        });

        return (attack, hit, roller) => {
            return () => {
                let total = 0;
                for (let i = 0; i < mods.length; i++) {
                    total += mods[i](attack, hit, roller);
                    if (total > 0) {
                        return total;
                    }
                }
                return total;
            }
        }
    }

    static createCommand(str: string): ((attack: number, hit: number, roller: MultiDieRoller) => number) {
        const components = str.split(':');
        if (components.length < 2) {
            return (attack, hit, roller) => { return 0 }
        }
        const check = components[0];
        const damage = components[1];

        if (check.includes('attack')) {
            if (check.includes('< ')) {
                const value = parseInt(check.split('<')[1]);
                return (attack, hit, roller) => { return attack < value ? roller.rollDieString(damage) : 0 }
            } else if(check.includes('<= ')) {
                const value = parseInt(check.split('<=')[1]);
                return (attack, hit, roller) => { return attack <= value ? roller.rollDieString(damage) : 0 }
            } else if(check.includes('= ')) {
                const value = parseInt(check.split('=')[1]);
                return (attack, hit, roller) => { return attack == value ? roller.rollDieString(damage) : 0 }
            } else if(check.includes('>= ')) {
                const value = parseInt(check.split('>=')[1]);
                return (attack, hit, roller) => { return attack >= value ? roller.rollDieString(damage) : 0 }
            } else if(check.includes('> ')) {
                const value = parseInt(check.split('>')[1]);
                return (attack, hit, roller) => { return attack > value ? roller.rollDieString(damage) : 0 }
            }

        } else if (check.includes('hit')) {
            if (check.includes('< ')) {
                const value = parseInt(check.split('<')[1]);
                return (attack, hit, roller) => { return hit < value ? roller.rollDieString(damage) : 0 }
            } else if(check.includes('<= ')) {
                const value = parseInt(check.split('<=')[1]);
                return (attack, hit, roller) => { return hit <= value ? roller.rollDieString(damage) : 0 }
            } else if(check.includes('= ')) {
                const value = parseInt(check.split('=')[1]);
                return (attack, hit, roller) => { return hit == value ? roller.rollDieString(damage) : 0 }
            } else if(check.includes('>= ')) {
                const value = parseInt(check.split('>=')[1]);
                return (attack, hit, roller) => { return hit >= value ? roller.rollDieString(damage) : 0 }
            } else if(check.includes('> ')) {
                const value = parseInt(check.split('>')[1]);
                return (attack, hit, roller) => { return hit > value ? roller.rollDieString(damage) : 0 }
            }
        }
        return (attack, hit, roller) => { return 0 }
    }

    resolveFullAttack(targetAc: number, attackBonuses: string, critThreshold: number, critMult: number, 
                      damage: string, damageMod: ((attack: number, hit: number, roller: MultiDieRoller) => () => number) | null = null): FullAttackResult {
        const result = new FullAttackResult();
        const attacks = this.getAttacksFromString(attackBonuses);
        attacks.forEach(attack => {
            let attackMod: (() => number) | null = null;
            if (damageMod) {
                attackMod = damageMod(result.totalAttacks + 1, result.totalHits + 1, this.dieRoller)
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
            return new SingleAttackResult(targetAc, false, false, 0, 0);
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
                    return new SingleAttackResult(targetAc, isHit, isCrit, baseDamage, baseDamage * critMult);
                }
            }
            return new SingleAttackResult(targetAc, isHit, false, baseDamage, baseDamage);
        }

        return new SingleAttackResult(targetAc, false, false, 0, 0);
    }

}