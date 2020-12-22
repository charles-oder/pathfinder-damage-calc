<template>
  <div v-bind:class="['select-name', isVisible ? 'visible' : 'invisible']">
    <div class="modal-container">
      <div class="title">Rename: {{ name }}</div>
      <div class="input-container">
        <input v-model="nameValue" type="text" />
      </div>
      <div class="button-container">
        <button class="cancel" @click="cancel">Cancel</button>
        <button class="confirm" @click="confirm">Confirm</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "SelectName",
  components: {},
  props: {
    name: String,
    index: Number,
    isVisible: Boolean
  },
  setup(props, { emit }) {
    const nameValue = computed({
      get: () => props.name,
      set: value => {
        emit("update:name", value);
      }
    });

    const isVisibleValue = computed({
      get: () => props.isVisible,
      set: value => {
        emit("update:isVisible", value);
      }
    });

    function confirm() {
      emit("confirm-name-change");
      isVisibleValue.value = false;
    }
    function cancel() {
      isVisibleValue.value = false;
    }

    return {
      nameValue,
      confirm,
      cancel,
      isVisibleValue
    };
  }
});
</script>

<style scoped lang="scss">
.select-name {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: #0009;
}
.modal-container {
  padding: 20px;
  background: white;
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 5px;
}
.title {
  padding: 5px;
  margin-bottom: 20px;
}
input {
  font-size: 1.5em;
  text-align: center;
}
button {
  font-size: 1.5em;
  font-weight: bold;
  padding: 5px 10px;
  border: none;
  margin: 5px 20px;
  color: white;
}
.button-container {
  padding: 20px 0 0 0;
}
.cancel {
  background: red;
}
.confirm {
  background: green;
}
.visible {
  display: block;
}
.invisible {
  display: none;
}
</style>
