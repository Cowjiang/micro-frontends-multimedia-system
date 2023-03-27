<template>
  <div class=" p-6  rounded-2xl shadow-lg bg-white relative" style="min-height: 85vh;padding-bottom:50px" id="panel">
    <BreadNav/>cc
    <!--  顶部搜索-->
    <el-row class="mb-3" :gutter="12">
      <el-col :span="8">
        <el-input
            clearable
            placeholder="请输入内容"
            v-model="keyWords">
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button @click="getData" type="primary">
          搜索
        </el-button>
      </el-col>
    </el-row>
    <!--表格-->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="expand">
        <template #default="props">
          <el-image
              class="p-2 shadow-md pl-0 ml-4"
              v-for="(item,index) in props.row.dynamicImages"
              :key="index"
              style="width: 150px; height: 150px"
              :src="item.imgUrl"
              :preview-src-list="item.imgUrl"
          >

          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="动态id" width="100"/>
      <el-table-column prop="userInfo.username" label="发布用户"/>
      <el-table-column prop="content" label="内容" :show-overflow-tooltip="true"/>
      <el-table-column prop="createdTime" label="发布时间">
        <template #default="props">
          {{ formatTime(props.row.createdTime) }}
        </template>
      </el-table-column>
      <el-table-column label="是否上架" align="center">
        <template #default="props">
          <el-switch v-model="props.row.isDeleted" @change="changeSwitch(props.row.id,props.row.isDeleted)"
                     inactive-color="#13ce66" active-color="#ff4949"/>

        </template>

      </el-table-column>
    </el-table>


    <div class="absolute bottom-3 right-6">
      <el-pagination
          v-model:currentPage="currentPage"
          :page-size="8"
          layout="prev, pager, next, jumper"
          :total="total"
          @current-change="getData"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {getDynamics, putDynamic} from "@/utils/http/apis/dynamic/dynamic";
import {getRequestPaths} from "@/utils/http/apis/security/requestPath";
import moment from "moment";
import {ElMessage} from "element-plus";
import BreadNav from "@/components/commons/BreadNav.vue";
const tableData = ref([])
// 搜搜关键词
const keyWords = ref('')
// 分页当前页数s
const currentPage = ref(1)
// 分页总条数
const total = ref(0)
const getData = () => {
  getDynamics(currentPage.value, 8, keyWords.value).then(res => {
    if (res.success) {
      tableData.value = res.data.records
      currentPage.value = res.data.current
      total.value = res.data.total
    }
  })
}
onMounted(() => {
  getData()
})
const formatTime = (time) => {
  return moment(time).format("yyyy-MM-DD hh:mm:ss")
}
const changeSwitch = (id, isDeleted) => {
  putDynamic({
    id,
    isDeleted
  }).then(res => {
    if (res.success) {
      ElMessage({
        type: "success",
        message: "操作完成",
        duration: 1000
      })
    }
  })
}


</script>

<style scoped>

</style>