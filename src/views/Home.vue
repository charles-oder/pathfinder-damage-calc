<template>
  <div class="home">
    <div class="settings">
      <SimSettingsView class="settings-container" v-model:settings="simSettings"/>
      <AttackSettingsView class="settings-container" v-model:settings="attackSettings"/>
      <AttackSettingsView class="settings-container" v-model:settings="compAttackSettings"/>
    </div>
    <button class="calc-button" v-on:click="caclulateClicked()">Calculate</button>
    <div class="results-container">
      <div class="results-line-item" v-for="(results, index) in attackResults" v-bind:key="index">
        <div class="results-container">
          <div class="results-data">{{ resultDescription(index, false) }}</div>
          <div class="results-meter-bar base" v-bind:style="{width: widthForIndex(index)}"></div>
        </div>
        <div class="results-container">
          <div class="results-data">{{ resultDescription(index, true) }}</div>
          <div class="results-meter-bar comp" v-bind:style="{width: compWidthForIndex(index)}"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeMount, onMounted, reactive } from 'vue';
import SimSettingsView from '@/config/SimSettingsView.vue';
import AttackSettingsView from '@/config/AttackSettingsView.vue';
import { FullAttackResult } from '@/attack/attack-result';
import AttackResolver from '@/attack/attack-resolver';
import IterativeAttackResolver from '@/attack/iterative-attack-resolver';
import AppStorage from '@/storage'
import SimSettings from '@/config/sim-settings'
import AttackSettings from '@/config/attack-settings'

export default defineComponent({
  name: 'Home',
  components: {
    SimSettingsView,
    AttackSettingsView
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
    const attackResults = ref(new Array<FullAttackResult>())
    const compAttackResults = ref(new Array<FullAttackResult>())
    const maxDamage = ref(0)

    const acForIndex = function(index: number) {
      return index + parseInt(simSettings.acMin);
    }
    const damageDeltaForIndex = function(index: number): number {
      const base = attackResults.value[index].totalDamage / parseInt(simSettings.iterations);
      console.log('base: ' + base)
      const comp = compAttackResults.value[index].totalDamage / parseInt(simSettings.iterations);
      console.log('comp: ' + comp)
      return (comp - base);
      // return ((comp.totalDamage / parseInt(iterations.value)) - (base.totalDamage / parseInt(iterations.value))).toFixed(1)
    }
    const widthForIndex = function(index: number) {
      const damagePerRound = attackResults.value[index].totalDamage / parseInt(simSettings.iterations);
      const maxDamagePerRound = maxDamage.value / parseInt(simSettings.iterations);
      const damagePercentage = Math.round(damagePerRound / maxDamagePerRound * 100)
      return damagePercentage + '%';
    }
    const compWidthForIndex = function(index: number) {
      const damagePerRound = attackResults.value[index].totalDamage / parseInt(simSettings.iterations) + damageDeltaForIndex(index);
      const maxDamagePerRound = maxDamage.value / parseInt(simSettings.iterations);
      const damagePercentage = Math.round(damagePerRound / maxDamagePerRound * 100)
      return damagePercentage + '%';
    }
    const averageHits = function(index: number, comp: boolean): string {
      const results = comp ? compAttackResults.value[index] : attackResults.value[index];
      return (results.totalHits / parseInt(simSettings.iterations)).toFixed(1)    
    }
    const critRate = function(index: number, comp: boolean): string {
      const results = comp ? compAttackResults.value[index] : attackResults.value[index];
      return Math.round(results.totalCrits / results.totalHits * 100) + '%'
    }
    const resultDescription = function(index: number, comp: boolean) {
      const results = comp ? compAttackResults.value[index] : attackResults.value[index];
      return 'AC: ' + acForIndex(index)
        + ' Hits/Round: ' + averageHits(index, comp)
        + ' (' + critRate(index, comp) + ' crit)'
        + ' Damage/Round: ' + (results.totalDamage / parseInt(simSettings.iterations)).toFixed(1)
        + (comp ? ' (' + damageDeltaForIndex(index).toFixed(1) + ')' : '');
    }
    const getMaxDamage = function(attackResults: Array<FullAttackResult>): number {
      const damageList = attackResults.map((e) => { return e.totalDamage });
      return damageList.reduce((previous, current) => { return Math.max(previous, current) })
    }
    const caclulateClicked = function() {
      simSettings.save();
      attackSettings.save();
      const storage = new AppStorage()

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
      attackResults.value = new Array<FullAttackResult>()
      compAttackResults.value = new Array<FullAttackResult>()
      for (let i = parseInt(simSettings.acMin); i <= parseInt(simSettings.acMax); i++) {
        const resolver = new IterativeAttackResolver(parseInt(simSettings.iterations));
        attackResults.value.push(resolver.resolveFullAttack(i, attackSettings.attacks, parseInt(attackSettings.critThreshold), 
          parseInt(attackSettings.critMultiplier), attackSettings.damage, mod))
        compAttackResults.value.push(resolver.resolveFullAttack(i, compAttackSettings.attacks, parseInt(compAttackSettings.critThreshold), 
          parseInt(compAttackSettings.critMultiplier), compAttackSettings.damage, compMod))
          
      }

      maxDamage.value = Math.max(getMaxDamage(attackResults.value), getMaxDamage(compAttackResults.value));
    }
    onMounted(() => {
      const storage = new AppStorage()
      attackSettings.color = '#42b0db'
      attackSettings.name = 'BASE'
      compAttackSettings.color = '#00d300'
      compAttackSettings.name = 'COMPARE'

    });
    
    return {
      attackResults,
      widthForIndex,
      compWidthForIndex,
      acForIndex,
      damageDeltaForIndex,
      caclulateClicked,
      compAttackResults,
      maxDamage,
      averageHits,
      critRate,
      resultDescription,
      simSettings,
      attackSettings,
      compAttackSettings
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
.settings-container div {
  padding: 1px;
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
.scope {
  background-color: #CCC;
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
