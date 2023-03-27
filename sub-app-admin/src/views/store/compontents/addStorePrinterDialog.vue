<template>
  <el-dialog v-model="showDialog" title="添加打印机" @close="emit('closeDialog')">
    <el-form :model="form" label-position="right" label-width="150px">
      <el-form-item label="打印机编号(SN)" required>
        <el-input v-model="form.sn"/>
      </el-form-item>
      <el-form-item label="打印机密码(KEY)" required>
        <el-input v-model="form.printerKey"/>
      </el-form-item>
      <el-form-item label="打印机备注名称" required>
        <el-input v-model="form.printerName"/>
      </el-form-item>
      <el-form-item label="流量卡手机号(可选)">
        <el-input v-model="form.phone"/>
      </el-form-item>
      <el-form-item size="large">
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import {reactive} from "vue";
import {ElMessage} from "element-plus";
import {addStorePrinter} from "@/utils/http/apis/store/storePrinter";

const emit = defineEmits(['closeDialog', 'reload'])

const props = defineProps({
  showDialog: Boolean,
  storeId: String
})
const form = reactive({
  sn: "",
  printerKey: '',
  printerName: '',
  phone: '',
})

const onSubmit = () => {
  let data = JSON.parse(JSON.stringify(form));
  addStorePrinter(props.storeId, data).then(res => {
    if (res.success) {
      ElMessage({
        type: "success",
        message: "操作成功",
        duration: 2000
      })
      form.sn = ""
      form.printerKey = ''
      form.printerName = ''
      form.phone = ''
      emit("reload")
      emit("closeDialog")

    }
  })
}
</script>

<style scoped>

</style>