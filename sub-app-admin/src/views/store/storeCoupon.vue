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
      <el-col :span="12">
        <el-row type="flex" justify="end">
          <el-button-group>
            <el-button type="primary" @click="showAddCouponDialog()">
              添加优惠券
            </el-button>
          </el-button-group>
        </el-row>
      </el-col>
    </el-row>
    <!--表格-->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="优惠券id"/>
      <el-table-column prop="title" label="优惠券标题"/>
      <el-table-column prop="usedAmount" label="减"/>
      <el-table-column prop="withAmount" label="满"/>
      <el-table-column prop="takeCount" label="已领"/>
      <el-table-column prop="quota" label="分发"/>
      <el-table-column prop="userLimit" label="最大领取"/>
      <el-table-column prop="validDays" label="领取后有效期(天)"/>
      <el-table-column label="结束时间" width="170">
        <template #default="scope">
          {{ formatTime(scope.row.quotaEndTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button :disabled="scope.row.isDeleted" @click="toDeleteCoupon(scope.row.id)">
            {{ scope.row.isDeleted ? "已删除" : "删除" }}
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

  </div>
  <add-coupon-dialog :showDialog="showDialog" :storeId="storeId" @closeDialog="showDialog=false" @reload="getData"/>
</template>

<script setup>
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import moment from "moment";
import {ElMessage} from "element-plus";
import BreadNav from "@/components/commons/BreadNav.vue";
import {getStoreCoupon} from "@/utils/http/apis/store/storeCoupon";
import {deleteCoupon} from "@/utils/http/apis/store/storeCoupon";
import AddCouponDialog from "@/views/store/compontents/addCouponDialog.vue";

const router = useRouter();
const storeId = router.currentRoute.value.query.storeId
// 搜搜关键词
const keyWords = ref('')

const tableData = ref([])

// 分页当前页数s
const currentPage = ref(1)
// 分页总条数
const total = ref(0)
const getData = () => {
  getStoreCoupon(currentPage.value, 6, storeId, keyWords.value).then(res => {
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

const formatTime = (time) => moment(time).format("yyyy-MM-DD hh:mm:ss")

const toDeleteCoupon = (couponId) => {
  deleteCoupon(storeId, couponId).then(res => {
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
let showDialog = ref(false)
const showAddCouponDialog = () => {
  showDialog.value = true
}
const closeDialog = () => {
  showDialog.value = false
}
</script>

<style scoped>

</style>