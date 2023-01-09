<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup lang="ts">
  import router from '@/router';

  window.$wujie?.bus.$on('vite-router-change', (path: string) => router.push(path));

  // onMounted(() => {
  //   window.$wujie?.bus.$on('vite-router-change', (path: string) => router.push(path));
  // });
</script>

<style lang="scss">
  @import "@/common/styles/index.scss";
  @import "@/common/styles/fontawesome.css";
  @include scrollbar-default;
</style>
