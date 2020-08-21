<template>
  <div class="home">
    <div class="settings">
      <SimSettingsView class="settings-container" v-model:settings="simSettings"/>
      <AttackSettingsView class="settings-container" v-model:settings="attackSettings"/>
      <AttackSettingsView class="settings-container" v-model:settings="compAttackSettings"/>
    </div>
    <button class="calc-button" v-on:click="caclulateClicked()">Calculate</button>
    <AttackResultsView :results="results" :simSettings="simSettings"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeMount, onMounted, reactive } from 'vue';
import SimSettingsView from '@/config/SimSettingsView.vue';
import AttackSettingsView from '@/config/AttackSettingsView.vue';
import AttackResultsView from '@/attack/AttackResultsView.vue'
import { FullAttackResult, FullAttackResultSet } from '@/attack/attack-result';
import AttackResolver from '@/attack/attack-resolver';
import IterativeAttackResolver from '@/attack/iterative-attack-resolver';
import SimSettings from '@/config/sim-settings'
import AttackSettings from '@/config/attack-settings'

export default defineComponent({
  name: 'Home',
  components: {
    SimSettingsView,
    AttackSettingsView,
    AttackResultsView
  },
  data() {
    return {
    }
  },
  methods: {
  },
  setup() {
    const simSettings = reactive(new SimSettings());
    const attackSettings = reactive(new AttackSettings());
    const compAttackSettings = reactive(new AttackSettings());
    const results = reactive(new FullAttackResultSet())

    const caclulateClicked = function() {
      simSettings.save();
      attackSettings.save();
      results.base = []
      results.comp = []

      let mod = AttackResolver.nullSyleMod;
      if (attackSettings.jabbingMaster) {
        mod = AttackResolver.jabbingMasterMod;
      } else if (attackSettings.jabbingStyle) {
        mod = AttackResolver.jabbingStyleMod;
      }
      let compMod = AttackResolver.nullSyleMod;
      if (compAttackSettings.jabbingMaster) {
        compMod = AttackResolver.jabbingMasterMod;
      } else if (compAttackSettings.jabbingStyle) {
        compMod = AttackResolver.jabbingStyleMod;
      }
      for (let i = parseInt(simSettings.acMin); i <= parseInt(simSettings.acMax); i++) {
        const resolver = new IterativeAttackResolver(parseInt(simSettings.iterations));
        results.base.push(resolver.resolveFullAttack(i, attackSettings.attacks, parseInt(attackSettings.critThreshold), 
          parseInt(attackSettings.critMultiplier), attackSettings.damage, mod))
        results.comp.push(resolver.resolveFullAttack(i, compAttackSettings.attacks, parseInt(compAttackSettings.critThreshold), 
          parseInt(compAttackSettings.critMultiplier), compAttackSettings.damage, compMod))
          
      }

    }
    onMounted(() => {
      attackSettings.color = '#42b0db'
      attackSettings.name = 'BASE'
      compAttackSettings.color = '#00d300'
      compAttackSettings.name = 'COMPARE'
      results.baseColor = attackSettings.color;
      results.compColor = compAttackSettings.color;

    });
    
    return {
      caclulateClicked,
      simSettings,
      attackSettings,
      compAttackSettings,
      results
    }
  },
  
});
</script>

<style scoped lang="scss">
.settings {
  position: relative;
  display: block;
}
.calc-button {
  width: 50%;
  margin: 1% 25%;
  padding: 1em;
  display: block;
}
.settings-container {
  float: left;
  padding: 1em;
}
.results-container {
  display: inline-block;
  position: relative;
  width: 100%;
}
.results-line-item {
  text-align: start;
}
.results-meter-bar {
  position: absolute;
  top: 0;
  height: 100%;
}
.base {
  background-color: rgb(66, 176, 219);
}
.comp {
  background-color: rgb(0, 211, 0);
}
.results-data {
  position: relative;
  z-index: 1;
}
.results-container {
  position: relative;
}
a {
  color: #42b983;
}
</style>
