<template>
  <div class=" p-6   rounded-2xl shadow-lg bg-white relative" style="min-height: 85vh;padding-bottom:50px" id="panel">
    <BreadNav/>
    <!--  顶部搜索-->
    <el-row class="mb-3" :gutter="12">
      <el-col :span="5">
        <el-input
            clearable
            placeholder="用户名"
            v-model="keyWords">
        </el-input>
      </el-col>

      <el-col :span="5">
        <el-autocomplete
            class="w-full"
            clearable
            :fetch-suggestions="querySearch"
            placeholder="学校名称"
            v-model="schoolName"
            @select="schoolSelected"
            value-key="name">
        </el-autocomplete>
      </el-col>

      <el-col :span="4">
        <el-button @click="getData" type="primary">
          搜索
        </el-button>
      </el-col>
      <el-col :span="10">
        <el-row type="flex" justify="end">
          <el-button-group>
            <el-button type="primary" @click="showAddAdDialog">
              发布广告
            </el-button>
          </el-button-group>
        </el-row>
      </el-col>
    </el-row>
    <!--表格-->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="id"/>

      <el-table-column prop="imgUrl" label="海报">
        <template #default="props">
          <el-image class="w-20 h-20" fit="cover" :src="props.row.imgUrl"/>
        </template>
      </el-table-column>
      <el-table-column prop="dynamicId" label="关联动态id"/>
      <el-table-column prop="startTime" label="开始时间">
        <template #default="props">
          {{ formatTime(props.row.startTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间">
        <template #default="props">
          {{ formatTime(props.row.endTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="createdTime" label="创建时间">
        <template #default="props">
          {{ formatTime(props.row.createdTime) }}
        </template>
      </el-table-column>


      <el-table-column prop="stat" label="操作">
        <template #default="props">

          <el-button-group>
            <el-button type="primary" @click="updateStat(props.row.id,props.row.stat)">
              {{ props.row.stat == 1 ? "下架" : "上架" }}
            </el-button>

          </el-button-group>
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
  </div>

  <add-ad-dialog :showDialog="showDialog" @closeDialog="showDialog=false" @reload="getData"/>
</template>

<script setup>
import {onMounted, ref} from "vue";
import moment from "moment";
import {ElMessage} from "element-plus";
import AddAdDialog from '@/views/recommend/compontents/addAdDialog.vue'
import {getAllAd, updateAd} from "@/utils/http/apis/recommend/adManagement";


const tableData = ref([])
// 搜搜关键词
const keyWords = ref(null)
// 搜索学校名称
const schoolName = ref(null)
// 分页当前页数s
const currentPage = ref(1)
// 分页总条数
const total = ref(0)
// 添加推荐博主弹框
const showDialog = ref(false)

const getData = () => {
  getAllAd(currentPage.value, 6).then(res => {
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


const showAddAdDialog = () => {
  showDialog.value = true
}

const updateStat = (id, stat) => {
  let newStat = stat === 1 ? -1 : 1
  updateAd(id, {stat: newStat}).then(res => {
    if (res.success) {
      ElMessage({
        type: "success",
        message: "操作成功",
        duration: 2000
      })
      getData()
    }
  })
}


</script>

<style scoped>

</style>