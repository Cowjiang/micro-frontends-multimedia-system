<template>

  <el-dialog v-model="dialogFormVisible" title="添加路径" :close-on-click-modal="false">
    <el-form :model="form">
      <el-form-item label="请求路径">
        <el-input v-model="form.url" placeholder="请输入内容"></el-input>
      </el-form-item>

      <el-form-item label="请求方法">
        <el-select v-model="form.method" placeholder="请选择请求方法">
          <template #prefix>
            <el-tag :type="getMethodTextClass(form.method)"></el-tag>
          </template>
          <el-option
              v-for="item in methodOptions"
              :key="item.label"
              :label="item.label"
              :value="item.label"
              :class="item.style">
            <el-tag :type="item.style">{{ item.label }}</el-tag>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="所属组别">
        <el-select v-model="form.groupId" placeholder="请选择" class="mr-2">
          <el-option
              v-for="item in groups"
              :key="item.groupId"
              :label="item.groupName"
              :value="item.groupId">
            {{ item.groupName }}
          </el-option>
        </el-select>
        <el-button @click="newGroupDialog=true">新增组别</el-button>
      </el-form-item>


      <el-form-item label="请求描述">
        <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            v-model="form.description">
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer text-right">
      <el-button @click="emit('closeDialog')">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>
  <el-dialog v-model="newGroupDialog" center title="新增组别" width="30%" @close="newGroupDialog=false">
    <el-form>
      <el-form-item label="组别名称:">
        <el-input type="text" v-model="newGroup"/>
      </el-form-item>
      <el-form-item class="text-center">
        <el-button type="primary" @click="addGroup">添加</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

</template>

<script setup>
import {ref, reactive, onMounted} from "vue";
import {
  addRequestPathGroup,
  addRequestPaths,
  getRequestPath,
  getRequestPathGroups,
  updateRequestPaths
} from "@/utils/http/apis/security/requestPath";
import {ElMessage} from "element-plus";

// 定义参数
const props = defineProps({'dialogFormVisible': Boolean, 'formType': String})
// 定义事件
const emit = defineEmits(['closeDialog', 'openDialog', 'reload'])
const form = reactive({
  id: "",
  url: "",
  method: "",
  description: "",
  groupId: ""
})
// 初始化组数据
onMounted(() => {
  initGroup()
})
const groups = ref([])
const initGroup = () => {
  getRequestPathGroups().then(res => {
    if (res.success) {
      groups.value = res.data
    }
  })
}

const methodOptions = [
  {
    label: 'ALL',
    style: 'success'
  },
  {
    label: 'GET',
    style: 'danger'
  },
  {
    label: 'POST',
    style: 'warning'
  },
  {
    label: 'DELETE',
    style: ''
  }, {
    label: 'PUT',
    style: 'info'
  }
]
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
// 提交表单
const submitForm = () => {
  if (props.formType === 'add') {
    form.id = null;
    addRequestPaths(form).then(res => {
      if (res.success) {
        ElMessage({
          type: "success",
          message: "操作成功",
          duration: 1000
        })
        emit('reload')
        emit('closeDialog')
      }
    })
  } else if (props.formType === 'edit') {
    updateRequestPaths(form).then(res => {
      if (res.success) {
        ElMessage({
          type: "success",
          message: "操作成功",
          duration: 1000
        })
        emit('reload')
        emit('closeDialog')
      }
    })
  }
}
// 清楚表单
const clearForm = () => {
  form.method = ""
  form.url = ""
  form.id = ""
  form.description = ""
  form.groupId = ""
}
// 初始化表单
const initForm = (id) => {
  getRequestPath(id).then(res => {
    if (res.success) {
      let data = res.data
      form.id = data.id
      form.url = data.url
      form.method = data.method
      form.description = data.description
      form.groupId = data.groupId
      emit('openDialog')
    }
  })
}

const newGroupDialog = ref(false)
const newGroup = ref("")
const addGroup = () => {
  addRequestPathGroup(newGroup.value).then(res => {
    if (res.success) {
      ElMessage({
        type: "success",
        message: "添加成功",
        duration: 1000
      })
      newGroup.value = ""
      newGroupDialog.value = false
      initGroup()
    }
  })
}
// 暴露方法 让父组件调用
defineExpose({
  clearForm,
  initForm
})

</script>

<style scoped>

</style>