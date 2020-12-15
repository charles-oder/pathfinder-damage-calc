<template>
  <div class="die-roller-collection">
    Die Roller
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import HomeViewModel from "@/views/home-view-model";

export default defineComponent({
  name: "DieRollerCollection",
  components: {},
  setup() {
    const viewModel = reactive(new HomeViewModel());

    return {
      viewModel
    };
  }
});
</script>

<style scoped lang="scss">
.die-roller-collection {
  width: 100%;
  margin: 0;
}
</style>
