<template>
  <div class=" p-6  rounded-2xl shadow-lg bg-white relative" style="min-height: 85vh;padding-bottom:50px" id="panel">
    <BreadNav/>
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
      <el-table-column prop="id" label="id"/>
      <el-table-column prop="realName" label="真实姓名"/>
      <el-table-column prop="phone" label="联系方式"/>
      <el-table-column label="申请时间">
        <template #default="props">
          {{ formatTime(props.row.createdTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="props">
          <el-button type="primary" @click="checkStore(props.$index)">审核</el-button>
          <el-button typeof="primary" :disabled="props.row.stat!==1" @click="passStore(props.row.id)">
            {{ props.row.stat === 1 ? "通过" : "已通过" }}
          </el-button>
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
    <el-drawer v-model="showDrawer" title="相关证件" :lock-scroll="false">
      <el-scrollbar height="600px">
        <div class="p-5 pt-0">
          <div class="font-bold mb-3 pb-2 border-b-2">营业执照</div>
          <el-image
              style="width: 400px;"
              :src="tableData[currentIndex].businessLicense"
              :preview-src-list="[tableData[currentIndex].businessLicense]"
              fit="contain"
          ></el-image>
        </div>

        <div class="p-5 pt-0">
          <div class="font-bold mb-3 pb-2 border-b-2">身份证(背面)</div>
          <el-image
              style="width: 400px; "
              :src="tableData[currentIndex].idCardBack"
              :preview-src-list="[tableData[currentIndex].idCardBack]"

              fit="contain"
          ></el-image>
        </div>
        <div class="p-5 pt-0">
          <div class="font-bold mb-3 pb-2 border-b-2">身份证(正面)</div>
          <el-image
              style="width: 400px"
              :src="tableData[currentIndex].idCardFront"
              :preview-src-list="[tableData[currentIndex].idCardFront]"

              fit="contain"
          ></el-image>
        </div>

        <div class="p-5 pt-0">
          <div class="font-bold mb-3 pb-2 border-b-2">许可证</div>
          <el-image
              style="width: 400px"
              :src="tableData[currentIndex].license"
              :preview-src-list="[tableData[currentIndex].license]"
              fit="contain"
          ></el-image>
        </div>

      </el-scrollbar>


    </el-drawer>
  </div>
</template>
<script setup>

import {onMounted, ref} from "vue";
import {getStoreArchives, postStoreArchives} from "@/utils/http/apis/store/storeApply";
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
  getStoreArchives(keyWords.value, 8, currentPage.value,).then(res => {
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
const formatTime = (time) => moment(time).format("yyyy-DD-MM hh:mm:ss")
const currentIndex = ref(0)
const showDrawer = ref(false)
const checkStore = (index) => {
  currentIndex.value = index
  showDrawer.value = true
}
const passStore = (id) => {
  postStoreArchives(id).then(res => {
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
.el-drawer__body {

  overflow: scroll;
}
</style>