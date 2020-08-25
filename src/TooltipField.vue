<template>
    <span class="tooltip-field">
        <input v-bind:style="{width: fieldWidth ?? '10em'}" v-model="fieldValue"/><span class="tooltiptext">{{tooltip}}</span>
    </span>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue';

export default defineComponent({
    name: 'TooltipField',
    components: {
    },
    props: {
        value: String,
        tooltip: String,
        fieldWidth: String
    },
    setup(props, { emit }) {
        const fieldValue = computed({
            get: () => props.value ?? '',
            set: (value) => emit('update:value', value)
        });

        const tooltipWidth = 300;

        function positionTooltip(tooltip: HTMLElement) {
            const tooltipText = tooltip.querySelector('.tooltiptext');
            if (!(tooltipText instanceof HTMLElement)) {
                return;
            }
            if (!tooltipText) { return; }
            const tooltipRect = tooltipText.getBoundingClientRect();
            let tipX = tooltip.getBoundingClientRect().width;
            let tipY = tooltip.getBoundingClientRect().height;

            const sourceRect = tooltip.getBoundingClientRect();

            const averageScrollBarWidth = 20;
            if ((sourceRect.x + tooltipWidth + sourceRect.width) > window.innerWidth - averageScrollBarWidth) {
                tipX = -tooltipRect.width;
            }
            if (sourceRect.y + tooltipRect.height + sourceRect.height >  window.innerHeight - averageScrollBarWidth) {
                tipY = -tooltipRect.height;
            }
            if ((sourceRect.x + tipX) < 10) {
                tipX = -sourceRect.x + 10;
            }
            if ((sourceRect.y + tipY) < 10) {
                tipY = -sourceRect.y + 10;
            }

            tooltipText.style.left = tipX + 'px';
            tooltipText.style.top = tipY + 'px';
            tooltipText.style.width = tooltipWidth + 'px';
        }
        onMounted(() => {
            const tooltips = document.querySelectorAll('.tooltip-field');
            tooltips.forEach((tooltip) => {
                tooltip.addEventListener('mouseover', () => {
                    if (tooltip instanceof HTMLElement) {
                        positionTooltip(tooltip);
                    }
                });
            });
        });
        return {
            fieldValue
        }
    }
  
});
</script>

<style scoped lang="scss">
.tooltip-field {
  position: relative;
  display: inline-block;
}

.tooltip-field .tooltiptext {
  position: absolute;
  z-index: 1;
  top: 100%;
  left: 0px;
  visibility: hidden;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  white-space: pre-line;
}

.tooltip-field:hover .tooltiptext {
  visibility: visible;
}

</style>
