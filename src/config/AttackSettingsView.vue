<template>
    <div class="attack-settings-view">
        <div class="sim-settings-header" v-bind:style="{background: attackSettings.color}">{{attackSettings.name}}</div>
        <div class="row">Attacks:<input v-model="attackSettings.attacks"/> <TooltipView :text="attacksTooltip"/></div>
        <div class="row">Damage:<input v-model="attackSettings.damage"/> <TooltipView :text="damageToolitp"/></div>
        <div class="row">Crit Threshold:<input style="width: 2em;" v-model="attackSettings.critThreshold"/> <TooltipView :text="critThresholdTooltip"/></div>
        <div class="row">Crit Bonus Damage:<input v-model="attackSettings.critBonusDamage"/> <TooltipView :text="critDamageBonusTooltip"/></div>
        <div class="row">Mods:<input v-model="attackSettings.mods"/> <TooltipView :text="modsTooltip"/></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import AttackSettings from '@/config/attack-settings'
import TooltipView from '@/TooltipView.vue';

export default defineComponent({
    name: 'AttackSettingsView',
    components: {
        TooltipView
    },
    props: {
        settings: AttackSettings
    },
    setup(props, { emit }) {
        const attackSettings = computed({
            get: () => props.settings,
            set: (value) => emit('input', value)
        });
        const attacksTooltip = 'Attacks to make each round. Format:\n+15/+10/+5';
        const damageToolitp = 'Damage per attack.  Format:\n1d8+2d6';
        const critThresholdTooltip = 'The natural die roll for a critical threat';
        const critDamageBonusTooltip = 'The bonus damage for critical hits.  This ' 
        + 'is in addition to normal damage (i.e. <normal dmg> + <crit dmg>).  Format:\n1d8+2d6';
        const modsTooltip = 'Conditional modifications to damage based on attack or'
        + ' hit sequence.  Can be based on the number of the attack in sequence, or' 
        + ' the number of the hit in sequence. Multiple conditions must be separated' 
        + ' by a semicolon and are read from left to right, applying the first condition' 
        + ' found.  Example: The Jabbing Master feat says that the second successful hit'
        + ' does an additional 2d6 damage, and that each subsequent attack deals an' 
        + ' additional 4d6 damage this would be written as: \nhit > 2:4d6;hit > 1:2d6';
        return {
            attackSettings,
            attacksTooltip,
            damageToolitp,
            critThresholdTooltip,
            critDamageBonusTooltip,
            modsTooltip
        }
    },
  
});
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
