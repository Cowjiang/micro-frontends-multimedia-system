<template>
  <el-drawer v-model="drawerVisible" title="授权" @close="closeDrawer" size="60%">
    <el-row :gutter="20">
      <el-col :span="24" class="mb-3">
        <el-select v-model="currentGroupId" placeholder="请选择" @change="updateTable()">
          <el-option
              v-for="item in groups"
              :key="item.groupId"
              :label="item.groupName"
              :value="item.groupId">
            {{ item.groupName }}
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="18">
        <el-input
            clearable
            placeholder="请输入内容"
            v-model="keyWords">
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button @click="updateTable" :disabled="currentGroupId===''" type="primary">
          搜索
        </el-button>
      </el-col>
    </el-row>

    <el-table :data="tableData">
      <el-table-column prop="url" label="路径"/>
      <el-table-column prop="method" label="请求方法">
        <template #default="scope">
          <el-tag :type="getMethodTextClass(scope.row.method)"> {{ scope.row.method }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="路径描述"/>

      <el-table-column label="操作">
        <template #default="scope">
          <el-switch v-model="scope.row.isSelected" @change="changeSwitch(scope.row.id,scope.row.isSelected)"/>
        </template>
      </el-table-column>

    </el-table>


    <div class="absolute bottom-3 right-6">
      <el-pagination
          v-model:currentPage="currentPage"
          :page-size="100"
          layout="prev, pager, next, jumper"
          :total="total"
      >
      </el-pagination>
    </div>

  </el-drawer>
</template>

<script setup>

import {onMounted, ref} from "vue";
import {getRequestPathGroups, getRequestPaths} from "@/utils/http/apis/security/requestPath";
import {
  deleteRequestPathPermission,
  getPathByPermissionId,
  setRequestPathPermission
} from "@/utils/http/apis/security/permission";
import {ElMessage} from "element-plus";

const props = defineProps({
  drawerVisible: Boolean,
  currentPermissionId: Number
})
const emit = defineEmits(['closeDrawer', 'openDrawer'])
// 初始化组
onMounted(() => {
  initGroup()
})
const groups = ref([])
const currentGroupId = ref("")
const initGroup = () => {
  getRequestPathGroups().then(res => {
    if (res.success) {
      groups.value = res.data
    }
  })
}
// 关闭抽屉
const closeDrawer = () => {
  tableData.value = []
  currentPage.value = 1
  currentGroupId.value = ""
  emit('closeDrawer')
}
// 加载表格数据
const tableData = ref([])
// 搜搜关键词
const keyWords = ref('')
// 分页当前页数
const currentPage = ref(1)
// 分页总条数
const total = ref(0)
const updateTable = () => {
  getRequestPaths(currentPage.value, 6, keyWords.value, currentGroupId.value).then(res => {
    if (res.success) {
      getPathByPermissionId(props.currentPermissionId).then(resInner => {
        if (resInner.success) {
          const currentPathIds = resInner.data.records.map(data => data.id)
          let dataTemp = res.data.records
          const dataTempIds = dataTemp.map(data => data.id)
          console.log(currentPathIds);
          console.log(dataTempIds);
          for (let i = 0; i < dataTemp.length; i++) {
            dataTemp[i]['isSelected'] = currentPathIds.indexOf(dataTempIds[i]) > -1
          }
          console.log(dataTemp);
          tableData.value = dataTemp
          currentPage.value = res.data.current
          total.value = res.data.total
        }
      })
    }
  })
}
const changeSwitch = (id, flag) => {
  if (flag) {
    setRequestPathPermission(props.currentPermissionId, id).then(res => {
      if (res.success) {
        ElMessage({
          type: "success",
          message: "操作完成",
          duration: 1000
        })
      }
    })
  } else {
    deleteRequestPathPermission(props.currentPermissionId, id).then(res => {
      if (res.success) {
        ElMessage({
          type: "success",
          message: "操作完成",
          duration: 1000
        })
      }
    })
  }
}

const getMethodTextClass = (method) => {
  switch (method) {
    case 'ALL':
      return "success"
    case 'GET':
      return "danger"
    case 'POST':
      return "warning"
    case 'DELETE':
      return ''
    case 'PUT':
      return 'info'
  }
}
</script>

<style scoped>

</style>