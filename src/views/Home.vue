<template>
  <div class="home">
    <div class="settings">
      <SimSettingsView class="settings-container" v-model:settings="simSettings"/>
      <AttackSettingsView class="settings-container" v-model:settings="attackSettings"/>
      <AttackSettingsView class="settings-container" v-model:settings="compAttackSettings"/>
      <button class="calc-button" v-on:click="caclulateClicked()">Calculate</button>
    </div>
    <AttackResultsView :results="resultSet" :simSettings="simSettings"/>
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
    const results = reactive(new FullAttackResultSet());
    const resultSet = reactive(new FullAttackResultSet());

    const caclulateClicked = function() {
      simSettings.save();
      debugger
      attackSettings.save();
      resultSet.colors = ['#42b0db','#00d300']
      resultSet.reset();

      const mod = AttackResolver.createModFromString(attackSettings.mods);
      const compMod = AttackResolver.createModFromString(compAttackSettings.mods);

      const baseResolver = new AttackResolver();
      for (let i = parseInt(simSettings.acMin); i <= parseInt(simSettings.acMax); i++) {
        for (let iteration = 0; iteration < parseInt(simSettings.iterations); iteration++) {
          const index = i - parseInt(simSettings.acMin)
          resultSet.addResult(index, 0, baseResolver.resolveFullAttack(i, attackSettings.attacks, parseInt(attackSettings.critThreshold), 
          attackSettings.critBonusDamage, attackSettings.damage, mod))
          resultSet.addResult(index, 1, baseResolver.resolveFullAttack(i, compAttackSettings.attacks, parseInt(compAttackSettings.critThreshold), 
          compAttackSettings.critBonusDamage, compAttackSettings.damage, compMod))
        
        }
      }
    }
    onMounted(() => {
      attackSettings.color = '#42b0db'
      attackSettings.name = 'BASE'
      compAttackSettings.color = '#00d300'
      compAttackSettings.name = 'COMPARE'

    });
    
    return {
      caclulateClicked,
      simSettings,
      attackSettings,
      compAttackSettings,
      results,
      resultSet
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
