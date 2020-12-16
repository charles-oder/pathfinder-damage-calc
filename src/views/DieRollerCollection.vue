<template>
  <div class="die-roller-collection">
    <div class="group-selector">
      <input
        @change="dataUpdated()"
        v-model="dieCollection.groups[selectedIndex].name"
      />
      <select @change="itemSelected($event.target.selectedIndex)">
        <option
          v-for="(group, index) in dieCollection.groups"
          v-bind:key="index"
          value="{{ index }}"
        >
          {{ group.name }}
        </option>
        <option value="add group">add group</option>
      </select>
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
      console.log("data updated!!!");
      appStore.dieCollection = dieCollection;
    }

    function addRoll() {
      dieCollection.groups[0].dice.push(new DieConfig());
      appStore.dieCollection = dieCollection;
    }

    function deleteRoll(index: number) {
      dieCollection.groups[0].dice.splice(index, 1);
      appStore.dieCollection = dieCollection;
    }

    function itemSelected(index: number) {
      if (index >= dieCollection.groups.length) {
        console.log("add group");
        dieCollection.groups.push(new DieGroup());
        selectedIndex.value = index;
        dataUpdated();
        return;
      }
      selectedIndex.value = index;
      console.log("Selected: " + index);
    }

    return {
      dieCollection,
      dataUpdated,
      addRoll,
      deleteRoll,
      selectedIndex,
      itemSelected
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

select {
  border: none;
  background: red;
  border-radius: 5px;
}
select:focus {
  outline: 0;
}
option {
  background: gray;
}
option:checked {
  background: yellow;
  color: green;
  display: none;
}
</style>
