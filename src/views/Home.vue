<template>
  <div class="home">
    <div class="settings">
      <AttackSettingsView v-for="(settings, index) in attackSettings" v-bind:key="settings.name" class="settings-container" v-model:settings="attackSettings[index]"/>
      <SimSettingsView class="settings-container" v-model:settings="simSettings"/>
      <button class="calc-button" v-on:click="caclulateClicked()">{{buttonTitle}}</button>
    </div>
    <div class="results">
      <AttackResultsView :results="resultSet"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive } from 'vue';
import SimSettingsView from '@/config/SimSettingsView.vue';
import AttackSettingsView from '@/config/AttackSettingsView.vue';
import AttackResultsView from '@/attack/AttackResultsView.vue'
import { FullAttackResultSet } from '@/attack/attack-result';
import AttackResolver from '@/attack/attack-resolver';
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
    const attackSettings = reactive([
      new AttackSettings(),
      new AttackSettings(),
      new AttackSettings()
    ]);
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

    function caclulateClicked() {
      startTimer()
      if (running) {
        running = false;
        killTimeouts();
        buttonTitle.value = 'Calculate';
        return;
      }
      running = true;
      simSettings.save();
      attackSettings[0].save();
      resultSet.colors = attackSettings.map((setting) => { return setting.color });
      resultSet.reset();

      resolvers = attackSettings.map((setting) => { return new AttackResolver(setting) });

      buttonTitle.value = 'Starting run...'
      const batchSize = Math.max(Math.min(parseInt(simSettings.iterations) / 100, 1000), 1);
      console.log('Starting Run (Batch Size: ' + batchSize + ')');
      runJob(parseInt(simSettings.acMin), 0, batchSize);
    }
    onMounted(() => {
      attackSettings[0]
      attackSettings[0].color = '#BBDB9B'
      attackSettings[0].name = 'BASE'
      attackSettings[1].color = '#ABC4A1'
      attackSettings[1].name = 'OPTION 1'
      attackSettings[2].color = '#9DB4AB'
      attackSettings[2].name = 'OPTION 2'

    });
    
    return {
      caclulateClicked,
      simSettings,
      attackSettings,
      results,
      resultSet,
      buttonTitle
    }
  },
  
});

</script>

<style scoped lang="scss">
.home {
  width: 100%;
  margin: 0;
}
.settings {
  position: relative;
  display: inline-block;
  width: 90%;
  margin: 0 auto 15px auto;
}
.calc-button {
  width: 100%;
  height: 40px;
  display: inline-block;
  margin: auto;
}
.settings-container {
  display: inline-block;
  width: 100%;
  margin: auto;
}
.results {
  display: inline-block;
  width: 90%;
  margin: auto;
}

</style>
