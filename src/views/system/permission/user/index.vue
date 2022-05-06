<template>
  <div class="user" v-loading="dataLoading">
    <el-form size="small" inline class="filter-form">
      <el-form-item label="用户账号">
        <el-input clearable placeholder="请输入账号" v-model="form.loginName" />
      </el-form-item>
      <el-form-item label="角色选择">
        <el-select v-model="form.roleId" placeholder="请选择角色" clearable filterable>
          <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <basic-filter-search @search="onSearch" @reset="onReset" />
      </el-form-item>
    </el-form>

    <div class="mb-20px">
      <add-button @click="onAddClick" />
    </div>

    <el-table :data="list" size="small" border stripe>
      <el-table-column
        v-for="item in columns"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :formatter="item.formatter"
      />
      <el-table-column prop="action" label="操作">
        <template #default="scope">
          <el-button type="text" size="small" @click="onActionClick('edit', scope.row)"> 编辑 </el-button>
          <el-button type="text" size="small" @click="onActionClick('reset', scope.row)"> 重置密码 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <basic-pagination
      :current="pageParams.pageNum"
      :size="pageParams.pageSize"
      :total="pageParams.total"
      @page-change="onPageChange"
    />

    <basic-dialog
      v-model="dialogVisible"
      width="620px"
      :title="getTitle"
      @submit="onSubmit"
      @close="onDialogClose"
      @opened="onOpened"
    >
      <el-form
        v-loading="dialogFormLoading"
        label-width="90px"
        size="small"
        :model="userFormData"
        :rules="userFormRules"
        ref="userFormRef"
        inline
      >
        <el-form-item label="账号" prop="loginName">
          <el-input v-model="userFormData.loginName" :disabled="isEdit" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="姓名" prop="nickName">
          <el-input v-model="userFormData.nickName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="所属企业" prop="enterpriseRecordId">
          <el-select
            v-model="userFormData.enterpriseRecordId"
            placeholder="请选择所属企业"
            :disabled="isEdit"
            filterable
          >
            <el-option
              v-for="item in enterpriseList"
              :key="item.id"
              :label="`${item.enterpriseAbbr}[${item.clientCode}]`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <el-select v-model="userFormData.roleIds" multiple placeholder="请选择相关角色">
            <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id" filterable />
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userFormData.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号" prop="tel">
          <el-input v-model="userFormData.tel" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="qq" prop="qq">
          <el-input v-model="userFormData.qq" placeholder="请输入qq" />
        </el-form-item>
        <el-form-item label="是否锁定" prop="locked" v-if="isEdit">
          <div style="line-height: 20px">
            <el-radio-group v-model="userFormData.locked">
              <el-radio-button :label="false">否</el-radio-button>
              <el-radio-button :label="true">是</el-radio-button>
            </el-radio-group>
          </div>
        </el-form-item>
      </el-form>
    </basic-dialog>
  </div>
</template>

