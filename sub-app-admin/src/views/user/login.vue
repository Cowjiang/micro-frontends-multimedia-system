<template>
  <div class="background absolute  right-60 top-40">
    <img src="/src/assets/svg/login-background.svg">
  </div>
  <div class="container flex items-center  h-screen pb-24 login-bg">

    <el-form
        status-icon
        label-width="80px"
        class="bg-white w-1/3 p-8 ml-56 rounded-2xl shadow-2xl"
        :model="form"
    >
      <div class="text-5xl font-mono text-center mb-5">ShiTu-登录</div>
      <el-form-item label="账号" prop="pass">
        <el-input
            v-model="form.username"
            type="text"

        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="checkPass">
        <el-input

            v-model="form.password"
            type="password"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm">
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>

</template>
<script setup>
import {reactive} from "vue";
import {login} from "@/utils/http/apis/user/user";
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";

const router=useRouter()
const form = reactive({
  username: "",
  password: ""
})
const submitForm = () => {
  login(form).then(res => {
    if (res.success) {
      ElMessage({
        type:"success",
        message:"登录成功"
      })
      router.push("/")
    }
  })
}

</script>
<style lang="scss" scoped>
//.login-bg{
//  background: url("/");
//}
</style>