<template>
  <basic-dialog
    title="修改密码"
    destroy-on-close
    :close-on-press-escape="!isInitialPwd"
    @close="onClose"
    @submit="onSubmit"
    :model-value="modelValue"
    width="600px"
    :show-close="!isInitialPwd"
    :show-cancel-btn="!isInitialPwd"
  >
    <el-form size="small" ref="pwdFormRef" :model="pwdForm" :rules="pwdRules" label-width="100px">
      <el-form-item label="旧密码" prop="oldPass" v-if="!isInitialPwd">
        <el-input v-model="pwdForm.oldPass" show-password autocomplete="off" placeholder="请输入旧密码" />
      </el-form-item>
      <el-form-item label="新密码" prop="pass" required>
        <el-input
          ref="passRef"
          v-model="pwdForm.pass"
          show-password
          autocomplete="off"
          placeholder="请输入新密码(密码不能为纯数字)"
        />
      </el-form-item>
      <el-form-item label="确认新密码" prop="checkPass" required>
        <el-input v-model="pwdForm.checkPass" show-password autocomplete="off" placeholder="请再次输入新密码" />
      </el-form-item>
    </el-form>
  </basic-dialog>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'PwdDialog',
  });
</script>

<script lang="ts" setup>
  import { ref, reactive, unref } from 'vue';
  import { resetForm, submitForm } from '@/utils/tools';
  import { changePassword } from '@/api/sys/user';
  import { ChangePwdParams } from '@/api/sys/model/userModel';
  import { useUserStore } from '@/store/modules/user';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useRoute, useRouter } from 'vue-router';
  import { useWatermark } from '@/hooks/web/useWatermark';
  import { DialogSubmitAction } from '@/components/Dialog';
  import type { ElForm, ElInput } from 'element-plus';

  const { createMessage } = useMessage();

  const prop = withDefaults(defineProps<{ modelValue: boolean; isInitialPwd: boolean }>(), {
    modelValue: false,
    isInitialPwd: false,
  });

  const emit = defineEmits(['update:modelValue']);

  function updateVisible(visible: boolean) {
    emit('update:modelValue', visible);
  }

  const pwdForm = reactive({
    oldPass: '',
    pass: '',
    checkPass: '',
  });
  const pwdFormRef = ref<InstanceType<typeof ElForm>>();
  const passRef = ref<InstanceType<typeof ElInput>>();

  const validatePass = (_rule, value, callback) => {
    if (!value || value === '') {
      callback(new Error('请输入新密码'));
    } else if (value.length < 6) {
      callback(new Error('密码不能低于6位'));
    } else if (Number.isInteger(+value)) {
      callback(new Error('密码不能为纯数字'));
    } else {
      if (pwdForm.checkPass !== '') {
        unref(pwdFormRef)?.validateField('checkPass', () => {});
      }
      callback();
    }
  };
  const validateConfirmPass = (_rule, value, callback) => {
    if (!value || value === '') {
      return callback(new Error('请再次输入新密码'));
    }
    if (Number.isInteger(+value)) {
      callback(new Error('密码不能为纯数字'));
    }
    if (!pwdForm.pass) {
      unref(passRef)?.focus();
      unref(pwdFormRef)?.validateField('pass', () => {});
      return;
    }
    if (pwdForm.pass && value !== pwdForm.pass) {
      return callback(new Error('两次输入密码不一致!'));
    }
    callback();
  };

  const pwdRules = {
    oldPass: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
    pass: [{ required: true, validator: validatePass, trigger: 'blur' }],
    checkPass: [{ required: true, validator: validateConfirmPass, trigger: 'blur' }],
  };

  const userStore = useUserStore();
  const router = useRouter();
  const route = useRoute();
  const { clear } = useWatermark();

  function onClose() {
    updateVisible(false);
    resetForm(unref(pwdFormRef));
  }
  async function onSubmit({ showLoading, closeLoading, closeDialog }: DialogSubmitAction) {
    console.log(prop.isInitialPwd);
    await submitForm(unref(pwdFormRef));
    showLoading();
    try {
      const params: ChangePwdParams = {
        username: userStore.getUserInfo.loginName,
        passwordOld: pwdForm.oldPass || '123456',
        passwordNew: pwdForm.pass,
      };
      await changePassword(params);
      createMessage({
        message: '密码修改成功，即将重新登录',
        type: 'success',
        showClose: true,
        duration: 1000,
        async onClose() {
          clear();
          userStore.setToken(undefined);
          closeDialog();
          await router.replace(`/login?redirect=${route.fullPath}`);
        },
      });
    } catch (e) {
      console.error(e);
    } finally {
      closeLoading();
    }
  }
</script>
