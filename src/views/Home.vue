<template>
  <div class="home">
    <div class="settings">
      <AttackSettingsView class="settings-container" v-model:settings="attackSettings"/>
      <AttackSettingsView class="settings-container" v-model:settings="compAttackSettings"/>
      <SimSettingsView class="settings-container" v-model:settings="simSettings"/>
      <button class="calc-button" v-on:click="caclulateClicked()">{{buttonTitle}}</button>
    </div>
    <AttackResultsView :results="resultSet"/>
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
    const buttonTitle = ref('Calculate');
    let resolvers: Array<AttackResolver> = []
    let running = false;
    let startTime = 0;
    let lapTime = 0;

    function startTimer() {
      startTime = new Date().getTime();
      lapTime = startTime;
    }

    function printTimer(name: string, end = false) {
        const endTime = new Date().getTime()
        const runningTime = ((endTime - (end ? startTime : lapTime)) / 1000).toFixed(3);
        lapTime = endTime;
        console.log(name + ' completed in ' + runningTime + ' seconds')
    }

    function killTimeouts() {
        const highestTimeoutId = setTimeout(";");
        for (let id = 0 ; id < highestTimeoutId ; id++) {
            clearTimeout(id); 
        }
    }

    function runJob(ac: number, iteration: number, batchSize: number) {
      const totalIterations = parseInt(simSettings.iterations)
      if (iteration >= totalIterations) {
        printTimer('AC ' + ac);
        ac++;
        iteration = 0;
      }
      if (ac > parseInt(simSettings.acMax)) {
        const endTime = new Date().getTime()
        const runningTime = ((endTime - startTime) / 1000).toFixed(3);
        printTimer('Job', true);
        buttonTitle.value = 'Calculate'
        running = false;
        return;
      }
      const index = ac - parseInt(simSettings.acMin)

      buttonTitle.value = 'Calculating (AC: ' + ac + ', iteration: ' + iteration + ')... Click to cancel';
      setTimeout(() => {
        for (let i = 0; i < batchSize; i++) {
          for (let r = 0; r < resolvers.length; r++) {
            resultSet.addResult(index, r, resolvers[r].resolveFullAttack(ac));
          }

        }
        runJob(ac, iteration + batchSize, batchSize);
      }, 0)

    }

    const caclulateClicked = function() {
      startTimer()
      if (running) {
        running = false;
        killTimeouts();
        buttonTitle.value = 'Calculate';
        return;
      }
      running = true;
      simSettings.save();
      attackSettings.save();
      resultSet.colors = ['#42b0db','#00d300']
      resultSet.reset();

      resolvers = [
        new AttackResolver(attackSettings),
        new AttackResolver(compAttackSettings)
      ]
      buttonTitle.value = 'Starting run...'
      const batchSize = Math.max(Math.min(parseInt(simSettings.iterations) / 100, 1000), 1);
      console.log('Starting Run (Batch Size: ' + batchSize + ')');
      runJob(parseInt(simSettings.acMin), 0, batchSize);
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
      resultSet,
      buttonTitle
    }
  },
  
});

class Job {
  index: number
  base: FullAttackResult 
  comp: FullAttackResult
  constructor(index: number, base: FullAttackResult, comp: FullAttackResult) {
    this.index = index;
    this.base = base;
    this.comp = comp;
  }
}

</script>

<style scoped lang="scss">
.settings {
  position: relative;
  display: block;
  margin: 1em 5%;
}
.calc-button {
  width: 100%;
  height: 40px;
  display: block;
}
.settings-container {
  float: left;
  width: 30%;
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

@media only screen and (max-width: 1120px) {
  .settings-container {
    width: 45%;
    margin: 0 1%;
  }
  body {
    background-color: lightblue;
  }
}
@media only screen and (max-width: 850px) {
  .settings-container {
    width: 90%;
    margin: 0 5%;
  }
  body {
    background-color: lightblue;
  }
}

</style>
