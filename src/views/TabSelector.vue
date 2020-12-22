<template>
  <div class="tab-selector">
    <div
      v-for="(option, index) in options"
      v-bind:key="index"
      v-bind:class="['tab', selectedIndex === index ? 'selected' : '']"
      @contextmenu.prevent="showMenu(index)"
      @click="optionClicked(index)"
    >
      {{ option }}
      <div
        v-bind:class="[
          'context-menu',
          openContextMenu === index ? 'visible' : 'invisible'
        ]"
      >
        <div class="menu-option" @click="renameIndex(index)">Rename</div>
        <div class="menu-option" @click="copyIndex(index)">Copy</div>
        <div class="menu-option" @click="deleteIndex(index)">Delete</div>
      </div>
    </div>
    <div class="tab" @click="addGroup()">+</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "TabSelector",
  components: {},
  props: {
    options: Array,
    index: Number,
    selectedIndex: Number
  },
  setup(props, { emit }) {
    const openContextMenu = ref(-1);
    function optionClicked(index: number) {
      openContextMenu.value = -1;
      emit("option-clicked", index);
    }
    function showMenu(index: number) {
      if (openContextMenu.value === index) {
        openContextMenu.value = -1;
      } else {
        openContextMenu.value = index;
      }
    }
    function renameIndex(index: number) {
      openContextMenu.value = -1;
      emit("rename-clicked", index);
    }
    function copyIndex(index: number) {
      openContextMenu.value = -1;
      emit("copy-clicked", index);
    }
    function deleteIndex(index: number) {
      openContextMenu.value = -1;
      emit("delete-clicked", index);
    }
    function addGroup() {
      openContextMenu.value = -1;
      emit("add-clicked");
    }
    return {
      optionClicked,
      showMenu,
      openContextMenu,
      renameIndex,
      copyIndex,
      deleteIndex,
      addGroup
    };
  }
});
</script>

<style scoped lang="scss">
.tab-selector {
  position: relative;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  cursor: pointer;
}
.tab {
  position: relative;
  background: #6279b8;
  color: white;
  font-weight: bold;
  margin: 2px 2px;
  display: inline-block;
  padding: 5px 10px;
}
.context-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1;
  background: #8191be;
  width: max(100%, 85px);
}
.menu-option {
  padding: 5px 5px;
}

.visible {
  display: block;
}

.invisible {
  display: none;
}
.selected {
  background: #1e47b9;
}
</style>
