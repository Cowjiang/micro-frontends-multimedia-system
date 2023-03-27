<script setup>
import {ElConfigProvider} from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

const locale = zhCn
</script>

<template>
  <el-config-provider :locale="locale">
    <router-view/>
  </el-config-provider>

</template>

<style lang="scss">
* {
  margin: 0;
}

body, html {
  min-height: 100vh;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  background-color: rgb(249, 250, 251);
}

.el-table th.gutter {
  display: table-cell !important;
}
.el-pager li.btn-quicknext, .el-pager li.btn-quickprev {
  line-height: 24px!important;

  > svg {
    display: inline-block;
  }

}
</style>
