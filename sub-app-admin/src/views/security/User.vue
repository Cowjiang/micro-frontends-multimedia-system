<template>
  <div class=" p-6  rounded-2xl shadow-lg bg-white relative" style="min-height: 85vh;padding-bottom:50px" id="panel">
    <BreadNav/>
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

    <el-table :data="users" border style="width: 100%">
      <el-table-column prop="email" label="邮箱"/>
      <el-table-column prop="phone" label="手机号"/>
      <el-table-column prop="lastLoginTime" label="最后一次登录时间">
        <template #default="scope">
          {{ formatDate(scope.row.lastLoginTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="notLocked" label="是否启用账号">
        <template #default="scope">
          <el-switch v-model="scope.row.notLocked" :disabled="scope.row.id===0"
                     @change="changeSwitch(scope.row.id,scope.row.notLocked)"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px">

        <template #default="scope">
          <el-button-group>
            <el-button @click="showRoleDrawer(scope.row.id)" type="primary">
              <svgIcon name="pencil-alt"/>
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>

    </el-table>

    <div class="absolute bottom-3 right-6">
      <el-pagination
          v-model:currentPage="currentPage"
          :page-size="6"
          @current-change="getData"
          layout="prev, pager, next, jumper"
          :total="total"
      >
      </el-pagination>
    </div>
    <role-drawer :currentUserId="currentUserId" :drawerVisible="drawerVisible" @closeDrawer="drawerVisible=false"
                 @openDrawer="drawerVisible=true" ref="roleDrawer"/>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {getUser, updateUser} from "@/utils/http/apis/security/user";
import moment from "moment"
import RoleDrawer from "@/views/security/components/user/RoleDrawer.vue";
import {ElMessage} from "element-plus";
import BreadNav from "@/components/commons/BreadNav.vue";
// 搜搜关键词
const keyWords = ref('')
// 分页当前页数s
const currentPage = ref(1)
// 分页总条数
const total = ref(0)
const users = ref([])
const getData = () => {
  getUser(currentPage.value, 6).then(res => {
    users.value = res.data.records
    total.value = res.data.total

  })
}
const formatDate = (date) => {
  return moment(date).format("yyyy-MM-DD hh:mm:ss")
}
onMounted(() => {
  getData()
})

const drawerVisible = ref(false)
const currentUserId = ref(0)

const roleDrawer = ref(null)

const showRoleDrawer = (id) => {
  currentUserId.value = id
  drawerVisible.value = true
  console.log(roleDrawer.value.updateTable)
}

const changeSwitch = (id, flag) => {
  updateUser(id, {
    notLocked: flag
  }).then(res => {
    if (res.success) {
      ElMessage({
        type: "success",
        message: "修改成功",
        duration: 1000
      })
    }
  })
}
</script>

<style scoped>

</style>