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
            <el-button type="primary" @click="showAddUserRecommendDialog">
              添加
            </el-button>
          </el-button-group>
        </el-row>
      </el-col>
    </el-row>
    <!--表格-->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="userId" label="用户id"/>

      <el-table-column prop="avgPath" label="头像">
        <template #default="props">
          <el-image class="w-20 h-20" fit="cover" :src="props.row.avgPath"/>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名"/>
      <el-table-column prop="schoolName" label="学校名称"/>
      <el-table-column prop="orderNum" label="排序优先级">
        <template #default="props">
          <el-select v-model="props.row.orderNum" @change="changeOrderNum(props.row.id,props.row.orderNum)">
            <el-option
                v-for="item in [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]"
                :key="item"
                :label="item"
                :value="item"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="stat" label="状态">
        <template #default="props">
          {{ getStatMsg(props.row.stat) }}
        </template>
      </el-table-column>
      <el-table-column prop="stat" label="推荐类型">
        <template #default="props">
          <el-select v-model="props.row.type" class="m-2" @change="changeType(props.row.id,props.row.type)"
                     placeholder="推荐类型">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="stat" label="操作">
        <template #default="props">

          <el-button-group>
            <el-popconfirm
                confirm-button-text="确定"
                cancel-button-text="取消"
                title="确定删除该记录吗?"
                @confirm="confirmDelete(props.row.id)">
              <template #reference>
                <el-button type="primary">删除</el-button>
              </template>
            </el-popconfirm>

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

  <add-user-recommend :showDialog="showDialog" @closeDialog="showDialog=false" @reload="getData"/>
</template>

<script setup>
import {onMounted, ref} from "vue";
import moment from "moment";
import {ElMessage} from "element-plus";
import {
  deleteSchoolRecommend,
  getAllSchoolUserRecommend,
  updateSchoolRecommend
} from "@/utils/http/apis/recommend/userRecommend";
import {getSearchSchool} from "@/utils/http/apis/school/school";
import addUserRecommend from './compontents/addUserRecommend.vue'

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
  getAllSchoolUserRecommend(currentPage.value, 3, keyWords.value, schoolName.value).then(res => {
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

const querySearch = (queryString, cb) => {
  if (queryString === null || queryString === "") {
    return
  }
  getSearchSchool(schoolName.value, 10).then(res => {
    cb(res.data)
  })

}


const confirmDelete = (id) => {
  deleteSchoolRecommend(id).then(res => {
    if (res.success) {
      ElMessage({
        type: "success",
        message: "修改成功",
        duration: 1000
      })
      getData()
    }
  })
}

const getStatMsg = (stat) => {
  switch (stat) {
    case 0:
      return "隐藏";
    case 1:
      return "正常"
  }
}

const changeType = (id, type) => {
  updateSchoolRecommend({id, type}).then(res => {
    if (res.success) {
      ElMessage({
        type: "success",
        message: "修改成功",
        duration: 1000
      })
    }
  })
}

const changeOrderNum = (id, orderNum) => {
  updateSchoolRecommend({id, orderNum}).then(res => {
    if (res.success) {
      ElMessage({
        type: "success",
        message: "修改成功",
        duration: 1000
      })
    }
  })
}
const showAddUserRecommendDialog = () => {
  showDialog.value = true

}


const options = [
  {
    value: 0,
    label: '正常'
  },
  {
    value: 1,
    label: '自动关注'
  }
]


</script>

<style scoped>

</style>