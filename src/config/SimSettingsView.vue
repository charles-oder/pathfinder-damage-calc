<template>
    <div class="sim-settings-view">
        <div class="sim-settings-header">SCOPE</div>
        <div>Iterations:<input v-model="simSettings.iterations"/> <TooltipView :text="iterationTooltip"/></div>
        <div>Target AC <TooltipView :text="targetAcTooltip"/> min<input v-model="simSettings.acMin"/></div>
        <div> max<input v-model="simSettings.acMax"/></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import SimSettings from '@/config/sim-settings';
import TooltipView from '@/TooltipView.vue';

export default defineComponent({
    name: 'SimSettingsView',
    components: {
        TooltipView
    },
    props: {
        settings: SimSettings
    },
    setup(props, { emit }) {
        const simSettings = computed({
            get: () => props.settings,
            set: (value) => emit('input', value)
        });
        const iterationTooltip = 'The number of times to run each sim.  Higher numbers yeild more consistent results, but can take some time to run.'
        const targetAcTooltip = 'The range of target armor classes to run the sim against';
        return {
            simSettings,
            iterationTooltip,
            targetAcTooltip
        }
    },
  
});
</script>

<style scoped lang="scss">
.sim-settings-view {
  position: relative;
  padding: 5px 5px 10px 5px;
}
.sim-settings-header {
  background-color: #CCC;
}

</style>
