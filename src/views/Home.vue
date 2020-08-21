<template>
  <div class="home">
    <div>Iterations<input v-model="iterations"/></div>
    <div>Target AC min<input v-model="acMin"/> max<input v-model="acMax"/></div>
    <div>Attacks<input v-model="attacks"/> Damage<input v-model="damage"/></div>
    <div>Crit Threshold<input v-model="critThreshold"/> Crit Multiplier<input v-model="critMultiplier"/></div>
    <div>Jabbing Style?:<input v-model="jabbingStyle" type="checkbox"/> Jabbing Master?:<input v-model="jabbingMaster" type="checkbox"/></div>
    <button v-on:click="caclulateClicked">Calculate</button>
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

export default defineComponent({
  name: 'Home',
  components: {
  },
  data() {
    return {
      iterations: '100',
      acMin: '15',
      acMax: '40',
      attacks: '+32/+32/+27/+27/+22/+22/+17/+17',
      damage: '2d10',
      critThreshold: '20',
      critMultiplier: '2',
      jabbingStyle: true,
      jabbingMaster: true,
      attackResults: new Array<FullAttackResult>()
    }
  },
  methods: {
    widthForIndex(index: number) {
      const damagePerRound = this.attackResults[index].totalDamage() / parseInt(this.iterations);
      const maxDamage = 200;
      const damagePercentage = Math.round(damagePerRound / maxDamage * 100)
      console.log('Percentage: ' + damagePercentage);
      return damagePercentage + '%';
    },
    acForIndex(index: number) {
      return index + parseInt(this.acMin);
    },
    damageDeltaForIndex(index: number) {
      if (index == 0) {
        return 0;
      }
      const lastRound = this.attackResults[index - 1];
      const thisRound = this.attackResults[index];
      return ((thisRound.totalDamage() / parseInt(this.iterations)) - (lastRound.totalDamage() / parseInt(this.iterations))).toFixed(1)
    },
    caclulateClicked() {
      let mod = AttackResolver.nullSyleMod;
      if (this.jabbingMaster) {
        mod = AttackResolver.jabbingMasterMod;
      } else if (this.jabbingStyle) {
        mod = AttackResolver.jabbingStyleMod;
      }
      this.attackResults = new Array<FullAttackResult>()
      for (let i = parseInt(this.acMin); i <= parseInt(this.acMax); i++) {
        const resolver = new IterativeAttackResolver(parseInt(this.iterations));
        this.attackResults.push(resolver.resolveFullAttack(i, this.attacks, parseInt(this.critThreshold), 
          parseInt(this.critMultiplier), this.damage, mod))
        console.log('Calculate!')
      }
    }
  },
  setup() {
    const booyah = ref('monkey')
    onBeforeMount(() => {
      console.log('onBeforeMount');
      booyah.value = 'test';
    });
    
    return {
      booyah
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
