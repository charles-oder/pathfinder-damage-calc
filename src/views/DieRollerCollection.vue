<template>
  <div class="die-roller-collection">
    <TabSelector
      :options="dieCollection.groups.map(group => group.name)"
      :selectedIndex="selectedIndex"
      v-on:option-clicked="itemSelected"
      v-on:rename-clicked="renameGroup"
      v-on:copy-clicked="cloneGroup"
      v-on:delete-clicked="deleteGroup"
      v-on:add-clicked="createNewGroup"
    />
    <DieRoller
      v-for="(die, index) in dieCollection.groups[selectedIndex].dice"
      v-bind:key="index"
      v-model:name="die.name"
      v-model:dieString="die.dieString"
      v-on:data-updated="dataUpdated()"
      v-on:delete-roll="deleteRoll(index)"
      class="die-roller"
    />
    <button @click="addRoll()" class="add-button">+</button>
    <div id="test-modal"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import DieRoller from "@/views/DieRoller.vue";
import AppStorage from "@/storage";
import { DieConfig, DieGroup } from "@/config/die-config";
import TabSelector from "@/views/TabSelector.vue";
import NameSelectionModal from "@/modal/NameSelectionModal";
import ConfirmationModal from "@/modal/ConfirmationModal";

export default defineComponent({
  name: "DieRollerCollection",
  components: {
    DieRoller,
    TabSelector
  },
  setup() {
    const appStore = new AppStorage();
    const dieCollection = reactive(appStore.dieCollection);
    const selectedIndex = ref(0);
    const isNameChangeVisible = ref(false);
    const pendingNameChange = ref("");
    let pendingModIndex = -1;

    function dataUpdated() {
      appStore.dieCollection = dieCollection;
    }

    function addRoll() {
      dieCollection.groups[selectedIndex.value].dice.push(new DieConfig());
      appStore.dieCollection = dieCollection;
    }

    function deleteRollCallback(confirm: boolean) {
      if (!confirm) {
        return;
      }
      dieCollection.groups[selectedIndex.value].dice.splice(pendingModIndex, 1);

      dataUpdated();
    }

    function deleteRoll(index: number) {
      pendingModIndex = index;
      const name = dieCollection.groups[selectedIndex.value].dice[index].name;
      const msg = "Delete Roll: " + name + "?";
      ConfirmationModal.show(msg, deleteRollCallback);
    }

    function createNewGroupCallback(name: string | null) {
      if (!name) {
        return;
      }
      const group = new DieGroup();
      group.name = name;
      dieCollection.groups.push(group);
      selectedIndex.value = 0;
      dataUpdated();
    }
    function createNewGroup() {
      NameSelectionModal.show("New Group", createNewGroupCallback);
    }

    function deleteGroupCallback(confirm: boolean) {
      if (!confirm) {
        return;
      }
      dieCollection.groups.splice(pendingModIndex, 1);
      if (dieCollection.groups.length == 0) {
        dieCollection.groups.push(new DieGroup());
      }
      if (selectedIndex.value >= pendingModIndex) {
        selectedIndex.value = selectedIndex.value - 1;
      }
      if (selectedIndex.value < 0) {
        selectedIndex.value = 0;
      }

      dataUpdated();
    }

    function deleteGroup(index: number = selectedIndex.value) {
      const name = dieCollection.groups[index].name;
      const msg = "Delete group: " + name + "?";
      pendingModIndex = index;
      ConfirmationModal.show(msg, deleteGroupCallback);
    }

    function cloneGroup(index: number = selectedIndex.value) {
      const currentGroup = dieCollection.groups[index];
      const copyJson = JSON.stringify(currentGroup);
      const clonedGroup = DieGroup.fromJson(copyJson);
      clonedGroup.name = clonedGroup.name + " copy";
      dieCollection.groups.unshift(clonedGroup);
      selectedIndex.value = 0;
      dataUpdated();
    }

    function reanameGroupCallback(name: string | null) {
      if (!name) {
        return;
      }
      const group = dieCollection.groups[pendingModIndex];
      group.name = name;
      dataUpdated();
    }

    function renameGroup(index: number) {
      const group = dieCollection.groups[index];
      pendingModIndex = index;
      NameSelectionModal.show(group.name, reanameGroupCallback);
    }

    function itemSelected(index: number) {
      if (index === dieCollection.groups.length) {
        createNewGroup();
      } else if (index === dieCollection.groups.length + 1) {
        cloneGroup();
      } else if (index === dieCollection.groups.length + 2) {
        deleteGroup();
      } else {
        selectedIndex.value = index;
      }
    }

    return {
      dieCollection,
      dataUpdated,
      addRoll,
      deleteRoll,
      selectedIndex,
      itemSelected,
      cloneGroup,
      createNewGroup,
      deleteGroup,
      renameGroup,
      pendingNameChange,
      isNameChangeVisible
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
