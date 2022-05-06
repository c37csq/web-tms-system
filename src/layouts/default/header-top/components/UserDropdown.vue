<template>
  <el-dropdown @command="onCommand">
    <span class="flex items-center">
      {{ username }}
      <SvgIcon name="arrow" size="12" class="ml-2px transform duration-100 hover:(rotate-180 duration-100)" />
      <el-image fit="fill" :src="defaultAvatarUrl" class="w-20px ml-8px" />
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :icon="Lock" command="pwd">
          {{ t('layout.header.dropdownItemPwd') }}
        </el-dropdown-item>
        <el-dropdown-item :icon="Remove" command="logout">
          {{ t('layout.header.dropdownItemLoginOut') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>

  <pwd-dialog v-model="pwdVisible" :is-initial-pwd="isInitialPwd" />
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  import PwdDialog from './PwdDialog.vue';
  export default defineComponent({
    name: 'UserDropdown',
    components: { PwdDialog },
  });
</script>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { Lock } from '@element-plus/icons-vue';
  import { Remove } from '@element-plus/icons-vue';
  import { useUserStore } from '@/store/modules/user';
  import defaultAvatarUrl from '@/assets/default-avatar.png';
  import { useI18n } from '@/hooks/web/useI18n';
  import { SvgIcon } from '@/components/Icon';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useRouter } from 'vue-router';
  import { useWatermark } from '@/hooks/web/useWatermark';

  const { t } = useI18n();
  const { createInfoAlert } = useMessage();

  const pwdVisible = ref(false);
  const isInitialPwd = ref(false);
  const userStore = useUserStore();
  const router = useRouter();
  const { clear } = useWatermark();

  const username = computed(() => userStore.getUserInfo.loginName);
  if (!userStore.getHasChangePwd) {
    isInitialPwd.value = true;
    createInfoAlert({
      title: '提示',
      message: '您当前的登录密码为初始密码，为确保账号安全，请修改密码后再使用',
      confirmButtonText: '去修改',
      showCancelButton: true,
      cancelButtonText: '退出登录',
      cancelButtonClass: 'message-box-cancel-logout-btn',
      closeOnClickModal: false,
      closeOnPressEscape: false,
      showClose: false,
    })
      .then(() => {
        pwdVisible.value = true;
      })
      .catch(async () => {
        clear();
        userStore.setToken(undefined);
        await router.replace('/login');
      });
  }

  type UserDropdownItem = 'logout' | 'pwd';
  const onCommand = (command: UserDropdownItem) => {
    if (command === 'logout') {
      userStore.confirmLoginOut();
    } else if (command === 'pwd') {
      pwdVisible.value = true;
      isInitialPwd.value = false;
    }
  };
</script>
