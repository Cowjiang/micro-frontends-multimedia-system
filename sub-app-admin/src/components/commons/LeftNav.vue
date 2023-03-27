<template>
  <el-menu router :collapse="isCollapse" active-text-color="#6366F1" class="border-r-2 h-full el-menu-vertical">
    <div class=" text-center text-4xl pt-3 pb-3 bg-indigo-900 shadow-inner " style="height: 60px">
      <div class=" cursor-pointer flex flex-col justify-center" @click="changeCollapse()"
           style="height: 100%">
      <span class="text-center inline-block p-1 collapse-icon">
        <svg-icon
            :name="isCollapse?'arrow-circle-right':'arrow-circle-left'" className="m-auto text-indigo-100"/></span>
      </div>

    </div>
    <el-sub-menu v-for="(sub,index) in customRoutes" :key="sub.name" :index="index">
      <template #title>
        <SvgIcon :name="sub.meta.icon" className="s-2 text-indigo-900 "></SvgIcon>
        <span class="ml-2 text-base font-bold">{{ sub.meta.title }}</span>
      </template>
      <el-menu-item v-for="item in sub.children" :index="item.path" v-show="!item.hide">
        <SvgIcon :name="item.meta.icon" className="text-indigo-900"></SvgIcon>
        <span class="ml-2 font-bold">{{ item.meta.title }}</span>
      </el-menu-item>

    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import {ref} from 'vue'
import {routes} from "@/router";

let isCollapse = ref(false)
let changeCollapse = () => {
  isCollapse.value = !isCollapse.value
}

let customRoutes = routes[1].children
</script>

<style lang="scss" scoped>
.outer-box {
  border-right: none;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

</style>