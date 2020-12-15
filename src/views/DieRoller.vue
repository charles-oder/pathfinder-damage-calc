<template>
  <div class="die-roller">
    <div>
      <input class="name-field" v-model="nameValue" />
      <button class="delete-button" @click="deleteRoll()">X</button>
    </div>
    <div>
      <input class="dice-field" v-model="dieStringValue" />
      <button class="roll-button" @click="roll()">Roll</button>
    </div>
    <div class="result-pane">
      <div class="result">{{ result }}</div>
    </div>
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
.die-roller {
  position: relative;
  background: #6279b8;
  border-radius: 5px;
  box-shadow: 5px 5px 5px gray;
  width: 300px;
  height: 120px;
}
input {
  border: none;
  text-align: center;
  font-size: 1.1em;
  width: 210px;
}
.delete-button {
  position: absolute;
  padding: 0;
  top: 5px;
  left: 5px;
  width: 15px;
  height: 15px;
  border: none;
  font-weight: bold;
  color: white;
  background: red;
  text-align: center;
  font-size: 10px;
  border-radius: 50%;
}

.roll-button {
  position: absolute;
  border: none;
  background: green;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  top: 5px;
  right: 5px;
  height: 50px;
  width: 50px;
}
.roll-button:focus {
  border: none;
  outline: 0;
}

.result-pane {
  position: absolute;
  top: 60px;
  left: 5px;
  width: 290px;
  height: 55px;
}

.result {
  margin: auto;
  color: white;
}

.name-field {
  position: absolute;
  top: 5px;
  left: 25px;
}

.dice-field {
  position: absolute;
  top: 30px;
  left: 25px;
}
</style>
