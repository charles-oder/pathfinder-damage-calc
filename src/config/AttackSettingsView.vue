<template>
    <div class="attack-settings-view">
        <div class="sim-settings-header" v-bind:style="{background: attackSettings.color}">{{attackSettings.name}}</div>
        <div>Attacks<input v-model="attackSettings.attacks"/> Damage<input v-model="attackSettings.damage"/></div>
        <div>Crit Threshold:<input style="width: 2em;" v-model="attackSettings.critThreshold"/> Crit Multiplier<input style="width: 1em;" v-model="attackSettings.critMultiplier"/></div>
        <div>Mods:<input v-model="attackSettings.mods"/></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import AttackSettings from '@/config/attack-settings'

export default defineComponent({
    name: 'AttackSettingsView',
    components: {
    },
    props: {
        settings: AttackSettings
    },
    setup(props, { emit }) {
        const attackSettings = computed({
            get: () => props.settings,
            set: (value) => emit('input', value)
        });
        return {
            attackSettings
        }
    },
  
});
</script>

<style scoped lang="scss">
.attack-settings-view {
  position: relative;
}
</style>
