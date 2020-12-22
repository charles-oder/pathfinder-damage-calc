<template>
  <div v-bind:class="['select-name', isVisible ? 'visible' : 'invisible']">
    <div class="modal-container">
      <div class="input-container">
        <input v-model="nameValue" type="text" />
      </div>
      <div class="button-container">
        <button @click="cancel">Cancel</button>
        <button @click="confirm">Confirm</button>
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
.visible {
  display: block;
}
.invisible {
  display: none;
}
</style>
