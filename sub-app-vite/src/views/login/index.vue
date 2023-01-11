<template>
  <div class="custom-container" :style="backgroundStyle">
    <login-popup
      v-model="showLoginPopup"
      v-model:current-form="currentForm"
      :bg-style="backgroundStyle"
      :login-captcha-required="false"
    />
  </div>
</template>

<script lang="ts" setup>
  import LoginPopup from '@/views/login/components/login-popup.vue';
  import { FormType } from '@/views/login/components/typings';
  import type * as CSS from 'csstype';

  const router = useRouter();

  const showLoginPopup = ref(false);
  const currentForm = ref<FormType>(FormType.LOGIN);
  const backgroundStyle = ref<CSS.Properties>({
    backgroundImage: 'url(https://static.zhihu.com/heifetz/assets/sign_bg.db29b0fb.png)',
    backgroundRepeat: 'no-repeat',
    backgroundColor: '#b8e5f8',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  });

  const handleLoginFormTypeChange = (formType: FormType) => {
    currentForm.value = formType;
  };

  onMounted(() => {
    showLoginPopup.value = true;
    window?.$wujie?.bus.$on('loginFormTypeChange', handleLoginFormTypeChange);
  });

  onUnmounted(() => {
    window?.$wujie?.bus.$off('loginFormTypeChange', handleLoginFormTypeChange);
  });

  watch(
    () => router.currentRoute.value,
    (nval) => {
      nval.path.includes('login') && (currentForm.value = FormType.LOGIN);
      nval.path.includes('register') && (currentForm.value = FormType.REGISTER);
    },
    {immediate: true}
  );

  watch(
    () => currentForm.value,
    (nval) => {
      window?.$wujie?.bus.$emit('loginFormTypeChange', nval);
      currentForm.value === FormType.LOGIN && router.replace('/login');
      currentForm.value === FormType.REGISTER && router.replace('/register');
    }
  );
</script>

<style lang="scss" scoped>
  .custom-container {
    width: 100vw;
    height: 100%;
    box-sizing: border-box;
  }
</style>
