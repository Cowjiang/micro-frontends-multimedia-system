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
      <el-table-column prop="id" label="店铺id" width="100"/>
      <el-table-column prop="name" label="店铺名称"/>
      <el-table-column label="店铺封面">
        <template #default="scope">
          <el-image fit="cover" style="width: 100px; height: 100px" :src="scope.row.imgUrl"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="联系方式" prop="phone"/>
      <el-table-column label="店铺状态" width="100">
        <template #default="scope">
          {{ scope.row.isOpening ? "营业中" : "打烊了" }}
        </template>
      </el-table-column>
      <el-table-column prop="disable" label="是否禁用" width="100">
        <template #default="scope">
          <el-switch v-model="scope.row.disable" @change="switchChange(scope.row.id,scope.row.disable)"
                     active-color="#e74c3c"/>
        </template>
      </el-table-column>

      <el-table-column label="直通" width="200">
        <template #default="scope">
          <router-link class="mr-2" :to="{path:'/store/order',query:{storeId:scope.row.id}}">
            <el-button type="primary">订单</el-button>
          </router-link>
          <router-link :to="{path:'/store/coupon',query:{storeId:scope.row.id}}">
            <el-button type="primary">优惠券</el-button>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column label="打印机" width="200">
        <template #default="scope">
          <el-button  type="primary" @click="toShowAddPrinterDialog(scope.row.id)">添加</el-button>
          <router-link class="ml-2" :to="{path:'/store/printer',query:{storeId:scope.row.id}}">
            <el-button type="primary">查看</el-button>
          </router-link>
        </template>
      </el-table-column>

    </el-table>


    <div class="absolute bottom-3 right-6">
      <el-pagination
          v-model:currentPage="currentPage"
          :page-size="3"
          layout="prev, pager, next, jumper"
          :total="total"
          @current-change="getData"
      >
      </el-pagination>
    </div>
    <add-store-printer-dialog :showDialog="showAddPrinterDialog" :storeId="currentStoreId"
                              @closeDialog="showAddPrinterDialog=false"
                              @reload="getData"/>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {getStore, putStore} from "@/utils/http/apis/store/storeManager";
import {ElMessage} from "element-plus";
import BreadNav from "@/components/commons/BreadNav.vue";
import AddStorePrinterDialog from "@/views/store/compontents/addStorePrinterDialog.vue";
// 当前点击店铺id
const currentStoreId = ref(null)
const tableData = ref([])
// 搜搜关键词
const keyWords = ref('')
// 分页当前页数s
const currentPage = ref(1)
// 分页总条数
const total = ref(0)
const getData = () => {
  getStore(currentPage.value, 3, keyWords.value).then(res => {
    if (res.success) {
      tableData.value = res.data.records
      currentPage.value = res.data.current
      total.value = res.data.total
    }
  })
}

onMounted(() => {
  getData();
})

const switchChange = (id, flag) => {
  putStore({
    id,
    disable: flag
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
const showAddPrinterDialog = ref(false)
const toShowAddPrinterDialog = (storeId) => {
  currentStoreId.value = storeId
  showAddPrinterDialog.value = true
}
</script>

<style scoped>

</style>