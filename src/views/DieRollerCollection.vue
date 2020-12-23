<template>
  <div class="die-roller-collection">
    <TabSelector
      :key="showTabs"
      v-model:options="groups"
      :selectedIndex="selectedIndex"
      v-on:option-clicked="itemSelected"
      v-on:rename-clicked="renameGroup"
      v-on:copy-clicked="cloneGroup"
      v-on:delete-clicked="deleteGroup"
      v-on:add-clicked="createNewGroup"
      v-on:move-left="moveGroupLeft"
      v-on:move-right="moveGroupRight"
    />
    <div :key="showTabs">
      <VueDraggableNext v-model="dice" @dragend="forceRedraw">
        <transition-group>
          <DieRoller
            v-for="(die, index) in dice"
            v-bind:key="index"
            v-model:name="die.name"
            v-model:dieString="die.dieString"
            v-on:data-updated="(name, die) => dieNameUpdated(name, die, index)"
            v-on:delete-roll="deleteRoll(index)"
            class="die-roller"
          />
        </transition-group>
      </VueDraggableNext>
      <button @click="addRoll()" class="add-button">+</button>
    </div>
    <div id="test-modal"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, ref, watch } from "vue";
import DieRoller from "@/views/DieRoller.vue";
import AppStorage from "@/storage";
import { DieCollectionConfig, DieConfig, DieGroup } from "@/config/die-config";
import TabSelector from "@/views/TabSelector.vue";
import NameSelectionModal from "@/modal/NameSelectionModal";
import ConfirmationModal from "@/modal/ConfirmationModal";
import { VueDraggableNext } from "vue-draggable-next";

export default defineComponent({
  name: "DieRollerCollection",
  components: {
    DieRoller,
    TabSelector,
    VueDraggableNext
  },
  setup() {
    const appStore = new AppStorage();
    const selectedIndex = ref(0);
    const showTabs = ref(true);
    const pendingNameChange = ref("");
    let pendingModIndex = -1;
    const dieCollection = computed({
      get: () => appStore.dieCollection,
      set: value => {
        appStore.dieCollection = value;
      }
    });
    const groups = computed({
      get: () => appStore.dieCollection.groups,
      set: value => {
        const names = JSON.stringify(value.map(obj => obj.name));
        const collection = dieCollection.value;
        collection.groups = value;
        dieCollection.value = collection;
      }
    });
    const dice = computed({
      get: () => {
        const index = selectedIndex.value;
        if (index < 0 || index >= groups.value.length) {
          return [];
        }
        return groups.value[index].dice;
      },
      set: value => {
        const list = groups.value;
        list[selectedIndex.value].dice = value;
        groups.value = list;
      }
    });

    function dieNameUpdated(name: string, die: string, index: number) {
      const list = dice.value;
      const dieConfig = new DieConfig();
      dieConfig.name = name;
      dieConfig.dieString = die;
      list[index].name = name;
      list[index].dieString = die;
      dice.value = list;
    }

    function forceRedraw() {
      console.log("Force Update");
      const index = selectedIndex.value;
      selectedIndex.value = -1;

      setTimeout(() => (showTabs.value = !showTabs.value), 1);
      setTimeout(() => (selectedIndex.value = index), 1);
    }

    function addRoll() {
      const newDie = new DieConfig();
      const list = dice.value;
      list.push(newDie);
      dice.value = list;
      forceRedraw();
    }

    function deleteRollCallback(confirm: boolean) {
      if (!confirm) {
        return;
      }
      const list = dice.value;
      list.splice(pendingModIndex, 1);
      dice.value = list;
      forceRedraw();
    }

    function deleteRoll(index: number) {
      pendingModIndex = index;
      const name = dice.value[index].name;
      const msg = "Delete Roll: " + name + "?";
      ConfirmationModal.show(msg, deleteRollCallback);
    }

    function createNewGroupCallback(name: string | null) {
      if (!name) {
        return;
      }
      const group = new DieGroup();
      group.name = name;
      const list = groups.value;
      list.push(group);
      groups.value = list;
      selectedIndex.value = list.length - 1;
      forceRedraw();
    }
    function createNewGroup() {
      NameSelectionModal.show("New Group", createNewGroupCallback);
    }

    function moveGroupLeft(index: number) {
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
      if (selectedIndex.value === index) {
        selectedIndex.value--;
      } else if (selectedIndex.value === index - 1) {
        selectedIndex.value++;
      }
      forceRedraw();
    }

    function moveGroupRight(index: number) {
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
      if (selectedIndex.value === index) {
        selectedIndex.value++;
      } else if (selectedIndex.value === index + 1) {
        selectedIndex.value--;
      }
      forceRedraw();
    }

    function deleteGroupCallback(confirm: boolean) {
      if (!confirm) {
        return;
      }
      const list = groups.value;
      list.splice(pendingModIndex, 1);
      groups.value = list;
      if (groups.value.length == 0) {
        groups.value.push(new DieGroup());
      }
      if (selectedIndex.value >= pendingModIndex) {
        selectedIndex.value = selectedIndex.value - 1;
      }
      if (selectedIndex.value < 0) {
        selectedIndex.value = 0;
      }
      forceRedraw();
    }

    function deleteGroup(index: number = selectedIndex.value) {
      const name = groups.value[index].name;
      const msg = "Delete group: " + name + "?";
      pendingModIndex = index;
      ConfirmationModal.show(msg, deleteGroupCallback);
    }

    function cloneGroup(index: number = selectedIndex.value) {
      const currentGroup = groups.value[index];
      const copyJson = JSON.stringify(currentGroup);
      const clonedGroup = DieGroup.fromJson(copyJson);
      clonedGroup.name = clonedGroup.name + " copy";
      const list = groups.value;
      list.push(clonedGroup);
      groups.value = list;
      selectedIndex.value = list.length - 1;
      forceRedraw();
    }

    function reanameGroupCallback(name: string | null) {
      if (!name) {
        return;
      }
      const list = groups.value;
      const group = list[pendingModIndex];
      group.name = name;
      groups.value = JSON.parse(JSON.stringify(list));
      forceRedraw();
    }

    function renameGroup(index: number) {
      const group = groups.value[index];
      pendingModIndex = index;
      NameSelectionModal.show(group.name, reanameGroupCallback);
    }

    function itemSelected(index: number) {
      if (index === groups.value.length) {
        createNewGroup();
      } else if (index === groups.value.length + 1) {
        cloneGroup();
      } else if (index === groups.value.length + 2) {
        deleteGroup();
      } else {
        selectedIndex.value = index;
      }
    }

    return {
      dieNameUpdated,
      addRoll,
      deleteRoll,
      selectedIndex,
      itemSelected,
      cloneGroup,
      createNewGroup,
      deleteGroup,
      renameGroup,
      groups,
      dice,
      pendingNameChange,
      showTabs,
      moveGroupLeft,
      moveGroupRight,
      forceRedraw
    };
  }
});
</script>

