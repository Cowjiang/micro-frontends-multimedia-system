<template>
  <el-dialog v-model="showDialog" title="添加优惠券" @close="emit('closeDialog')">
    <el-form :model="form" label-position="right" label-width="100px">
      <el-form-item label="标题">
        <el-input v-model="form.title"/>
      </el-form-item>
      <el-form-item label="满">
        <el-input type="number" v-model="form.withAmount"/>
      </el-form-item>
      <el-form-item label="减">
        <el-input type="number" v-model="form.usedAmount"/>
      </el-form-item>
      <el-form-item label="分发数量">
        <el-input type="number" v-model="form.quota"/>
      </el-form-item>
      <el-form-item label="有效时间">
        <el-input type="number" v-model="form.validDays"/>
      </el-form-item>
      <el-form-item type="number" label="用户限制数量">
        <el-input v-model="form.userLimit"/>
      </el-form-item>
      <el-form-item label="分发开始时间">
        <el-date-picker
            v-model="form.quotaStartTime"
            type="datetime"/>
      </el-form-item>
      <el-form-item label="分发结束时间">
        <el-date-picker
            v-model="form.quotaEndTime"
            type="datetime"/>
      </el-form-item>

      <el-form-item size="large">
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import {reactive} from "vue";
import {postCoupon} from "@/utils/http/apis/store/storeCoupon";
import {ElMessage} from "element-plus";

const emit = defineEmits(['closeDialog', 'reload'])

const props = defineProps({
  showDialog: Boolean,
  storeId: String
})
const form = reactive({
  title: "",
  withAmount: '',
  usedAmount: '',
  quota: '',
  quotaStartTime: '',
  validDays: '',
  quotaEndTime: '',
  userLimit: ''
})
const onSubmit = () => {
  let data = JSON.parse(JSON.stringify(form));
  data.quotaEndTime = form.quotaEndTime.getTime()
  data.quotaStartTime = form.quotaStartTime.getTime()
  postCoupon(props.storeId, data).then(res => {
    if (res.success) {
      ElMessage({
        type: "success",
        message: "操作成功",
        duration: 2000
      })
      form.title = ""
      form.withAmount = ''
      form.usedAmount = ''
      form.quota = ''
      form.quotaStartTime = ''
      form.validDays = ''
      form.quotaEndTime = ''
      form.userLimit = ''
      emit("reload")
      emit("closeDialog")

    }
  })
}
</script>

<style scoped>

</style>