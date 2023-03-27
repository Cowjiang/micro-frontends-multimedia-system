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
        <el-input placeholder="店铺id" v-model="storeId" type="number"/>
      </el-col>
      <el-col :span="4">
        <el-button @click="getData" type="primary">
          搜索
        </el-button>
      </el-col>
    </el-row>
    <!--表格-->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="printerId" label="打印机id" show-overflow-tooltip/>
      <el-table-column prop="sn" label="打印机编号"/>
      <el-table-column prop="printerKey" label="打印机key"/>
      <el-table-column prop="storeId" label="店铺id"/>
      <el-table-column prop="storeName" label="店铺名称"/>

      <el-table-column label="状态">
        <template #default="scope">
          <el-button v-if="scope.row.status===undefined"
                     @click="toGetPrinterStatus(scope.row.printerId,scope.row)">查询
          </el-button>
          <el-tag v-else>{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="toDelStorePrinter(scope.row.printerId)">删除</el-button>
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
import {delStorePrinter, getStorePrinter, getStorePrinterStatus} from "@/utils/http/apis/store/storePrinter";

import {onMounted, ref} from "vue";
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";

// 从路由获取默认storeid
const router = useRouter();
const storeIdFromRouter = router.currentRoute.value.query.storeId


// 搜搜关键词
const keyWords = ref('')
const storeId = ref(null)

const tableData = ref([])
// 分页总条数
const total = ref(0)
// 分页当前页数s
const currentPage = ref(1)
const getData = () => {
  getStorePrinter(currentPage.value, 6, keyWords.value, storeId.value).then(res => {
    if (res.success) {
      tableData.value = res.data.records
      currentPage.value = res.data.current
      total.value = res.data.total
    }
  })
}

const toDelStorePrinter = (printerId) => {
  delStorePrinter(printerId).then(res => {
    if (res.success) {
      ElMessage({
        type: "success",
        message: "操作成功",
        duration: 1000
      })
      getData()
    }
  })
}

const toGetPrinterStatus = (printerId, row) => {
  getStorePrinterStatus(printerId).then(res => {
    if (res.success) {
      row.status = res.data
    }
  })
}


onMounted(() => {
  // 如果路由存在storeId 则默认输入
  if (storeIdFromRouter !== undefined) {
    storeId.value = storeIdFromRouter
  }
  getData()
})
</script>

<style scoped>

:deep(input::-webkit-outer-spin-button),
:deep(input::-webkit-inner-spin-button) {
  -webkit-appearance: none !important;
}

:deep(input[type=‘number’]) {
  -moz-appearance: textfield !important;
}

</style>