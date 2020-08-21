<template>
  <div class="home">
    <div class="settings">
      <div class="settings-container">
        <div class="scope">SCOPE</div>
        <div>Iterations<input v-model="iterations"/></div>
        <div>Target AC min<input v-model="acMin"/> max<input v-model="acMax"/></div>
      </div>
      <div class="settings-container">
        <div class="base">BASE</div>
        <div>Attacks<input v-model="attacks"/> Damage<input v-model="damage"/></div>
        <div>Crit Threshold:<input style="width: 2em;" v-model="critThreshold"/> Crit Multiplier<input style="width: 1em;" v-model="critMultiplier"/></div>
        <div>Jabbing Style:<input v-model="jabbingStyle" type="checkbox"/> Jabbing Master:<input v-model="jabbingMaster" type="checkbox"/></div>
      </div>
      <div class="settings-container">
        <div class="comp">COMPARE</div>
        <div>Attacks:<input v-model="compAttacks"/> Damage<input v-model="compDamage"/></div>
        <div>Crit Threshold:<input style="width: 2em;" v-model="compCritThreshold"/> Crit Multiplier:<input style="width: 1em;" v-model="compCritMultiplier"/></div>
        <div>Jabbing Style:<input v-model="compJabbingStyle" type="checkbox"/> Jabbing Master:<input v-model="compJabbingMaster" type="checkbox"/></div>
      </div>
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
import { defineComponent, ref, onBeforeMount, onMounted } from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import { FullAttackResult } from '@/attack/attack-result';
import AttackResolver from '@/attack/attack-resolver';
import IterativeAttackResolver from '@/attack/iterative-attack-resolver';
import AppStorage from '@/storage'

export default defineComponent({
  name: 'Home',
  components: {
  },
  data() {
    return {
    }
  },
  methods: {
  },
  setup() {
    const iterations = ref('100')
    const acMin = ref('15')
    const acMax = ref('40')
    const attacks = ref('+32/+32/+27/+27/+22/+22/+17/+17')
    const damage = ref('2d10')
    const critThreshold = ref('20')
    const critMultiplier = ref('2')
    const jabbingStyle = ref(true)
    const jabbingMaster = ref(true)
    const attackResults = ref(new Array<FullAttackResult>())
    const compAttacks = ref('+32/+32/+27/+27/+22/+22/+17/+17')
    const compDamage = ref('2d10')
    const compCritThreshold = ref('20')
    const compCritMultiplier = ref('2')
    const compJabbingStyle = ref(true)
    const compJabbingMaster = ref(true)
    const compAttackResults = ref(new Array<FullAttackResult>())
    const maxDamage = ref(0)

    const acForIndex = function(index: number) {
      return index + parseInt(acMin.value);
    }
    const damageDeltaForIndex = function(index: number): number {
      const base = attackResults.value[index].totalDamage / parseInt(iterations.value);
      console.log('base: ' + base)
      const comp = compAttackResults.value[index].totalDamage / parseInt(iterations.value);
      console.log('comp: ' + comp)
      return (comp - base);
      // return ((comp.totalDamage / parseInt(iterations.value)) - (base.totalDamage / parseInt(iterations.value))).toFixed(1)
    }
    const widthForIndex = function(index: number) {
      const damagePerRound = attackResults.value[index].totalDamage / parseInt(iterations.value);
      const maxDamagePerRound = maxDamage.value / parseInt(iterations.value);
      const damagePercentage = Math.round(damagePerRound / maxDamagePerRound * 100)
      return damagePercentage + '%';
    }
    const compWidthForIndex = function(index: number) {
      const damagePerRound = attackResults.value[index].totalDamage / parseInt(iterations.value) + damageDeltaForIndex(index);
      const maxDamagePerRound = maxDamage.value / parseInt(iterations.value);
      const damagePercentage = Math.round(damagePerRound / maxDamagePerRound * 100)
      return damagePercentage + '%';
    }
    const averageHits = function(index: number, comp: boolean): string {
      const results = comp ? compAttackResults.value[index] : attackResults.value[index];
      return (results.totalHits / parseInt(iterations.value)).toFixed(1)    
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
        + ' Damage/Round: ' + (results.totalDamage / parseInt(iterations.value)).toFixed(1)
        + (comp ? ' (' + damageDeltaForIndex(index).toFixed(1) + ')' : '');
    }
    const getMaxDamage = function(attackResults: Array<FullAttackResult>): number {
      const damageList = attackResults.map((e) => { return e.totalDamage });
      return damageList.reduce((previous, current) => { return Math.max(previous, current) })
    }
    const caclulateClicked = function() {
      const storage = new AppStorage()
      storage.iterations = iterations.value
      storage.acMin = acMin.value
      storage.acMax = acMax.value
      storage.attacks = attacks.value
      storage.damage = damage.value
      storage.critThreshold = critThreshold.value
      storage.critMultiplier = critMultiplier.value
      storage.jabbingStyle = jabbingStyle.value
      storage.jabbingMaster = jabbingMaster.value

      let mod = AttackResolver.nullSyleMod;
      if (jabbingMaster.value) {
        mod = AttackResolver.jabbingMasterMod;
      } else if (jabbingStyle.value) {
        mod = AttackResolver.jabbingStyleMod;
      }
      let compMod = AttackResolver.nullSyleMod;
      if (compJabbingMaster.value) {
        compMod = AttackResolver.jabbingMasterMod;
      } else if (compJabbingStyle.value) {
        compMod = AttackResolver.jabbingStyleMod;
      }
      attackResults.value = new Array<FullAttackResult>()
      compAttackResults.value = new Array<FullAttackResult>()
      for (let i = parseInt(acMin.value); i <= parseInt(acMax.value); i++) {
        const resolver = new IterativeAttackResolver(parseInt(iterations.value));
        attackResults.value.push(resolver.resolveFullAttack(i, attacks.value, parseInt(critThreshold.value), 
          parseInt(critMultiplier.value), damage.value, mod))
        compAttackResults.value.push(resolver.resolveFullAttack(i, compAttacks.value, parseInt(compCritThreshold.value), 
          parseInt(compCritMultiplier.value), compDamage.value, compMod))
          
      }

      maxDamage.value = Math.max(getMaxDamage(attackResults.value), getMaxDamage(compAttackResults.value));
    }
    onMounted(() => {
      const storage = new AppStorage()
      iterations.value = storage.iterations;
      acMin.value = storage.acMin;
      acMax.value = storage.acMax
      attacks.value = storage.attacks
      damage.value = storage.damage
      critThreshold.value = storage.critThreshold
      critMultiplier.value = storage.critMultiplier
      jabbingStyle.value = storage.jabbingStyle
      jabbingMaster.value = storage.jabbingMaster
      compAttacks.value = storage.attacks
      compDamage.value = storage.damage
      compCritThreshold.value = storage.critThreshold
      compCritMultiplier.value = storage.critMultiplier
      compJabbingStyle.value = storage.jabbingStyle
      compJabbingMaster.value = storage.jabbingMaster

    });
    
    return {
      iterations,
      acMin,
      acMax,
      attacks,
      damage,
      critThreshold,
      critMultiplier,
      jabbingStyle,
      jabbingMaster,
      attackResults,
      widthForIndex,
      compWidthForIndex,
      acForIndex,
      damageDeltaForIndex,
      caclulateClicked,
      compAttacks,
      compDamage,
      compCritThreshold,
      compCritMultiplier,
      compJabbingStyle,
      compJabbingMaster,
      compAttackResults,
      maxDamage,
      averageHits,
      critRate,
      resultDescription
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
