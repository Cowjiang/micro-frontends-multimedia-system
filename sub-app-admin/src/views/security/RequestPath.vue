<template>
  <div class=" p-6 bg-white relative" style="min-height: 85vh;padding-bottom:50px" id="panel">
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
            <el-button type="primary" @click="showEditRequestPathDialog('add')">
              添加路径
            </el-button>
          </el-button-group>
        </el-row>
      </el-col>
    </el-row>
    <!--表格-->
    <el-table :data="requestPaths" border style="width: 100%">
      <!--      数据列-->
      <el-table-column prop="id" label="id" width="100px"/>

      <el-table-column prop="url" label="路径"/>

      <el-table-column prop="method" label="请求方法">
        <template #default="scope">
          <el-tag :type="getMethodTextClass(scope.row.method)"> {{ scope.row.method }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="description" label="路径描述"/>

      <el-table-column prop="groupName" label="所属组"/>
      <!--      操作-->
      <el-table-column label="操作" width="150px">
        <template #default="scope">
          <el-button-group>
            <el-button @click="showEditRequestPathDialog('edit',scope.row.id)" type="primary">
              <svgIcon name="pencil-alt"/>
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
          :page-size="8"
          @current-change="getData"
          layout="prev, pager, next, jumper"
          :total="total"
      >
      </el-pagination>
    </div>
  </div>

  <EditRequestPathDialog ref="editDialog" :dialogFormVisible="dialogFormVisible" :formType="formType"
                         @closeDialog="closeDialog" @openDialog="openDialog" @reload="getData"/>


</template>

<script setup>
import {onMounted, ref} from "vue";
import {deleteRequestPath, getRequestPaths} from "@/utils/http/apis/security/requestPath";
import EditRequestPathDialog from "@/views/security/components/requestPath/EditRequestPathDialog.vue";
import {ElMessage} from "element-plus";
import BreadNav from "@/components/commons/BreadNav.vue";
const requestPaths = ref([])
// 搜搜关键词
const keyWords = ref('')
// 分页当前页数s
const currentPage = ref(1)
// 分页总条数
const total = ref(0)
// 编辑窗体控制
const dialogFormVisible = ref(false)
// 当前弹出表单类型
const formType = ref("save")
// 查询数据
let getData = () => getRequestPaths(currentPage.value, 8, keyWords.value).then(res => {
  if (res.success) {
    requestPaths.value = res.data.records
    currentPage.value = res.data.current
    total.value = res.data.total
  }
})
// 初始化数据
onMounted(() => {
  getData()

})
// 根据请求方法获取对应样式
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
// 获取编辑框引用
const editDialog = ref(null)

// 展示编辑框
const showEditRequestPathDialog = (type, id = null) => {
  formType.value = type
  if (type === 'add') {
    editDialog.value.clearForm()
    dialogFormVisible.value = true
  } else if (type === 'edit') {
    editDialog.value.initForm(id)
  }

}
const closeDialog = () => {
  dialogFormVisible.value = false
}
const openDialog = () => {
  dialogFormVisible.value = true
}

const confirmDelete = (id) => {
  deleteRequestPath(id).then(res => {
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
