<template>
    <div class="attack-results-view">
      <div class="results-line-item" v-for="(result, index) in results.results" v-bind:key="index">
        <div class="results-container" v-for="(set, barIndex) in result" v-bind:key="barIndex">
          <div class="results-data tooltip">{{ resultDescription(index, barIndex) }}<div class="tooltiptext">{{detailedDescription(index, barIndex)}}</div></div>
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
        results: FullAttackResultSet
    },
    data() {
        return {
            maxDamage: 0
        }
    },
    methods: {

    },
    setup(props, { emit }) {
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

        function damageDeltaForIndex(index: number, barIndex: number): number {
            const baseResults = props.results?.results[index][0] ?? new FullAttackResult()
            const compResults = props.results?.results[index][barIndex] ?? new FullAttackResult()
            const base = baseResults.totalDamage / baseResults.rounds;
            const comp = compResults.totalDamage / compResults.rounds;
            return (comp - base);
        }
        function widthForResult(result: FullAttackResult): string {
            const damagePerRound = result.totalDamage / result.rounds;
            const maxDamagePerRound = maxDamage() / result.rounds;
            const damagePercentage = damagePerRound / maxDamagePerRound * 100
            return damagePercentage + '%';
        }
        function averageHits(results: FullAttackResult): string {
            return (results.totalHits / results.rounds).toFixed(1)    
        }
        function critRate(results: FullAttackResult): string {
            return Math.round(results.totalCrits / results.totalHits * 100) + '%'
        }
        function resultDescription(index: number, barIndex: number): string {
            const results = props.results?.results[index][barIndex] ?? new FullAttackResult()
            const ac = results.targetAc;
            const delta = damageDeltaForIndex(index, barIndex).toFixed(1)
            const damagePerRound = (results.totalDamage / results.rounds).toFixed(1);
            return 'AC: ' + results.targetAc
                + ' H/Rnd: ' + averageHits(results)
                + ' (' + critRate(results) + ' crit)'
                + ' Dmg/Rnd: ' + damagePerRound
                + (barIndex > 0 ? ' (' + delta + ')' : '');
        }
        function detailedDescription(index: number, barIndex: number): string {
            const results = props.results?.results[index][barIndex] ?? new FullAttackResult()
            const ac = results.targetAc;
            const delta = damageDeltaForIndex(index, barIndex).toFixed(1)
            const damagePerRound = (results.totalDamage / results.rounds).toFixed(1);
            const hitPercentage = (results.totalHits / results.totalAttacks * 100).toFixed(1)
            let output = 'Target AC: ' + ac
                + '\n Total Attacks: ' + results.totalAttacks
                + '\n Total Hits: ' + results.totalHits
                + '\n Avg Hits/rnd: ' + averageHits(results) + ' (' + hitPercentage + '%) '
                + '\n Total Crits: ' + results.totalCrits
                + '\n Crit Rate: ' + critRate(results)
                + '\n Base Damage: ' + results.totalBaseDamage
                + '\n Crit Damage: ' + results.totalCritDamage
                + '\n Mod Damage: ' + results.totalModDamage
                + '\n Total Damage: ' + results.totalDamage
                + '\n Damage/rnd: ' + damagePerRound
            if (barIndex > 0) {
                output += '\n Difference from base: ' + delta
            }
            return output
        }
        
        return {
            resultDescription,
            color,
            widthForResult,
            detailedDescription
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
  z-index: -1;
}
.results-data {
  position: relative;
}
.results-container {
  position: relative;
}
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 300px;
  max-width: 50vw;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  white-space: pre-line;

  /* Position the tooltip */
  position: absolute;
  z-index: 1;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}

</style>
