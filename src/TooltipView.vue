<template>
    <span class="tooltip-view">
        &#9432;<span class="tooltiptext">{{text}}</span>
    </span>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
    name: 'TooltipView',
    components: {
    },
    props: {
        text: String
    },
    setup() {
        function positionTooltip(tooltip: HTMLElement) {
            const tooltipText = tooltip.querySelector('.tooltiptext');
            if (!(tooltipText instanceof HTMLElement)) {
                return;
            }
            if (!tooltipText) { return; }
            const tooltipRect = tooltipText.getBoundingClientRect();
            let tipX = tooltip.getBoundingClientRect().width;
            let tipY = tooltip.getBoundingClientRect().height;
            tooltipText.style.top = tipY + 'px';
            tooltipText.style.left = tipX + 'px';

            const sourceRect = tooltip.getBoundingClientRect();

            const averageScrollBarWidth = 20;
            if ((sourceRect.x + tooltipRect.width) > window.innerWidth - averageScrollBarWidth) {
                tipX = -tooltipRect.width;
            }
            if (sourceRect.y + tooltipRect.height >  window.innerHeight - averageScrollBarWidth) {
                tipY = -tooltipRect.height;
            }
            if ((sourceRect.x + tipX) < 10) {
                tipX = -sourceRect.x + 10;
            }
            if ((sourceRect.y + tipY) < 10) {
                tipY = -sourceRect.y + 10;
            }

            tooltipText.style.top = tipY + 'px';
            tooltipText.style.left = tipX + 'px';
        }
        onMounted(() => {
            const tooltips = document.querySelectorAll('.tooltip-view');
            tooltips.forEach((tooltip) => {
                tooltip.addEventListener('mouseover', () => {
                    if (tooltip instanceof HTMLElement) {
                        positionTooltip(tooltip);
                    }
                });
            });
        });
    }
  
});
</script>

<style scoped lang="scss">
.tooltip-view {
  position: relative;
  display: inline-block;
}

.tooltip-view .tooltiptext {
  visibility: hidden;
  width: 300px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  white-space: pre-line;

  /* Position the tooltip */
  position: absolute;
  z-index: 1;
}

.tooltip-view:hover .tooltiptext {
  visibility: visible;
}

</style>
