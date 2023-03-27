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
      <el-table-column prop="id" label="id" show-overflow-tooltip/>
      <el-table-column prop="contacts" label="联系人"/>
      <el-table-column prop="phone" label="联系方式"/>
      <el-table-column prop="totalPayment" label="订单金额(单位：分)"/>
      <el-table-column prop="payment" label="用户实付(单位：分)"/>
      <el-table-column prop="closeReason" label="关闭原因" show-overflow-tooltip/>
      <el-table-column prop="createdTime" label="创建时间" width="180">
        <template #default="scope">
          {{ formatTime(scope.row.createdTime) }}
        </template>
      </el-table-column>
      <el-table-column label="订单状态">
        <template #default="scope">
          {{ getStatMessage(scope.row.stat) }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="toRefunds(scope.row.id,scope.$index)" :disabled="scope.row.stat!==5">退款</el-button>
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
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {getStoreArchives} from "@/utils/http/apis/store/storeApply";
import {getStoreOrder, refunds} from "@/utils/http/apis/store/storeOrder";
import moment from "moment";
import {ElMessage} from "element-plus";
import BreadNav from "@/components/commons/BreadNav.vue";

const router = useRouter();
const storeId = router.currentRoute.value.query.storeId

const tableData = ref([])

// 分页当前页数s
const currentPage = ref(1)
// 分页总条数
const total = ref(0)
const getData = () => {
  getStoreOrder(currentPage.value, 6, storeId).then(res => {
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
const getStatMessage = (stat) => {
  switch (stat) {
    case 0:
      return "订单已创建"
    case 1:
      return "订单已确认"
    case 2:
      return "订单已付款"
    case 3:
      return "交易完成"
    case 4:
      return "用户申请取消"
    case 5:
      return "用户申请退款"
    case 9:
      return "交易关闭"
    case 10:
      return "已退款"
    default:
      return ""
  }
}
const formatTime = (time) => moment(time).format("yyyy-MM-DD hh:mm:ss")
const toRefunds = (storeId, index) => {
  refunds(storeId).then(res => {
    if (res.success) {
      ElMessage({
        type: "success",
        message: "申请成功，请耐心等等"
      })
      tableData.value[index].stat = 10;
    }
  })
}
</script>

<style scoped>

</style>