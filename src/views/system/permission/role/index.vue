<template>
  <div class="role" v-loading="dataLoading">
    <div class="mb-20px">
      <add-button @click="onClick('add')" />
      <danger-button v-if="!!adminId" @click="onClick('admin')">编辑管理员角色</danger-button>
    </div>

    <el-table :data="list" size="small" border stripe>
      <el-table-column
        v-for="item in columns"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :formatter="item.formatter"
      />
      <el-table-column width="50" prop="action" label="操作">
        <template #default="{ row }">
          <el-tooltip content="编辑" placement="top">
            <svg-icon class="cursor-pointer" size="28" name="edit" @click.stop="onClick('edit', row)" />
          </el-tooltip>
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
      width="600px"
      is-scroll
      :title="getTitle"
      @submit="onSubmit"
      @close="onClose"
      @opened="onOpened"
    >
      <el-form
        v-loading="dialogFormLoading"
        label-width="120px"
        size="small"
        :model="roleFormData"
        :rules="roleFormRules"
        ref="roleFormRef"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="roleFormData.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input
            type="textarea"
            show-word-limit
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="roleFormData.remarks"
            placeholder="请输入角色备注"
          />
        </el-form-item>
        <el-form-item label="父级角色" prop="parentId" v-if="operateType !== 'isAdmin'">
          <el-select
            v-model="roleFormData.parentId"
            :disabled="operateType !== 'isAdd'"
            placeholder="请选择一个父级角色"
            @change="onChangeRole"
          >
            <el-option v-for="item in roleSelectList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="菜单选择" prop="menuSet">
          <el-tree
            ref="treeRef"
            :default-expand-all="expandAll"
            :key="treeKey"
            :data="menuData"
            node-key="id"
            show-checkbox
            :default-checked-keys="menuCheckedData"
            :props="{ children: 'children', label: 'title' }"
          />
        </el-form-item>
      </el-form>

      <template #centerFooter>
        <el-button size="small" round @click="toggleExpandAll">
          {{ expandAll ? '全部收起' : '全部展开' }}
        </el-button>
      </template>
    </basic-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { ref, unref, onMounted, computed } from 'vue';
  import type { Ref } from 'vue';

  defineOptions({
    name: 'RoleManagement',
  });

  import { columns } from './data';

  import {
    addRole,
    getMenuForRole,
    getRoleInfo,
    getRoleList,
    getRoleListByPage,
    getUserIsAdmin,
    MenuItem,
    RoleListItem,
    RolePageParams,
    RoleParams,
    updateRole,
  } from '@/api/system';
  import { PageChangeParams, pageData } from '@/components/Pagination';
  import { capitalize } from 'lodash-es';
  import { formValidate, getAllMenuIds } from '@/utils/tools';
  import { useMessage } from '@/hooks/web/useMessage';

  const { createBriefSuccessMsg } = useMessage();

  const pageParams = pageData();
  const onPageChange = (params: PageChangeParams) => {
    params.pageSize && (pageParams.pageSize = params.pageSize);
    params.pageNum && (pageParams.pageNum = params.pageNum);
    loadList();
  };

  const list = ref([]) as Ref<RoleListItem[]>;
  const dataLoading = ref(false);
  async function loadList() {
    dataLoading.value = true;
    const params: RolePageParams = {
      pageSize: pageParams.pageSize,
      pageNum: pageParams.pageNum,
    };
    try {
      const { list: lists, total, pageNum } = await getRoleListByPage(params);

      list.value = lists;
      pageParams.total = total;
      pageParams.pageNum = pageNum;
    } catch (e) {
      console.error(e);
      pageParams.total = 0;
      list.value = [];
    } finally {
      dataLoading.value = false;
    }
  }

  const adminId = ref('');
  async function isAdminUser() {
    try {
      const { isAdmin } = await getUserIsAdmin();
      adminId.value = isAdmin;
    } catch (e) {
      console.error(e);
      adminId.value = '';
    }
  }

  async function initial() {
    await loadList();
    await isAdminUser();
  }
  onMounted(() => {
    initial();
  });

  const dialogVisible = ref(false);
  const operateType = ref('isAdd');
  const titleMap = {
    isAdd: '新增角色',
    isAdmin: '编辑管理员角色',
    isEdit: '编辑角色',
  };
  const getTitle = computed(() => titleMap[unref(operateType)]);

  const dialogFormLoading = ref(false);
  const roleFormData = ref({}) as Ref<RoleParams>;
  const roleFormRules = {
    name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
    parentId: [{ required: true, message: '请选择父级角色', trigger: 'change' }],
  };
  const curRole = ref({}) as Ref<RoleParams>;

  const roleFormRef = ref();
  async function onSubmit({ showLoading, closeLoading, closeDialog }) {
    await formValidate(roleFormRef);
    showLoading && showLoading();

    const AllMenuIds = [...treeRef.value?.getCheckedKeys(), ...treeRef.value?.getHalfCheckedKeys()];
    roleFormData.value.menuSet = AllMenuIds.map((id) => ({ id }));
    try {
      if (unref(operateType) === 'isAdd') {
        await addRole(unref(roleFormData));
        createBriefSuccessMsg('新增角色成功');
      } else {
        roleFormData.value.id = unref(operateType) === 'isAdmin' ? unref(adminId) : unref(curRole).id;
        await updateRole(unref(roleFormData));
        createBriefSuccessMsg('修改角色成功');
      }
      closeDialog && closeDialog();
      await loadList();
    } catch (e) {
      console.error(e);
    } finally {
      closeLoading && closeLoading();
    }
  }
  function onClose() {
    roleFormRef.value?.resetFields();
    menuData.value = [];
    menuCheckedData.value = [];
  }
  function onOpened() {
    if (operateType.value !== 'isAdd') {
      roleFormData.value.name = curRole.value.name;
      roleFormData.value.remarks = curRole.value.remarks;
      if (unref(operateType) !== 'isAdmin') roleFormData.value.parentId = curRole.value.parentId;
    }
    dialogFormLoading.value = false;
  }

  const roleSelectList = ref([]) as Ref<RoleListItem[]>;

  const treeRef = ref();
  const menuData = ref([]) as Ref<MenuItem[]>;
  const defaultMenuIds = ref<string[]>([]); // 编辑的时候默认选中的menuIds
  const menuCheckedData = ref<string[]>([]);
  async function onChangeRole(id) {
    menuData.value = [];
    menuData.value = await getMenuForRole({ parentId: id });
  }

  const expandAll = ref(false);
  const treeKey = ref(1);
  function toggleExpandAll() {
    expandAll.value = !expandAll.value;
    treeKey.value++;
  }

  async function onClick(type: 'add' | 'edit' | 'admin', item?: RoleListItem) {
    operateType.value = 'is' + capitalize(type);
    if (type !== 'admin') {
      roleSelectList.value = await getRoleList();
    }

    if (type !== 'add') {
      const id = type === 'admin' ? unref(adminId) : item!.id;
      const { menuIds, menuList, role } = await getRoleInfo({ id });
      curRole.value = role;
      menuData.value = menuList;
      defaultMenuIds.value = menuIds;
      const allMenuIds = getAllMenuIds(menuList);
      menuCheckedData.value = allMenuIds.filter((menuId) => menuIds.includes(menuId));
      dialogFormLoading.value = true;
    }

    dialogVisible.value = true;
  }
</script>
