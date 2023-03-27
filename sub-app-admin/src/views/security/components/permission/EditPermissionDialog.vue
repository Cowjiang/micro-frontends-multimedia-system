<template>
  <el-dialog v-model="dialogVisible" title="添加权限" :close-on-click-modal="false">
    <el-form :model="form">
      <el-form-item label="权限编码">
        <el-input v-model="form.permissionCode" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="权限名称">
        <el-input v-model="form.permissionName" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer text-right">
      <el-button @click="emit('closeDialog')">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>


</template>

<script setup>
import {reactive} from "vue";
import {ElMessage} from "element-plus";
import {addPermission, getPermission, updatePermission} from "@/utils/http/apis/security/permission";

// 定义参数
const props = defineProps({'dialogVisible': Boolean, 'formType': String})
// 定义事件
const emit = defineEmits(['closeDialog', 'openDialog', 'reload'])
const form = reactive({
  id: "",
  permissionCode: "",
  permissionName: "",
})

// 提交表单
const submitForm = () => {
  if (props.formType === 'add') {
    form.id = null;
    addPermission(form).then(res => {
      if (res.success) {
        operateSuccess()
      }
    })
  } else if (props.formType === 'edit') {
    updatePermission(form).then(res => {
      if (res.success) {
        operateSuccess()
      }
    })
  }
}
const operateSuccess = () => {
  ElMessage({
    type: "success",
    message: "操作成功",
    duration: 1000
  })
  emit('reload')
  emit('closeDialog')
}
// 清楚表单
const clearForm = () => {
  form.id = ""
  form.permissionCode = ""
  form.permissionName = ""
}
// 初始化表单
const initForm = (id) => {
  getPermission(id).then(res => {
    if (res.success) {
      let data = res.data
      form.id = data.id
      form.permissionCode = data.permissionCode
      form.permissionName = data.permissionName
      emit('openDialog')
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