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

    processMod(mod: string, attack: number, hit: number, isCrit: boolean): number {
        const commandList = mod.split(';');
        for (let i = 0; i < commandList.length; i++) {
            const command = commandList[i];
            const components = command.split(':');
            let comparisonValue = 0;
            if (components.length < 1) {
                break;
            }
            if (components[0].includes('hit')) {
                comparisonValue = hit;
            } else if (components[0].includes('attack')) {
                comparisonValue = attack;
            }
            if (this.modConditionIsTrue(command, comparisonValue)) {
                if (components.length < 2) {
                    return 0;
                }
                return this.dieRoller.rollDieString(components[1]);
            }
        }
        return 0;
    }

    modConditionIsTrue(mod: string, compValue: number): boolean {
        if (mod.includes('< ')) {
            const value = parseInt(mod.split('<')[1]);
            return compValue < value;
        } else if(mod.includes('<= ')) {
            const value = parseInt(mod.split('<=')[1]);
            return compValue <= value;
        } else if(mod.includes('= ')) {
            const value = parseInt(mod.split('=')[1]);
            return compValue == value;
        } else if(mod.includes('>= ')) {
            const value = parseInt(mod.split('>=')[1]);
            return compValue >= value;
        } else if(mod.includes('> ')) {
            const value = parseInt(mod.split('>')[1]);
            return compValue > value;
        }
        return false
}

    resolveFullAttack(targetAc: number, attackBonuses: string, critThreshold: number, critBonusDamage: string, 
                      damage: string, dr: number, damageMod: string): FullAttackResult {
        const result = new FullAttackResult();
        const attacks = this.getAttacksFromString(attackBonuses);
        let resolvedAttacks = 0;
        let hits = 0;
        attacks.forEach(attack => {
            const attackResult = this.resolveSingleAttack(targetAc, attack, critThreshold, critBonusDamage, damage, 
                dr, resolvedAttacks, hits, damageMod);
            result.addResult(attackResult);
            resolvedAttacks++;
            if (attackResult.isHit) {
                hits++;
            }
        });
        return result;
    }

    resolveSingleAttack(targetAc: number, bonusToHit: number, critThreshold: number, critBonusDamage: string, 
                        damage: string, dr: number, resolvedAttacks: number, hits: number, damageMod: string): SingleAttackResult {
        const naturalRoll = this.dieRoller.rollDieString('1d20');
        Logger.log('naturalRoll: ' + naturalRoll);
        if (naturalRoll == 1) {
            return new SingleAttackResult(targetAc, false, false, 0, 0, 0, 0);
        }
        const modifiedRoll = naturalRoll + bonusToHit;
        Logger.log('modifiedRoll: ' + modifiedRoll);
        const isHit = modifiedRoll >= targetAc || naturalRoll == 20;
        let baseDamage = 0;
        let critDamage = 0;
        let modDamage = 0;
        let isCrit = false;

        Logger.log('isHit: ' + isHit);
        if (isHit) {
            const critThreat = naturalRoll >= critThreshold;
            baseDamage = this.dieRoller.rollDieString(damage);
            if (critThreat) {
                Logger.log('critical threat');
                const confirmRoll = this.dieRoller.rollDieString('1d20');
                Logger.log('confirm roll: ' + confirmRoll);
                const modifiedConfirm = confirmRoll + bonusToHit;
                Logger.log('modifiedConfirm roll: ' + modifiedConfirm);
                isCrit = modifiedConfirm >= targetAc;
                Logger.log('isCrit: ' + isCrit);
                if (isCrit) {
                    critDamage = this.dieRoller.rollDieString(critBonusDamage)
                }
            }
            modDamage = this.processMod(damageMod, resolvedAttacks + 1, hits + 1, isCrit);
        }
        Logger.log('Base Damage: ' + baseDamage);
        Logger.log('Mod Damage: ' + modDamage);
        Logger.log('Crit Damage: ' + critDamage);
        const totalDamage = Math.max(baseDamage + modDamage + critDamage - dr, 0);
        Logger.log('totalDamage: ' + totalDamage);
        return new SingleAttackResult(targetAc, isHit, isCrit, baseDamage, modDamage, critDamage, totalDamage);
    }

}