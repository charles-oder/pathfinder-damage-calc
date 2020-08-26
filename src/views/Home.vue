<template>
  <div class="home">
    <div class="settings">
      <AttackSettingsView v-for="(settings, index) in viewModel.attackSettings" v-bind:key="settings.name" class="settings-container" v-model:settings="viewModel.attackSettings[index]"/>
      <SimSettingsView class="settings-container" v-model:settings="viewModel.simSettings"/>
      <button class="calc-button" v-on:click="viewModel.caclulateClicked()">{{viewModel.buttonTitle}}</button>
    </div>
    <div class="results">
      <AttackResultsView :results="viewModel.resultSet"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import SimSettingsView from '@/config/SimSettingsView.vue'
import AttackSettingsView from '@/config/AttackSettingsView.vue'
import AttackResultsView from '@/attack/AttackResultsView.vue'
import HomeViewModel from '@/views/home-view-model'

export default defineComponent({
  name: 'Home',
  components: {
    SimSettingsView,
    AttackSettingsView,
    AttackResultsView
  },
  setup() {
    const viewModel = reactive(new HomeViewModel())

    return {
      viewModel
    }
  },
  
})

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
