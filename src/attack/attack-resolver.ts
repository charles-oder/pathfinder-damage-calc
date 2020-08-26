import MultiDieRoller from '@/dice/multi-die-roller'
import Logger from '@/logging/logger'
import { SingleAttackResult, FullAttackResult } from './attack-result'
import AttackSettings from '@/config/attack-settings'

export default class AttackResolver {

    private dieRoller: MultiDieRoller
    private settings: AttackSettings

    constructor(settings: AttackSettings, dieRoller: MultiDieRoller = new MultiDieRoller()) {
        this.settings = settings
        this.dieRoller = dieRoller
    }

    private getAttacksFromString(str: string): number[] {
        const attacks: number[] = []
        const attackStrings = str.split('/')
        attackStrings.forEach(str => { attacks.push(parseInt(str)) })
        Logger.log('attacks: ' + JSON.stringify(attacks))
        return attacks
    }

    processMod(mod: string, attack: number, hit: number, isCrit: boolean): number {
        Logger.log('processMod(mod: ' + mod + ', attack: ' + attack + ', hit: ' + hit + ', isCrit: ' + isCrit + ')')
        const commandList = mod.split(';')
        for (let i = 0; i < commandList.length; i++) {
            const command = commandList[i]
            const components = command.split(':')
            const condition = components[0] ?? ''
            const baseDamage = components[1] ?? '0'
            const critDamage = components[2] ?? '0'

            let comparisonValue = 0
            if (condition.includes('hit')) {
                comparisonValue = hit
            } else if (condition.includes('attack')) {
                comparisonValue = attack
            }
            if (this.modConditionIsTrue(command, comparisonValue)) {
                if (isCrit) {
                    return this.getDamageForComponent(critDamage)
                }
                return this.getDamageForComponent(baseDamage)
            }
        }
        return 0
    }

    getDamageForComponent(component: string | undefined): number {
        if (component) {
            return this.dieRoller.rollDieString(component)
        }
        return 0
    }

    modConditionIsTrue(mod: string, compValue: number): boolean {
        if (mod.includes('< ')) {
            const value = parseInt(mod.split('<')[1])
            return compValue < value
        } else if(mod.includes('<= ')) {
            const value = parseInt(mod.split('<=')[1])
            return compValue <= value
        } else if(mod.includes('= ')) {
            const value = parseInt(mod.split('=')[1])
            return compValue == value
        } else if(mod.includes('>= ')) {
            const value = parseInt(mod.split('>=')[1])
            return compValue >= value
        } else if(mod.includes('> ')) {
            const value = parseInt(mod.split('>')[1])
            return compValue > value
        }
        return false
}

    resolveFullAttack(targetAc: number): FullAttackResult {
        const attackBonuses = this.settings.attacks
        const result = new FullAttackResult()
        const attacks = this.getAttacksFromString(attackBonuses)
        let resolvedAttacks = 0
        let hits = 0
        attacks.forEach(attack => {
            const attackResult = this.resolveSingleAttack(targetAc, attack + 1, resolvedAttacks + 1, hits + 1)
            result.addResult(attackResult)
            resolvedAttacks++
            if (attackResult.isHit) {
                hits++
            }
        });
        return result
    }

    resolveSingleAttack(targetAc: number, bonusToHit: number, attack = 0, hit = 0): SingleAttackResult {
        Logger.log('attack: ' + attack)
        Logger.log('hit: ' + hit)
        Logger.log('settings: ' + JSON.stringify(this.settings))
        const naturalRoll = this.dieRoller.rollDieString('1d20')
        const critThreshold = this.settings.critThreshold
        const critBonusDamage = this.settings.critBonusDamage
        const critConfirmBonus = parseInt(this.settings.critConfirmBonus)
        const attackBonus = parseInt(this.settings.attackBonus)
        const damage = this.settings.damage
        const dr = parseInt(this.settings.damageReduction)
        const damageMod = this.settings.mods
        Logger.log('naturalRoll: ' + naturalRoll)
        if (naturalRoll == 1) {
            return new SingleAttackResult(targetAc, false, false, 0, 0, 0, 0)
        }
        const modifiedRoll = naturalRoll + bonusToHit + attackBonus
        Logger.log('modifiedRoll: ' + modifiedRoll)
        const isHit = modifiedRoll >= targetAc || naturalRoll == 20
        let baseDamage = 0
        let critDamage = 0
        let modDamage = 0
        let isCrit = false

        Logger.log('isHit: ' + isHit)
        if (isHit) {
            const critThreat = naturalRoll >= parseInt(critThreshold)
            baseDamage = this.dieRoller.rollDieString(damage)
            if (critThreat) {
                Logger.log('critical threat')
                const confirmRoll = this.dieRoller.rollDieString('1d20')
                Logger.log('confirm roll: ' + confirmRoll)
                const modifiedConfirm = confirmRoll + bonusToHit + critConfirmBonus + attackBonus
                Logger.log('modifiedConfirm roll: ' + modifiedConfirm)
                isCrit = modifiedConfirm >= targetAc
                Logger.log('isCrit: ' + isCrit)
                if (isCrit) {
                    critDamage = this.dieRoller.rollDieString(critBonusDamage)
                }
            }
            modDamage = this.processMod(damageMod, attack, hit, isCrit)
        }
        Logger.log('Base Damage: ' + baseDamage)
        Logger.log('Mod Damage: ' + modDamage)
        Logger.log('Crit Damage: ' + critDamage)
        const totalDamage = Math.max(baseDamage + modDamage + critDamage - dr, 0)
        Logger.log('totalDamage: ' + totalDamage)
        return new SingleAttackResult(targetAc, isHit, isCrit, baseDamage, modDamage, critDamage, totalDamage)
    }

}