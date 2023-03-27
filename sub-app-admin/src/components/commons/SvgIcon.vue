<template>
  <svg aria-hidden="true" :class="svgClass" stroke-width="20">
    <use :xlink:href="symbolId" :fill="color"/>
  </svg>
</template>

<script>
import {defineComponent, computed} from 'vue';

export default defineComponent({
  name: 'SvgIcon',
  props: {
    prefix: {
      type: String,
      default: 'icon',
    },
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: '#333',
    },
    className: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const symbolId = computed(() => `#${props.prefix}-${props.name}`);
    const svgClass = computed(() => {
      if (props.className) {
        return 'svg-icon ' + props.className
      } else {
        return 'svg-icon'
      }
    })
    return {symbolId, svgClass};
  },
});
</script>
<style lang="scss" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;

}

.s-1 {
  width: 0.5em;
  height: 0.5em;
}

.s-2 {
  width: 1.5em;
  height: 1.5em;
}

.s-3 {
  width: 2em;
  height: 2em;
}
</style>