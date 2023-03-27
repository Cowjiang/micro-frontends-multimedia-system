<template>
  <div class="layout-box">
    <el-container style="flex: 1">
      <el-aside class="aside">
        <!--      左侧边导航栏-->
        <LeftNav/>
      </el-aside>

      <el-main class="flex-1 p-0">
        <el-container>
          <el-header class="shadow bg-white">
            <div class="flex items-center 2xl:pl-10 h-full font-serif font-bold ">
              <span class="text-2xl pt-2 pb-2 pl-5 pr-5 rounded text-white bg-indigo-900">ShiTu-KJ 食途科技</span>
              <span class="ml-4">当前用户：{{ currentUserInfo.username }}</span>
            </div>
          </el-header>
          <el-main class="bg-gray-100">
            <div class="p-1">
              <div>
                <router-view/>
              </div>
            </div>
          </el-main>
        </el-container>
      </el-main>
    </el-container>

  </div>
</template>

<script setup>
import LeftNav from "@/components/commons/LeftNav.vue";
import HeaderBar from "@/components/commons/HeaderBar.vue"
import {watch} from "vue";

import {onMounted, ref} from "vue";
import {getCurrentUserInfo} from "@/utils/http/apis/user/user";
import {useRouter} from "vue-router";

const router = useRouter();
const currentUserInfo = ref({})
onMounted(() => {
  getCurrentUserInfo().then(res => {
    if (res.success) {
      currentUserInfo.value.username = res.data.username
    }
  })
})


</script>

<style lang="scss" scoped>
.el-header {
  padding: 0;
}

.el-aside {
  width: auto;
}

.layout-box {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

</style>