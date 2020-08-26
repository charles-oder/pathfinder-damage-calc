<template>
    <div class="attack-settings-view">
        <div class="sim-settings-header" v-bind:style="{background: attackSettings.color}">{{attackSettings.name}}</div>
        <div class="row">Attacks:<TooltipField fieldWidth="15em" v-model:value="attackSettings.attacks" :tooltip="attacksTooltip"/></div>
        <div class="row">Damage:<TooltipField v-model:value="attackSettings.damage" :tooltip="damageToolitp"/></div>
        <div class="row">Attack Bonus:<TooltipField fieldWidth="2em" v-model:value="attackSettings.attackBonus" :tooltip="attackBonusTooltip"/></div>
        <div class="row">Crit Threshold:<TooltipField fieldWidth="2em"  v-model:value="attackSettings.critThreshold" :tooltip="critThresholdTooltip"/></div>
        <div class="row">Crit Confirm Bonus:<TooltipField fieldWidth="2em" v-model:value="attackSettings.critConfirmBonus" :tooltip="critConfirmTooltip"/></div>
        <div class="row">Crit Bonus Damage:<TooltipField v-model:value="attackSettings.critBonusDamage" :tooltip="critDamageBonusTooltip"/></div>
        <div class="row">DR:<TooltipField fieldWidth="2em" v-model:value="attackSettings.damageReduction" :tooltip="damageReductionTooltip"/></div>
        <div class="row">Mods:<TooltipField fieldWidth="15em" v-model:value="attackSettings.mods" :tooltip="modsTooltip"/></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import AttackSettings from '@/config/attack-settings'
import TooltipField from '@/TooltipField.vue'

export default defineComponent({
    name: 'AttackSettingsView',
    components: {
        TooltipField
    },
    props: {
        settings: AttackSettings
    },
    setup(props, { emit }) {
        const attackSettings = computed({
            get: () => props.settings,
            set: (value) => emit('update:settings', value)
        })
        const attacksTooltip = 'Attacks to make each round. Format:\n+15/+10/+5'
        const attackBonusTooltip = 'Additional bonus to hit.'
        const critConfirmTooltip = 'Additional bonus to confirm critical hits.'
        const damageToolitp = 'Damage per attack.  Format:\n1d8+2d6'
        const critThresholdTooltip = 'The natural die roll for a critical threat'
        const critDamageBonusTooltip = 'The bonus damage for critical hits.  This ' 
        + 'is in addition to normal damage (i.e. <normal dmg> + <crit dmg>).  Format:\n1d8+2d6'
        const modsTooltip = 'Conditional modifications to damage based on attack or'
        + ' hit sequence.  Can be based on the number of the attack in sequence, or' 
        + ' the number of the hit in sequence. Multiple conditions must be separated' 
        + ' by a semicolon and are read from left to right, applying the first condition' 
        + ' found.  Example: The Jabbing Master feat says that the second successful hit'
        + ' does an additional 2d6 damage, and that each subsequent attack deals an' 
        + ' additional 4d6 damage this would be written as: \nhit > 2:4d6;hit > 1:2d6'
        const damageReductionTooltip = 'Damage Reduction.  The amount to reduce each individual attack by.'
        return {
            attackSettings,
            attacksTooltip,
            damageToolitp,
            critThresholdTooltip,
            critDamageBonusTooltip,
            modsTooltip,
            damageReductionTooltip,
            attackBonusTooltip,
            critConfirmTooltip
        }
    },
  
})
</script>

<style scoped lang="scss">
.attack-settings-view {
  position: relative;
  padding: 5px 5px 10px 5px;
}
.attack-settings-view .row {
  display: inline-block;
  padding: 2px 5px;
}

</style>
