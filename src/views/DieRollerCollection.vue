<template>
  <div class="die-roller-collection">
    <div class="group-selector">
      <select @change="itemSelected($event.target.selectedIndex)">
        <option
          v-for="(group, index) in dieCollection.groups"
          v-bind:key="index"
          value="{{ index }}"
        >
          {{ group.name }}
        </option>
      </select>
      <input
        @change="dataUpdated()"
        v-model="dieCollection.groups[selectedIndex].name"
      />
    </div>
    <div class="group-management-panel">
      <button @click="createNewGroup()">NEW</button>
      <button @click="cloneGroup()">COPY</button>
      <button @click="deleteGroup()">DELETE</button>
    </div>
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
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import DieRoller from "@/views/DieRoller.vue";
import AppStorage from "@/storage";
import { DieConfig, DieGroup } from "@/config/die-config";

export default defineComponent({
  name: "DieRollerCollection",
  components: {
    DieRoller
  },
  setup() {
    const appStore = new AppStorage();
    const dieCollection = reactive(appStore.dieCollection);
    const selectedIndex = ref(0);

    function dataUpdated() {
      appStore.dieCollection = dieCollection;
    }

    function addRoll() {
      dieCollection.groups[selectedIndex.value].dice.push(new DieConfig());
      appStore.dieCollection = dieCollection;
    }

    function deleteRoll(index: number) {
      const name = dieCollection.groups[selectedIndex.value].dice[index].name;
      if (!confirm("Delete " + name + "?")) {
        return;
      }
      dieCollection.groups[selectedIndex.value].dice.splice(index, 1);
      appStore.dieCollection = dieCollection;
    }

    function createNewGroup() {
      dieCollection.groups.unshift(new DieGroup());
      selectedIndex.value = 0;
      dataUpdated();
    }

    function deleteGroup() {
      const name = dieCollection.groups[selectedIndex.value].name;
      if (!confirm("Delete " + name + "?")) {
        return;
      }
      dieCollection.groups.splice(selectedIndex.value, 1);
      if (dieCollection.groups.length == 0) {
        dieCollection.groups.push(new DieGroup());
      }
      selectedIndex.value = 0;
      dataUpdated();
    }

    function cloneGroup() {
      const currentGroup = dieCollection.groups[selectedIndex.value];
      const copyJson = JSON.stringify(currentGroup);
      const clonedGroup = DieGroup.fromJson(copyJson);
      clonedGroup.name = clonedGroup.name + " copy";
      dieCollection.groups.unshift(clonedGroup);
      selectedIndex.value = 0;
      dataUpdated();
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
      deleteGroup
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
