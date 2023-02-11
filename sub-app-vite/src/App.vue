<template>
  <v-theme-provider :theme="dark ? 'dark' : 'light'">
    <v-app>
      <message
        v-model="showMessage"
        :text="alertInfo.text"
        :type="alertInfo.type"
      />
      <router-view />
    </v-app>
  </v-theme-provider>
</template>

<script setup lang="ts">
  import router from '@/router';
  import { AlertType } from '@/views/login/components/typings';
  import Message from '@/components/message/message.vue';
  import { useUserStore } from '@/store/user';

  window.$wujie?.bus.$on('vite-router-change', (path: string) => router.push(path));

  const dark = useStorage('dark', false);

  const showMessage = ref(false);
  const alertInfo = ref<{
    text: string,
    type: AlertType
  }>({
    text: '',
    type: 'info'
  }); //消息提示框的信息
  const messageInstance = {
    ignoreWujie: false,
    showMessage(text: string, type: AlertType, ignoreWujie: boolean) {
      if (!window.$wujie || ignoreWujie) {
        alertInfo.value.type = type;
        alertInfo.value.text = text;
        showMessage.value = true;
      } else {
        window.$wujie?.bus.$emit('showMessage', {text, type});
      }
    },
    success(text: string, ignoreWujie: boolean = false) {this.showMessage(text, 'success', ignoreWujie);},
    warning(text: string, ignoreWujie: boolean = false) {this.showMessage(text, 'warning', ignoreWujie);},
    error(text: string, ignoreWujie: boolean = false) {this.showMessage(text, 'error', ignoreWujie);},
    info(text: string, ignoreWujie: boolean = false) {this.showMessage(text, 'info', ignoreWujie);}
  };

  const {appContext} = getCurrentInstance() ?? {};
  appContext && (appContext.config.globalProperties.$message = messageInstance);

  onMounted(() => {
    // window.$wujie?.bus.$on('vite-router-change', (path: string) => router.push(path));
    useUserStore().getUserInfo();

    // connectSocket().then(() => {
    // })
  });
</script>

<style lang="scss">
  @import "@/common/styles/fontawesome.css";
</style>
