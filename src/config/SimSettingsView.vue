<template>
    <div class="sim-settings-view">
        <div class="sim-settings-header">SCOPE</div>
        <div>Iterations<input v-model="simSettings.iterations"/></div>
        <div>Target AC min<input v-model="simSettings.acMin"/> max<input v-model="simSettings.acMax"/></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import SimSettings from '@/config/sim-settings'

export default defineComponent({
    name: 'SimSettingsView',
    components: {
    },
    props: {
        settings: SimSettings
    },
    setup(props, { emit }) {
        const simSettings = computed({
            get: () => props.settings,
            set: (value) => emit('input', value)
        });
        return {
            simSettings
        }
    },
  
});
</script>

<style scoped lang="scss">
.sim-settings-view {
  position: relative;
}
.sim-settings-header {
  background-color: #CCC;
}
</style>
