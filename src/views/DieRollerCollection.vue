<template>
  <div class="die-roller-collection">
    <DieRoller
      v-for="(die, index) in dieCollection.dice"
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
import { defineComponent, reactive } from "vue";
import DieRoller from "@/views/DieRoller.vue";
import AppStorage from "@/storage";
import { DieConfig } from "@/config/die-config";

export default defineComponent({
  name: "DieRollerCollection",
  components: {
    DieRoller
  },
  setup() {
    const appStore = new AppStorage();
    const dieCollection = reactive(appStore.dieCollection);

    function dataUpdated() {
      console.log("data updated!!!");
      appStore.dieCollection = dieCollection;
    }

    function addRoll() {
      dieCollection.dice?.push(DieConfig.default);
      appStore.dieCollection = dieCollection;
    }

    function deleteRoll(index: number) {
      dieCollection.dice?.splice(index, 1);
      appStore.dieCollection = dieCollection;
    }

    return {
      dieCollection,
      dataUpdated,
      addRoll,
      deleteRoll
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
</style>
