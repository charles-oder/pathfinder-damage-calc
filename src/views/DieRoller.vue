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
      <div v-bind:class="['result', resultSizeClass()]">{{ result }}</div>
      <div class="total-container">
        <div v-bind:class="['total', totalSizeClass()]">{{ total }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from "vue";
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
    const total = ref("");
    const nameValue = computed({
      get: () => props.name,
      set: value => {
        emit("update:name", value);
        emit("data-updated", value);
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
        for (let i = 0; i < 10; i++) {
          setTimeout(() => {
            const results = dieRoller.rollDieStringWithBreakdown(str);
            total.value = results.pop()?.toString() ?? "";
            result.value = results.join(" + ");
          }, i * 25);
        }
      }
    }

    watch(dieStringValue, () => {
      total.value = "";
      result.value = "";
    });
    watch(nameValue, () => {
      total.value = "";
      result.value = "";
    });

    function deleteRoll() {
      emit("delete-roll");
    }
    function resultSizeClass() {
      if (result.value.length < 12) {
        return "extra-large-text";
      } else if (result.value.length < 34) {
        return "large-text";
      } else if (result.value.length < 40) {
        return "medium-text";
      } else if (result.value.length < 60) {
        return "small-text";
      } else {
        return "tiny-text";
      }
    }
    function totalSizeClass() {
      if (total.value.length < 2) {
        return "single-digit-total";
      } else if (total.value.length < 3) {
        return "double-digit-total";
      } else {
        return "triple-digit-total";
      }
    }
    return {
      nameValue,
      dieStringValue,
      result,
      total,
      roll,
      deleteRoll,
      resultSizeClass,
      totalSizeClass
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
}
input {
  border: none;
  text-align: center;
  font-size: 1.1em;
  width: calc(100% - 20px - 70px);
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
button:focus {
  outline: 0;
}

.result-pane {
  position: absolute;
  top: 60px;
  left: 5px;
  width: calc(100% - 10px);
  height: 55px;
}

.result {
  position: absolute;
  left: 5px;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
  color: white;
  width: calc(100% - 65px);
}

.total-container {
  position: absolute;
  border: 2px solid white;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 100%;
  width: 50px;
}

.total {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
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
.tiny-text {
  font-size: 12px;
}
.small-text {
  font-size: 16px;
}
.medium-text {
  font-size: 24px;
}
.large-text {
  font-size: 28px;
}
.extra-large-text {
  font-size: 40px;
}
.single-digit-total {
  font-size: 60px;
}
.double-digit-total {
  font-size: 40px;
}
.triple-digit-total {
  font-size: 28px;
}
</style>
