<template>
  <div class=" p-6 bg-white relative" style="min-height: 85vh;padding-bottom:50px" id="panel">
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
      <el-col :span="12">
        <el-row type="flex" justify="end">

          <el-button type="primary" @click="showEditRoleDialog('add')">添加角色</el-button>

        </el-row>
      </el-col>

    </el-row>
    <el-table :data="roles" border style="width: 100%">
      <el-table-column prop="id" label="id" width="100px"/>
      <el-table-column prop="roleName" label="角色名称"/>
      <el-table-column prop="roleDescription" label="角色详细"/>

      <!--      操作-->
      <el-table-column label="操作" width="200px">
        <template #default="scope">
          <el-button-group>
            <el-button @click="showEditRoleDialog('edit',scope.row.id)" type="primary">
              <svgIcon name="pencil-alt"/>
            </el-button>


            <el-button type="success" @click="changeCurrentId(scope.row.id)">
              <svgIcon name="shield-exclamation"/>
            </el-button>

            <el-popconfirm
                confirm-button-text="确定"
                cancel-button-text="取消"
                title="确定删除该记录吗?"
                @confirm="confirmDelete(scope.row.id)">
              <template #reference>
                <el-button type="danger">
                  <svgIcon name="trash"/>
                </el-button>
              </template>
            </el-popconfirm>
          </el-button-group>
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
    <EditRoleDialog ref="editDialog" :dialogVisible="dialogVisible" :formType="formType"
                    @closeDialog="closeDialog" @openDialog="openDialog" @reload="getData"/>


    <PermissionDrawer ref="permissionDrawer" :drawerVisible="drawerVisible" @closeDrawer="drawerVisible=false"
                      @openDrawer="drawerVisible=true" :currentRoleId="currentId"/>
  </div>
</template>

<script setup>
import {deleteRole, getRoles} from '@/utils/http/apis/security/role.js'
import {onMounted, ref} from "vue";
import EditRoleDialog from "@/views/security/components/role/EditRoleDialog.vue";
import {ElMessage} from "element-plus";
import PermissionDrawer from "@/views/security/components/role/PermissionDrawer.vue";
import BreadNav from "@/components/commons/BreadNav.vue";
// 搜搜关键词
const keyWords = ref('')
// 分页当前页数s
const currentPage = ref(1)
// 分页总条数
const total = ref(0)
// 编辑窗体控制
const dialogVisible = ref(false)
// 当前弹出表单类型
const formType = ref("save")
const roles = ref([])
// 查询数据
let getData = () => getRoles(currentPage.value, 8, keyWords.value).then(res => {
  if (res.success) {
    roles.value = res.data.records
    currentPage.value = res.data.current
    total.value = res.data.total
  }
})

// 抽屉控制
const drawerVisible = ref(false)
// 监听当前被选中权限id
const currentId = ref(0)
// 获取抽屉dom
const authorizationDrawer = ref(null)

// 权限编辑框应用
const permissionDrawer = ref(null)

const changeCurrentId = (id) => {
  currentId.value = id
  drawerVisible.value = true
  permissionDrawer.value.clearData()
}

// 初始化数据
onMounted(() => {
  getData()
})

// 获取编辑框引用
const editDialog = ref(null)

// 展示编辑框
const showEditRoleDialog = (type, id = null) => {
  formType.value = type
  if (type === 'add') {
    editDialog.value.clearForm()
    dialogVisible.value = true
  } else if (type === 'edit') {
    editDialog.value.initForm(id)
  }

}

const closeDialog = () => {
  dialogVisible.value = false
}
const openDialog = () => {
  dialogVisible.value = true
}

const confirmDelete = (id) => {
  deleteRole(id).then(res => {
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
</script>

<style scoped>

</style>
