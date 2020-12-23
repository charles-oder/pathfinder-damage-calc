<template>
  <div class="tab-selector">
    <div
      v-for="(option, index) in groups"
      v-bind:key="index"
      v-bind:class="['tab', selectedIndex === index ? 'selected' : '']"
    >
      {{ option.name }}
      <div
        class="selection-button"
        @contextmenu.prevent="showMenu(index)"
        @click="optionClicked(index)"
      ></div>
      <div
        v-bind:class="[
          'context-menu',
          openContextMenu === index ? 'visible' : 'invisible'
        ]"
      >
        <div class="menu-option">
          <span class="caret left" v-if="index > 0"></span>
          <span> Move </span>
          <span class="caret right" v-if="index < groups.length - 1"></span>
          <span
            v-if="index > 0"
            class="move-option left"
            @click="moveLeft(index)"
          >
          </span>
          <span
            v-if="index < groups.length - 1"
            class="move-option right"
            @click="moveRight(index)"
          >
          </span>
        </div>
        <div class="menu-option" @click="renameIndex(index)">Rename</div>
        <div class="menu-option" @click="copyIndex(index)">Copy</div>
        <div class="menu-option" @click="deleteIndex(index)">Delete</div>
      </div>
    </div>
    <div class="tab" @click="addGroup()">+</div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";

export default defineComponent({
  name: "TabSelector",
  components: {},
  props: {
    options: Array,
    index: Number,
    selectedIndex: Number
  },
  setup(props, { emit }) {
    const groups = computed({
      get: () => props.options,
      set: value => {
        console.log("groups updated in tab bar");
        emit("update:options", value);
      }
    });
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
    function moveLeft(index: number) {
      console.log("move left: " + index);
      if (index === 0) {
        return;
      }
      const list = groups.value ?? [];
      const group = list[index];
      if (group) {
        list?.splice(index, 1);
        list?.splice(index - 1, 0, group);
        groups.value = list;
      }
    }
    function moveRight(index: number) {
      if (index >= (groups.value?.length ?? 0) - 1) {
        return;
      }
      const list = groups.value ?? [];
      const group = list[index];
      if (group) {
        list?.splice(index, 1);
        list?.splice(index + 1, 0, group);
        groups.value = list;
      }
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
      addGroup,
      groups,
      moveLeft,
      moveRight
    };
  }
});
</script>

<style scoped lang="scss">
.tab-selector {
  position: relative;
  width: 100%;
  display: flex;
  flex-flow: row wrap-reverse;
  cursor: pointer;
  border-bottom: 2px solid #6279b8;
}
.tab {
  position: relative;
  background: #6279b8;
  color: white;
  font-weight: bold;
  margin: 2px 5px 0 0;
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
.selection-button {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
}
.menu-option {
  position: relative;
  height: 1em;
  padding: 5px 5px;
}

.carat {
  top: 50%;
  transform: translateY(-50%);
}

.move-option {
  position: absolute;
  width: 50%;
  height: 100%;
}

.left {
  position: absolute;
  top: 0;
  left: 0;
}

.right {
  position: absolute;
  top: 0;
  right: 0;
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
.caret {
  width: 0;
  height: 0;
  transform: translateY(5px);
  display: inline-block;
  border: 8px solid transparent;
}
.caret.right {
  border-left-color: white;
}
.caret.left {
  border-right-color: white;
}
</style>
