<template>
        <span class="tooltip">
            &#9432;<span class="tooltiptext">{{text}}</span>
        </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'TooltipView',
    components: {
    },
    props: {
        text: String
    }
  
});
</script>

<style scoped lang="scss">
.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 200px;
  max-width: 50vw;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  top: 100%;
  left: -100px;
  white-space: pre-line;

  /* Position the tooltip */
  position: absolute;
  z-index: 1;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}

</style>
