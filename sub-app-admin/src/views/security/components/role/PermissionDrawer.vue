<template>

  <el-drawer v-model="drawerVisible" title="授权" @close="closeDrawer" size="60%">
    <el-row :gutter="20">
      <el-col :span="18">
        <el-input
            clearable
            placeholder="请输入内容"
            v-model="keyWords">
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button @click="updateTable" type="primary">
          搜索
        </el-button>
      </el-col>
    </el-row>

    <el-table :data="tableData">
      <el-table-column prop="permissionCode" label="权限编码"/>
      <el-table-column prop="permissionName" label="权限名称"/>
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
import {ref} from "vue";
import {getPermissions} from "@/utils/http/apis/security/permission";
import {addRolePermissions, delRolePermissions, getRolePermissions} from "@/utils/http/apis/security/role";
import {ElMessage} from "element-plus";


const props = defineProps({
  drawerVisible: Boolean,
  currentRoleId: Number
})
const emit = defineEmits(['closeDrawer', 'openDrawer'])
const currentPage = ref(0)
const total = ref(0)
const tableData = ref([])
const clearData = () => {
  tableData.value = []
}
const updateTable = () => {
  getPermissions(1, -1, "").then(res => {
    if (res.success) {
      getRolePermissions(props.currentRoleId).then(resInner => {
        if (resInner.success) {
          let dataTemp = res.data.records
          let permissionIds = resInner.data.records.map(data => data.id)
          let dataTempIds = dataTemp.map(data => data.id)
          for (let i = 0; i < dataTempIds.length; i++) {
            dataTemp[i]['isSelected'] = permissionIds.indexOf(dataTempIds[i]) > -1
          }
          tableData.value = dataTemp
          currentPage.value = res.data.current
          total.value = res.data.total
        }

      })
    }
  })
}
const changeSwitch = (permissionId, flag) => {
  if (flag) {
    addRolePermissions(props.currentRoleId, permissionId).then(res => {
      if (res.success) {
        ElMessage({
          type: "success",
          message: "操作成功",
          duration: 1000
        })
      }
    })
  } else {
    delRolePermissions(props.currentRoleId, permissionId).then(res => {
      if (res.success) {
        ElMessage({
          type: "success",
          message: "操作成功",
          duration: 1000
        })
      }
    })
  }
}
defineExpose({
  clearData
})
</script>

<style scoped>

</style>