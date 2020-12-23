<template>
  <div class="about">
    <h1>D20 Tools v{{ viewModel.versionNumber() }}</h1>
  </div>
  <a
    href="https://github.com/charles-oder/pathfinder-damage-calc/issues"
    target="_blank"
  >
    Report an Issue
  </a>
  <div class="history" v-for="version in versions" v-bind:key="version.name">
    <h2>{{ version.version }}</h2>
    <ul>
      <li v-for="commit in version.commits" v-bind:key="commit">
        {{ commit }}
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import AboutViewModel from "@/views/about-view-model";
import AboutHistory from "@/about/AboutHistory";

export default defineComponent({
  name: "Home",
  components: {},
  setup() {
    const viewModel = new AboutViewModel();
    const versions = AboutHistory.history;

    return {
      viewModel,
      versions
    };
  }
});
</script>
<style scoped lang="scss">
.history {
  position: relative;
  padding: 0 50px;
  text-align: left;
  left: 50%;
  transform: translateX(-50%);
}
</style>
