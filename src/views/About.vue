<template>
  <div class="about">
    <h1>D20 Tools v{{ viewModel.versionNumber() }}</h1>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import AboutViewModel from "@/views/about-view-model";

export default defineComponent({
  name: "Home",
  components: {},
  setup() {
    const viewModel = new AboutViewModel();
    return {
      viewModel
    };
  }
});
</script>