<script lang="ts" setup>
  import type { Ref } from 'vue';
  import { computed, onMounted, reactive, ref, unref } from 'vue';
  import { columns } from './data';
  import { PageChangeParams, pageData } from '@/components/Pagination';
  import { useMessage } from '@/hooks/web/useMessage';

  defineOptions({
    name: 'UserManagement',
  });

  import {
    getUserListByPage,
    getUserRoleList,
    resetUserPass,
    getUserEnterpriseList,
    addUser,
    getUserInfoById,
    updateUser,
    UserParams,
    RoleListGetResultModel,
    UserListItem,
    UserPageParams,
    EnterpriseListGetResultModel,
  } from '@/api/system';
  import BasicPagination from '@/components/Pagination/src/BasicPagination.vue';

  const { createConfirm, createBriefSuccessMsg } = useMessage();

  const form = reactive({
    loginName: undefined,
    roleId: undefined,
  });
  const roleList = ref([]) as Ref<RoleListGetResultModel>;
  const enterpriseList = ref([]) as Ref<EnterpriseListGetResultModel>;

  function onSearch() {
    pageParams.pageNum = 1;
    loadList();
  }
  function onReset() {
    form.loginName = undefined;
    form.roleId = undefined;
    loadList();
  }

  const list = ref<UserListItem[]>([]);
  const dataLoading = ref(false);
  async function loadList() {
    dataLoading.value = true;
    try {
      const params: UserPageParams = {
        pageNum: pageParams.pageNum,
        pageSize: pageParams.pageSize,
      };
      form.loginName && (params.loginName = form.loginName);
      form.roleId && (params.roleId = form.roleId);
      const { list: lists, total, pageNum } = await getUserListByPage(params);

      list.value = lists.filter((e) => !e.delFlag);
      pageParams.total = total;
      pageParams.pageNum = pageNum;
    } catch (e) {
      console.error(e);
    } finally {
      dataLoading.value = false;
    }
  }

  const pageParams = pageData();
  const onPageChange = (params: PageChangeParams) => {
    params.pageSize && (pageParams.pageSize = params.pageSize);
    params.pageNum && (pageParams.pageNum = params.pageNum);
    loadList();
  };

  async function initial() {
    roleList.value = await getUserRoleList();
    await loadList();
    enterpriseList.value = await getUserEnterpriseList();
  }

  onMounted(() => {
    initial();
  });

  const dialogVisible = ref(false);
  const dialogFormLoading = ref(false);
  const isEdit = ref(false);
  const curUserId = ref() as Ref<string>;
  const getTitle = computed(() => (unref(isEdit) ? '编辑用户' : '新增用户'));

  const userFormData = ref({
    loginName: '',
    nickName: '',
    enterpriseRecordId: '',
    email: '',
    tel: '',
    qq: '',
    roleLists: [],
    roleIds: [],
    locked: false,
  }) as Ref<UserParams>;
  const userFormRules = {
    loginName: [{ required: true, message: '请输入账号', trigger: 'blur' }],
    nickName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
    enterpriseRecordId: [{ required: true, message: '请选择所属企业', trigger: 'change' }],
    roleIds: [{ required: true, message: '请选择相关角色', trigger: 'change' }],
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: 'input' },
    ],
    tel: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      {
        pattern: /^((0\d{2,3}-\d{7,8})|(1\d{10}))$/,
        message: '请输入合法手机号',
        trigger: 'input',
      },
    ],
  };

  const userFormRef = ref();
  function onSubmit({ showLoading, closeLoading, closeDialog }) {
    userFormRef.value?.validate(async (isValid: boolean) => {
      if (!isValid) return;
      showLoading && showLoading();
      userFormData.value.roleLists = userFormData.value.roleIds.map((id) => ({ id }));
      try {
        if (unref(isEdit)) {
          userFormData.value.id = unref(curUserId);
          await updateUser(unref(userFormData));
          createBriefSuccessMsg('编辑用户成功');
        } else {
          await addUser(unref(userFormData));
          createBriefSuccessMsg('新建用户成功');
        }
        closeDialog && closeDialog();
      } catch (e) {
        console.error(e);
      } finally {
        await loadList();
        closeLoading && closeLoading();
      }
    });
  }
  function onDialogClose() {
    userFormRef.value?.resetFields();
  }

  async function onOpened() {
    if (unref(isEdit)) {
      const { localUser: user, roleIds, roleList: selectRoleList } = await getUserInfoById({ id: unref(curUserId) });
      userFormData.value.id = user.id;
      userFormData.value.loginName = user.loginName;
      userFormData.value.nickName = user.nickName;
      userFormData.value.enterpriseRecordId = user.enterpriseRecordId;
      userFormData.value.roleIds = roleIds;
      userFormData.value.email = user.email;
      userFormData.value.tel = user.tel;
      userFormData.value.qq = user.qq;
      userFormData.value.locked = user.locked;
      roleList.value = selectRoleList;
    } else {
      roleList.value = await getUserRoleList();
      userFormRef.value.resetFields();
    }
    dialogFormLoading.value = false;
  }

  async function onAddClick() {
    isEdit.value = false;
    dialogVisible.value = true;
  }

  type ActionType = 'edit' | 'reset';
  function onActionClick(type: ActionType, item: UserListItem) {
    if (type === 'edit') {
      dialogVisible.value = true;
      dialogFormLoading.value = true;
      isEdit.value = true;
      curUserId.value = item.id;
    } else {
      createConfirm({
        title: '密码重置',
        type: 'info',
        message: `此操作将重置《${item.loginName}》密码, 是否继续?`,
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            try {
              await resetUserPass({ id: item.id });
              createBriefSuccessMsg('重置密码成功');
            } catch (e) {
              console.error(e);
            } finally {
              done();
              instance.confirmButtonLoading = false;
            }
          } else {
            done();
          }
        },
      })
        .then(() => {})
        .catch(() => {});
    }
  }
</script>
