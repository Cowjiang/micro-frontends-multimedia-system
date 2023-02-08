<template>
  <v-snackbar
    v-model="props.modelValue"
    color="transparent"
    rounded="lg"
    variant="flat"
    location="top center"
    position="absolute"
    attach
    width="unset"
    max-width="unset"
    min-height="unset"
    content-class="my-1"
    :timeout="2000"
    @update:modelValue="emit('update:modelValue', false)"
  >
    <v-alert
      v-model="props.modelValue"
      :type="props.type"
      density="compact"
      rounded="lg"
    >
      {{ props.text }}
    </v-alert>
  </v-snackbar>
</template>

<script setup lang="ts">
  import { AlertType } from '@/views/login/components/typings';

  interface Props {
    modelValue: boolean;
    text: string;
    type: AlertType;
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    text: '',
    type: 'info'
  });
  const emit = defineEmits(['update:modelValue']);
</script>

<style scoped lang="scss">

</style>
