<template>
  <div class="die-roller">
    <div>
      <input v-model="nameValue" />
      <button @click="deleteRoll()">Delete</button>
    </div>
    <div>
      <input v-model="dieStringValue" />
      <button @click="roll()">Roll</button>
    </div>
    <div>{{ result }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import MultiDieRoller from "@/dice/multi-die-roller";

export default defineComponent({
  name: "DieRoller",
  components: {},
  props: {
    name: String,
    dieString: String
  },
  setup(props, { emit }) {
    const dieRoller = new MultiDieRoller();
    const result = ref("");
    const nameValue = computed({
      get: () => props.name,
      set: value => {
        emit("update:name", value);
        emit("data-updated");
      }
    });
    const dieStringValue = computed({
      get: () => props.dieString,
      set: value => {
        emit("update:dieString", value);
        emit("data-updated");
      }
    });
    function roll() {
      const str = dieStringValue.value;
      if (str) {
        result.value = dieRoller.rollDieStringWithBreakdown(str).toString();
      }
    }
    function deleteRoll() {
      emit("delete-roll");
    }
    return {
      nameValue,
      dieStringValue,
      result,
      roll,
      deleteRoll
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
