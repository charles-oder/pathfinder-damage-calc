<template>
  <div class="home">
    <div>Iterations<input v-model="iterations"/></div>
    <div>Target AC min<input v-model="acMin"/> max<input v-model="acMax"/></div>
    <div>Attacks<input v-model="attacks"/> Damage<input v-model="damage"/></div>
    <div>Crit Threshold<input v-model="critThreshold"/> Crit Multiplier<input v-model="critMultiplier"/></div>
    <div>Jabbing Style?:<input v-model="jabbingStyle" type="checkbox"/> Jabbing Master?:<input v-model="jabbingMaster" type="checkbox"/></div>
    <button v-on:click="caclulateClicked()">Calculate</button>
    <div class="results-container">
      <div class="results-line-item" v-for="(results, index) in attackResults" v-bind:key="index">
        <div>AC: {{ acForIndex(index) }} Average Hits: {{ (results.totalHits() / iterations).toFixed(1) }} (
          {{ Math.round(results.totalCrits() / results.totalHits() * 100) }}% crit) Damage/Round: 
          {{ results.totalDamage() / iterations }} ({{ damageDeltaForIndex(index) }})</div>
          <div class="results-meter-bar" v-bind:style="{width: widthForIndex(index)}"></div>
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

    const widthForIndex = function(index: number) {
      const damagePerRound = attackResults.value[index].totalDamage() / parseInt(iterations.value);
      const maxDamage = 200;
      const damagePercentage = Math.round(damagePerRound / maxDamage * 100)
      return damagePercentage + '%';
    }
    const acForIndex = function(index: number) {
      return index + parseInt(acMin.value);
    }
    const damageDeltaForIndex = function(index: number) {
      if (index == 0) {
        return 0;
      }
      const lastRound = attackResults.value[index - 1];
      const thisRound = attackResults.value[index];
      return ((thisRound.totalDamage() / parseInt(iterations.value)) - (lastRound.totalDamage() / parseInt(iterations.value))).toFixed(1)
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
      attackResults.value = new Array<FullAttackResult>()
      for (let i = parseInt(acMin.value); i <= parseInt(acMax.value); i++) {
        const resolver = new IterativeAttackResolver(parseInt(iterations.value));
        attackResults.value.push(resolver.resolveFullAttack(i, attacks.value, parseInt(critThreshold.value), 
          parseInt(critMultiplier.value), damage.value, mod))
      }
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
      acForIndex,
      damageDeltaForIndex,
      caclulateClicked
    }
  },
  
});
</script>

<style scoped lang="scss">
.results-container {
  width: 100%;
}
.results-line-item {
  text-align: start;
}
.results-meter-bar {
  height: 10px;
  background-color: blue;
}
a {
  color: #42b983;
}
</style>
