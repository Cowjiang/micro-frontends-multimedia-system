<template>
  <transition name="fade">
    <div
      class="loading-wrapper w-100 h-100 d-flex flex-column justify-center align-center bg-white"
      :style="{zIndex: props.zIndex}"
      v-if="props.modelValue">
      <div class="loading-text text-h6 mb-4 text-grey-darken-1">
        {{ props.loadingText }}
      </div>
      <div class="w-25">
        <v-progress-linear
          :color="props.color ?? 'primary'"
          :stream="true"
          :indeterminate="props.modelValue"
          rounded
          height="10" />
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
  interface Props {
    // 控制加载动画显示状态
    modelValue: boolean;
    // 加载时显示的文字
    loadingText?: string;
    // 加载动画的颜色
    color?: string;
    // position的取值，默认为fixed
    position?: 'relative' | 'absolute' | 'fixed';
    // 进入动画的持续时间
    enterDuration?: string;
    // 离开动画的持续时间
    leaveDuration?: string;
    // z-index的值
    zIndex?: number;
  }

  const props = withDefaults(defineProps<Props>(), {
    loadingText: '正在加载数据，请稍后',
    position: 'absolute',
    enterDuration: '0.5s',
    leaveDuration: '0.5s',
    zIndex: 9999
  });

  const position = ref(props.position); // position的取值
  const enterDuration = ref(props.enterDuration); // position的取值
  const leaveDuration = ref(props.leaveDuration); // position的取值
</script>

<style lang="scss" scoped>
  $position: v-bind(position);
  $enterDuration: v-bind(enterDuration);
  $leaveDuration: v-bind(leaveDuration);

  .loading-wrapper {
    position: $position;
  }

  .loading-wrapper__disabled {
    pointer-events: none;
  }

  .fade-enter-active {
    transition: opacity $enterDuration;
  }

  .fade-leave-active {
    transition: opacity $leaveDuration;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
