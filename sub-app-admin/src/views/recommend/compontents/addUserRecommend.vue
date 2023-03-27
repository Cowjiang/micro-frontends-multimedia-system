<template>
  <el-dialog v-model="showDialog" title="添加推荐博主" @close="emit('closeDialog')">
    <el-form :model="form" label-position="right" label-width="150px">

      <el-form-item label="博主" required>
        <el-select
            v-model="form.userId"
            filterable
            remote
            reserve-keyword
            placeholder="搜索用户"
            :remote-method="searchUser"
            :loading="selectUserLoading"
        >
          <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.username"
              :value="item.id"
          >
            <span class="float-left">{{ item.username }}</span>
            <span class="float-right text-gray-400">{{ item.id }}</span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="学校" required>
        <el-select
            v-model="form.schoolId"
            filterable
            remote
            reserve-keyword
            placeholder="搜索学校"
            :remote-method="searchSchool"
            :loading="selectSchoolLoading"
        >
          <el-option
              v-for="item in schoolList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          >
            <span class="float-left">{{ item.name }}</span>
            <span class="float-right text-gray-400">{{ item.id }}</span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="排序优先级" required>
        <el-select v-model="form.orderNum">
          <el-option
              v-for="item in [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]"
              :key="item"
              :label="item"
              :value="item"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="推荐类型" required>
        <el-select v-model="form.type">
          <el-option
              v-for="item in [{stat:'1',label:'自动关注'},{stat:'0',label: '正常'}]"
              :key="item.stat"
              :label="item.label"
              :value="item.stat"
          />
        </el-select>
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
import {addStorePrinter} from "@/utils/http/apis/store/storePrinter";
import {getSearchUser} from "@/utils/http/apis/security/user";
import {getSearchSchool} from "@/utils/http/apis/school/school";
import {addSchoolRecommend} from "@/utils/http/apis/recommend/userRecommend";

const emit = defineEmits(['closeDialog', 'reload'])

const props = defineProps({
  showDialog: Boolean
})
const form = reactive({
  userId: "",
  orderNum: "",
  type: "0",
  schoolId: ""
})
const userList = ref([])
const selectUserLoading = ref(false)
const searchUser = (queryString) => {
  selectUserLoading.value = true
  getSearchUser(queryString).then(res => {
    selectUserLoading.value = false
    if (res.success) {
      userList.value = res.data.records;
    }
  })
}
const schoolList = ref([])
const selectSchoolLoading = ref(false)
const searchSchool = (queryString) => {
  selectSchoolLoading.value = true
  getSearchSchool(queryString, 8).then(res => {
    selectSchoolLoading.value = false
    if (res.success) {
      schoolList.value = res.data;
    }
  })
}


const onSubmit = () => {
  let data = JSON.parse(JSON.stringify(form));

  addSchoolRecommend(data).then(res => {
    if (res.success) {
      ElMessage({
        type: "success",
        message: "操作成功",
        duration: 2000
      })
      form.userId = ""
      form.orderNum = ''
      form.type = '0'
      form.schoolId = ''

      emit("reload")
      emit("closeDialog")

    }
  })
}
</script>

<style scoped>

</style>