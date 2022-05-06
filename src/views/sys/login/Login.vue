<template>
  <div class="login">
    <div class="login-logo">
      <img class="logo-img" :src="logoImgUrl" alt="Discovery" />
    </div>

    <div class="login-container">
      <div class="login-wrap">
        <div class="login-img md:hidden sm:hidden">
          <img :src="bgImgUrl" alt="one-touch-tech" />
        </div>

        <main class="login-form xl:ml-120px 2xl:ml-140px w-420px h-580px transition">
          <p class="login-title">{{ t('sys.login.title') }}</p>

          <el-form ref="loginFormRef" :rules="rules" :model="form">
            <el-form-item :label="t('sys.login.userName')" prop="username">
              <el-input v-model="form.username" autocomplete="off" />
            </el-form-item>
            <el-form-item :label="t('sys.login.password')" prop="password" class="mt-10">
              <el-input v-model="form.password" type="password" autocomplete="off" @keydown.enter="onLogin" />
            </el-form-item>
            <el-form-item class="mt-180px">
              <el-button class="login-btn w-full" :loading="btnLoading" @click="onLogin">
                {{ t('button.login') }}
              </el-button>
            </el-form-item>
          </el-form>
        </main>
      </div>
    </div>
    <slide-verify
      ref="verifyRef"
      captcha-type="blockPuzzle"
      :imgSize="{ width: '400px', height: '200px' }"
      @success="onVerifySuccess"
    />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { SlideVerify } from '@/components/Verify';

  export default defineComponent({
    name: 'Login',
    components: { SlideVerify },
  });
</script>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import type { FormRules } from 'element-plus';
  import { useRoute } from 'vue-router';

  import logoImgUrl from '@/assets/logo.png';
  import bgImgUrl from '@/assets/login-bg.png';

  import { useI18n } from '@/hooks/web/useI18n';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useUserStore } from '@/store/modules/user';
  import { formValidate } from '@/utils/tools';
  import { SlideVerifyExpose } from '@/components/Verify';
  import { isGenCaptcha } from '@/api/sys/user';

  const route = useRoute();
  const userStore = useUserStore();
  const { t } = useI18n();
  const { notification, createMessage } = useMessage();

  const loginFormRef = ref();
  const form = reactive({
    username: '',
    password: '',
  });
  const rules: FormRules = {
    username: [
      {
        validator: (_rule, value, callback) => {
          if (!value || value === '') {
            callback(new Error(t('sys.login.accountPlaceholder')));
          } else {
            callback();
          }
        },
        trigger: 'blur',
      },
    ],
    password: [
      {
        validator: (_rule, value, callback) => {
          if (!value || value === '') {
            callback(new Error(t('sys.login.passwordPlaceholder')));
          } else {
            callback();
          }
        },
        trigger: 'blur',
      },
    ],
  };

  const verifyRef = ref<InstanceType<typeof SlideVerify> & SlideVerifyExpose>();
  const btnLoading = ref(false);
  async function onLogin() {
    await formValidate(loginFormRef);
    btnLoading.value = true;
    try {
      const hasGenCaptcha = await isGenCaptcha(form);
      if (hasGenCaptcha) {
        verifyRef.value?.show();
      } else {
        await afterLogin();
      }
    } catch (e) {
      console.error(e);
      await afterLogin();
    } finally {
      btnLoading.value = false;
    }
  }

  async function afterLogin() {
    btnLoading.value = true;
    try {
      const userInfo = await userStore.login({
        ...form,
        mode: 'none', // 不要默认的错误提示
      });
      if (userInfo) {
        notification.success({
          title: t('sys.login.loginSuccessTitle'),
          message: `${t('sys.login.loginSuccessDesc')}: ${userInfo.loginName}`,
          duration: 3000,
          offset: 30,
        });
      } else {
        createMessage({
          type: 'error',
          message: '该账号无权限登录',
          duration: 1000,
        });
      }
    } catch (error) {
      createMessage({
        type: 'error',
        message: (error as unknown as Error).message || t('sys.api.networkExceptionMsg'),
      });
    } finally {
      btnLoading.value = false;
    }
  }

  async function onVerifySuccess() {
    await afterLogin();
  }

  onMounted(() => {
    if (route.query.token) {
      userStore.setToken(route.query.token as string);
      location.reload();
    }
  });
</script>

<style scoped lang="scss">
  .login {
    height: 100%;
    width: 100%;
    background-color: #1a263b;
    display: flex;
    flex-direction: column;

    &-logo {
      padding-top: 45px;
      padding-left: 40px;

      .logo-img {
        width: 140px;
        height: 30px;
        vertical-align: middle;
      }
    }
    &-container {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: center;
      align-items: center;
      flex: 1;
      background-color: #1a263b;
    }
    &-wrap {
      width: 100%;
      max-width: 1400px;
      padding: 0 30px;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: center;
      align-items: center;
    }

    &-img {
      width: 680px;
      transition: all linear 0.3s;

      img {
        width: 100%;
      }
    }

    &-form {
      background-color: #fff;
      box-sizing: border-box;
      border-radius: 20px;
      padding: 50px 30px 0;
      box-shadow: 0 0 15px 0 rgb(145 190 184 / 15%);
      transition: all linear 0.3s;

      .login-btn {
        height: 50px;
        color: #fff;
        background-color: #ed5d85;
        border-radius: 100px;
        border: none;

        &:hover {
          background-color: #dc406b;
        }
      }
    }

    &-title {
      font-size: 36px;
      font-weight: bold;
      color: #1c305d;
      line-height: 36px;
      margin-bottom: 40px;
    }
  }
</style>
