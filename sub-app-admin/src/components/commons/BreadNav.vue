<template>
  <el-breadcrumb separator=">" class="mb-5">
    <el-breadcrumb-item v-for="(item,index) in matched">{{ item.meta.title }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import {useRouter} from "vue-router";

const router = useRouter();
const matched = router.currentRoute.value.matched

</script>

<style scoped>

</style>