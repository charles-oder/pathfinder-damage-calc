<template>
    <div class="attack-results-view">
      <div class="results-line-item" v-for="(results, index) in results.base" v-bind:key="index">
        <div class="results-container">
          <div class="results-data">{{ resultDescription(index, false) }}</div>
          <div class="results-meter-bar base" v-bind:style="{width: widthForIndex(index), background: color(false)}"></div>
        </div>
        <div class="results-container">
          <div class="results-data">{{ resultDescription(index, true) }}</div>
          <div class="results-meter-bar comp" v-bind:style="{width: compWidthForIndex(index), background: color(true)}"></div>
        </div>
      </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, watch } from 'vue';
import SimSettings from '@/config/sim-settings'
import { FullAttackResultSet, FullAttackResult } from '@/attack/attack-result';

export default defineComponent({
    name: 'SimSettingsView',
    components: {
    },
    props: {
        results: FullAttackResultSet,
        simSettings: SimSettings
    },
    data() {
        return {
            maxDamage: 0
        }
    },
    methods: {

    },
    setup(props, { emit }) {
        function baseResults(): Array<FullAttackResult> {
            return props.results?.base ?? [];
        }
        function compResults(): Array<FullAttackResult> {
            return props.results?.comp ?? [];
        }
        function simSettings(): SimSettings {
            return props.simSettings ?? new SimSettings();
        }
        function color(comp: boolean): string | undefined {
            return comp ? props.results?.compColor : props.results?.baseColor
        }
        function getMaxDamage(attackResults: Array<FullAttackResult>): number {
            const damageList = attackResults.map((e) => { return e.totalDamage });
            return damageList.reduce((previous, current) => { return Math.max(previous, current) }, 0)
        }
        function maxDamage(): number {
            return Math.max(getMaxDamage(compResults()), getMaxDamage(baseResults()))
        }

        function acForIndex(index: number) {
            return index + parseInt(simSettings().acMin);
        }
        function damageDeltaForIndex(index: number): number {
            const base = baseResults()[index].totalDamage / parseInt(simSettings().iterations);
            const comp = compResults()[index].totalDamage / parseInt(simSettings().iterations);
            return (comp - base);
        }
        function widthForIndex(index: number) {
            const damagePerRound = baseResults()[index].totalDamage / parseInt(simSettings().iterations);
            console.log('base-damagePerRound: ' + damagePerRound)
            const maxDamagePerRound = maxDamage() / parseInt(simSettings().iterations);
            console.log('base-maxDamagePerRound: ' + maxDamagePerRound)
            const damagePercentage = Math.round(damagePerRound / maxDamagePerRound * 100)
            console.log('base-width: ' + damagePercentage)
            return damagePercentage + '%';
        }
        function compWidthForIndex(index: number) {
            const damagePerRound = baseResults()[index].totalDamage / parseInt(simSettings().iterations) + damageDeltaForIndex(index);
            console.log('comp-damagePerRound: ' + damagePerRound)
            const maxDamagePerRound = maxDamage() / parseInt(simSettings().iterations);
            console.log('comp-maxDamagePerRound: ' + maxDamagePerRound)
            const damagePercentage = Math.round(damagePerRound / maxDamagePerRound * 100)
            console.log('comp-width: ' + damagePercentage)
            return damagePercentage + '%';
        }
        function averageHits(index: number, comp: boolean): string {
            const results = comp ? compResults()[index] : baseResults()[index];
            return (results.totalHits / parseInt(simSettings().iterations)).toFixed(1)    
        }
        function critRate(index: number, comp: boolean): string {
            const results = comp ? compResults()[index] : baseResults()[index];
            return Math.round(results.totalCrits / results.totalHits * 100) + '%'
        }
        function resultDescription(index: number, comp: boolean) {
            const results = comp ? compResults()[index] : baseResults()[index];
            return 'AC: ' + acForIndex(index)
                + ' Hits/Round: ' + averageHits(index, comp)
                + ' (' + critRate(index, comp) + ' crit)'
                + ' Damage/Round: ' + (results.totalDamage / parseInt(simSettings().iterations)).toFixed(1)
                + (comp ? ' (' + damageDeltaForIndex(index).toFixed(1) + ')' : '');
        }
        
        return {
            resultDescription,
            widthForIndex,
            compWidthForIndex,
            color
        }

    }
  
});
</script>

<style scoped lang="scss">
.attack-results-view {
    position: relative;
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
.results-data {
  position: relative;
  z-index: 1;
}
.results-container {
  position: relative;
}
</style>
