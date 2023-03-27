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
      <el-table-column prop="roleName" label="角色名称"/>

      <el-table-column prop="roleDescription" label="角色描述"/>

      <el-table-column label="操作">
        <template #default="scope">
          <el-switch v-model="scope.row.isSelected" @change="changeSwitch(scope.row.id,scope.row.isSelected)"/>
        </template>
      </el-table-column>

    </el-table>


  </el-drawer>
</template>

<script setup>
import {ref} from "vue";

import {getRoles} from "@/utils/http/apis/security/role";
import {addUserUserRole, deleteUserUserRole, getUserUserRoles} from "@/utils/http/apis/security/user";
import {ElMessage} from "element-plus";


const props = defineProps({
  drawerVisible: Boolean,
  currentUserId: Number
})
const emit = defineEmits(['closeDrawer', 'openDrawer'])
const keyWords = ref("")
const tableData = ref([])
// 关闭抽屉
const closeDrawer = () => {
  tableData.value = []
  emit('closeDrawer')
}
const updateTable = () => {
  getRoles(1, -1, "").then(res => {
    getUserUserRoles(props.currentUserId).then(innerRes => {
      let dataTemp = res.data.records
      let dataTempR = innerRes.data.map(data => data.id)
      for (let item of dataTemp) {
        item.isSelected = dataTempR.indexOf(item.id) > -1
      }
      tableData.value = dataTemp
    })
  })
}

const changeSwitch = (roleId, flag) => {
  if (flag) {
    addUserUserRole(props.currentUserId, roleId).then(res => {
      if (res.success) {
        ElMessage({
          type: "success",
          message: "操作成功",
          duration: 1000
        })
      }
    })
  } else {
    deleteUserUserRole(props.currentUserId, roleId).then(res => {
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
</script>

<style scoped>

</style>