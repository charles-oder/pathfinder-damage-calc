<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
    <div>By the way.... {{ booyah }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeMount, onMounted } from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

export default defineComponent({
  name: 'Home',
  components: {
    HelloWorld,
  },
  setup() {
    const booyah = ref('monkey')
    onBeforeMount(() => {
      console.log('onBeforeMount');
      booyah.value = 'test';
    });
    return {
      booyah
    }
  },
  
});
</script>
