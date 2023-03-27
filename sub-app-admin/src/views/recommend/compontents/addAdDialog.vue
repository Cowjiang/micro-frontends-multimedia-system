<template>
  <el-dialog v-model="showDialog" title="发布广告" @close="emit('closeDialog')">
    <el-form :model="form" label-position="right" label-width="150px">
      <el-form-item label="图片路径">
        <el-input v-model="form.imgUrl" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="文本">
        <el-input v-model="form.content" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="动态id">
        <el-input type="number" v-model="form.dynamicId" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker
            v-model="form.startTime"
            type="datetime"/>
      </el-form-item>

      <el-form-item label="结束时间">
        <el-date-picker
            v-model="form.endTime"
            type="datetime"/>
      </el-form-item>


      <el-form-item size="large">
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import {reactive, ref} from "vue";
import {ElMessage} from "element-plus";
import {addAd} from "@/utils/http/apis/recommend/adManagement";

const emit = defineEmits(['closeDialog', 'reload'])

const props = defineProps({
  showDialog: Boolean
})
const form = reactive({
  imgUrl: "",
  content: "",
  dynamicId: "",
  startTime: "",
  endTime: ""
})
const userList = ref([])


const onSubmit = () => {
  let data = JSON.parse(JSON.stringify(form));
  data.startTime = form.startTime.getTime()
  data.endTime = form.endTime.getTime()

  addAd(data).then(res => {
    if (res.success) {
      ElMessage({
        type: "success",
        message: "操作成功",
        duration: 2000
      })
      form.imgUrl = ""
      form.content = ''
      form.dynamicId = ''
      form.startTime = ''
      form.endTime = ''
      emit("reload")
      emit("closeDialog")

    }
  })
}
</script>

<style scoped>

</style>