<style scoped lang="scss">
.die-roller-collection {
  width: 100%;
  margin: 0;
}
.die-roller {
  float: left;
  margin: 5px 10px;
  width: 300px;
  height: 120px;
}
.add-button {
  background: #6279b8;
  border: none;
  color: white;
  float: left;
  margin: 5px 10px;
  border-radius: 5px;
  box-shadow: 5px 5px 5px gray;
  width: 120px;
  height: 120px;
  font-size: 100px;
}
.add-button:focus {
  outline: 0;
}

@media only screen and (max-width: 980px) {
  .die-roller {
    width: 30%;
  }
}

@media only screen and (max-width: 660px) {
  .die-roller {
    position: relative;
    float: none;
    margin: 0 auto 10px auto;
    width: 90%;
  }
  .add-button {
    position: relative;
    float: none;
    margin: 0 auto 10px auto;
    width: 90%;
  }
}

.group-selector {
  position: relative;
  margin: 0 auto 10px auto;
  width: 300px;
  height: 1.9em;
  border: 1px solid gray;
}
.group-selector > input {
  position: absolute;
  left: 0;
  top: 0;
  border: none;
  font-size: 1.5em;
  width: calc(100% - 25px);
}

.group-selector > input:focus {
  outline: 0;
}

select {
  position: absolute;
  right: 0;
  width: 100%;
  border: none;
  background: white;
  border-radius: 5px;
  font-size: 1.5em;
}
select:focus {
  outline: 0;
}
option {
  background: white;
}
option:checked {
  color: green;
  display: none;
}
.group-management-panel {
  width: 300px;
  height: 25px;
  margin: 0 auto 10px auto;
}
.group-management-panel > button {
  background: #6279b8;
  border: none;
  margin: 5px;
  width: 90px;
  height: 25px;
  font-weight: bold;
  color: white;
}
button:focus {
  outline: 0;
}
</style>
