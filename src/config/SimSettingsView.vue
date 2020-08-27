<template>
  <div class="sim-settings-view">
    <div class="sim-settings-header">SCOPE</div>
    <div class="row">
      Iterations:<TooltipField
        fieldWidth="5em"
        v-model:value="simSettings.iterations"
        :tooltip="iterationTooltip"
      />
    </div>
    <div class="row">
      Target AC min:<TooltipField
        fieldWidth="2em"
        v-model:value="simSettings.acMin"
        :tooltip="targetAcMinTooltip"
      />
      max:<TooltipField
        fieldWidth="2em"
        v-model:value="simSettings.acMax"
        :tooltip="targetAcMaxTooltip"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import SimSettings from "@/config/sim-settings";
import TooltipField from "@/TooltipField.vue";

export default defineComponent({
  name: "SimSettingsView",
  components: {
    TooltipField
  },
  props: {
    settings: SimSettings
  },
  setup(props, { emit }) {
    const simSettings = computed({
      get: () => props.settings,
      set: value => emit("update:settings", value)
    });
    const iterationTooltip =
      "The number of times to run each sim.  Higher numbers yeild " +
      "more consistent results, but can take some time to run.";
    const targetAcMinTooltip =
      "The lowest target armor classes to run the sim against";
    const targetAcMaxTooltip =
      "The highest target armor classes to run the sim against";
    return {
      simSettings,
      iterationTooltip,
      targetAcMinTooltip,
      targetAcMaxTooltip
    };
  }
});
</script>

<style scoped lang="scss">
.sim-settings-view {
  position: relative;
  padding: 5px 5px 10px 5px;
}
.sim-settings-view .row {
  display: inline-block;
  padding: 2px 5px;
}
.sim-settings-header {
  background-color: #ccc;
}
</style>
