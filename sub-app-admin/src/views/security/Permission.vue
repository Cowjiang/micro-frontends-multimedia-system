<template>
  <div class="p-6 bg-white relative" style="min-height: 85vh;padding-bottom:50px" id="panel">
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
            <el-button type="primary" @click="showEditPermissionsDialog('add')">
              添加权限
            </el-button>
          </el-button-group>
        </el-row>
      </el-col>
    </el-row>
    <!--表格-->
    <el-table :data="permissions" border style="width: 100%">
      <!--      数据列-->
      <el-table-column prop="id" label="id" width="100px"/>

      <el-table-column prop="permissionCode" label="权限编码"/>

      <el-table-column prop="permissionName" label="权限名称"/>

      <!--      操作-->
      <el-table-column label="操作" width="200px">
        <template #default="scope">
          <el-button-group>
            <el-button @click="showEditPermissionsDialog('edit',scope.row.id)" type="primary">
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
  </div>

  <EditPermissionsDialog ref="editDialog" :dialogVisible="dialogVisible" :formType="formType"
                         @closeDialog="closeDialog" @openDialog="openDialog" @reload="getData"/>

  <AuthorizationDrawer ref="authorizationDrawer" :drawerVisible="drawerVisible" @closeDrawer="drawerVisible=false"
                       @openDrawer="drawerVisible=true" :currentPermissionId="currentId"/>

</template>

<script setup>
import {onMounted, ref} from "vue";
import {ElMessage} from "element-plus";
import {deletePermission, getPermissions} from "@/utils/http/apis/security/permission";
import EditPermissionsDialog from "@/views/security/components/permission/EditPermissionDialog.vue"
import AuthorizationDrawer from "@/views/security/components/permission/AuthorizationDrawer.vue";
import BreadNav from "@/components/commons/BreadNav.vue";

const permissions = ref([])
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
// 抽屉控制
const drawerVisible = ref(false)
// 监听当前被选中权限id
const currentId = ref(0)
// 获取抽屉dom
const authorizationDrawer = ref(null)

const changeCurrentId = (id) => {
  currentId.value = id
  drawerVisible.value = true

}
// 查询数据
let getData = () => getPermissions(currentPage.value, 8, keyWords.value).then(res => {
  if (res.success) {
    permissions.value = res.data.records
    currentPage.value = res.data.current
    total.value = res.data.total
  }
})
// 初始化数据
onMounted(() => {
  getData()
})

// 获取编辑框引用
const editDialog = ref(null)

// 展示编辑框
const showEditPermissionsDialog = (type, id = null) => {
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
  deletePermission(id).then(res => {
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

<style lang="scss">


</style>
