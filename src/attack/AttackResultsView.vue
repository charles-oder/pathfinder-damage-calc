<template>
    <div class="attack-results-view">
      <div class="results-line-item" v-for="(result, index) in results.results" v-bind:key="index">
        <div class="results-container" v-for="(set, barIndex) in result" v-bind:key="barIndex">
          <div class="results-data">{{ resultDescription(index, barIndex) }}</div>
          <div class="results-meter-bar base" v-bind:style="{width: widthForResult(set), background: color(barIndex)}"></div>
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
        function simSettings(): SimSettings {
            return props.simSettings ?? new SimSettings();
        }
        function color(index: number): string | undefined {
            return props.results?.colors[index] ?? '#CCC'
        }
        function getMaxDamage(attackResults: Array<FullAttackResult>): number {
            const damageList = attackResults.map((e) => { return e.totalDamage });
            return damageList.reduce((previous, current) => { return Math.max(previous, current) }, 0)
        }
        function maxDamage(): number {
            let max = 0;
            props.results?.results.forEach((row) => {
                row.forEach((r) => {max = Math.max(max, r.totalDamage)});
            });
            return max
        }

        function acForIndex(index: number) {
            return index + parseInt(simSettings().acMin);
        }
        function damageDeltaForIndex(index: number, barIndex: number): number {
            const baseResults = props.results?.results[index][0] ?? new FullAttackResult()
            const compResults = props.results?.results[index][barIndex] ?? new FullAttackResult()
            const base = baseResults.totalDamage / parseInt(simSettings().iterations);
            const comp = compResults.totalDamage / parseInt(simSettings().iterations);
            return (comp - base);
        }
        function widthForResult(result: FullAttackResult): string {
            const damagePerRound = result.totalDamage / parseInt(simSettings().iterations);
            const maxDamagePerRound = maxDamage() / parseInt(simSettings().iterations);
            const damagePercentage = Math.round(damagePerRound / maxDamagePerRound * 100)
            return damagePercentage + '%';
        }
        function averageHits(results: FullAttackResult): string {
            return (results.totalHits / parseInt(simSettings().iterations)).toFixed(1)    
        }
        function critRate(results: FullAttackResult): string {
            return Math.round(results.totalCrits / results.totalHits * 100) + '%'
        }
        function resultDescription(index: number, barIndex: number) {
            const results = props.results?.results[index][barIndex] ?? new FullAttackResult()
            return 'AC: ' + results.targetAc
                + ' H/Rnd: ' + averageHits(results)
                + ' (' + critRate(results) + ' crit)'
                + ' Dmg/Rnd: ' + (results.totalDamage / parseInt(simSettings().iterations)).toFixed(1)
                + (barIndex > 0 ? ' (' + damageDeltaForIndex(index, barIndex).toFixed(1) + ')' : '');
        }
        
        return {
            resultDescription,
            color,
            widthForResult
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
