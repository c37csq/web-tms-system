<template>
  <div class="menu" v-loading="dataLoading">
    <div class="mb-20px">
      <add-button @click="onClick('add')" />
    </div>

    <el-table
      :data="list"
      border
      stripe
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      size="small"
    >
      <el-table-column
        v-for="item in columns"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :formatter="item.formatter"
      />
      <el-table-column label="图标" width="60">
        <template #default="{ row }">
          <template v-if="row.icon">
            <svg-icon class="cursor-pointer" size="20" :name="row.icon" />
          </template>
        </template>
      </el-table-column>
      <el-table-column width="100" prop="action" label="操作">
        <template #default="{ row }">
          <el-tooltip content="编辑" placement="top">
            <svg-icon class="cursor-pointer" size="28" name="edit" @click.stop="onClick('edit', row)" />
          </el-tooltip>
          <el-tooltip content="编辑" placement="top">
            <svg-icon class="cursor-pointer ml-5" size="28" name="delete" @click.stop="onClick('del', row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <basic-dialog
      v-model="dialogVisible"
      width="600px"
      :title="getTitle"
      @submit="onSubmit"
      @close="onClose"
      @opened="onOpened"
    >
      <el-form
        v-loading="dialogFormLoading"
        label-width="100px"
        size="small"
        :model="menuFormData"
        :rules="menuFormRules"
        ref="menuFormRef"
      >
        <el-form-item label="类型" prop="type">
          <div style="line-height: 20px">
            <el-radio-group v-model="menuType" @change="onTypeChange">
              <el-radio-button :label="1">菜单</el-radio-button>
              <el-radio-button :label="2">二级菜单目录</el-radio-button>
              <el-radio-button :label="3">权限</el-radio-button>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="menuFormData.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="path" prop="path" v-if="[1, 2].includes(menuType)">
          <el-input v-model.trim="menuFormData.path" placeholder="页面path, 根菜单需要/开头" />
        </el-form-item>
        <el-form-item label="redirect" prop="redirect" v-if="[1, 2].includes(menuType)">
          <el-input v-model="menuFormData.redirect" placeholder="请输入重定向地址" />
        </el-form-item>
        <el-form-item label="Name" prop="name" v-if="[1, 2].includes(menuType)">
          <el-input v-model.trim="menuFormData.name" placeholder="name需要唯一且与组件name一致" />
        </el-form-item>
        <el-form-item label="组件地址" prop="component" v-if="menuType === 1">
          <el-input v-model.trim="menuFormData.component" placeholder="请输入组件地址" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="menuFormData.sort" placeholder="请输入排序值" />
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentId">
          <el-cascader
            v-model="menuFormData.parentId"
            placeholder="请选择上级菜单"
            :options="menuSelectData"
            filterable
            :props="{ label: 'title', value: 'id', checkStrictly: true, emitPath: false }"
          >
            <template #default="{ node, data }">
              <span>{{ data.title }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
        <el-form-item label="相关权限" prop="permission">
          <el-input v-model.trim="menuFormData.permission" placeholder="请输入按钮相关权限(R: order:xxx menu:xxx)" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon" v-if="menuType === 1">
          <el-input v-model="menuFormData.icon" readonly placeholder="请点击右侧选择图标">
            <template #append>
              <span class="cursor-pointer" @click="iconDialogVisible = true">选择图标</span>
              <span class="cursor-pointer ml-2" @click="menuFormData.icon = ''">清除</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="是否隐藏" prop="hidden" v-if="[1, 2].includes(menuType)">
          <div style="line-height: 20px">
            <el-radio-group v-model="menuFormData.hideMenu">
              <el-radio-button :label="false">否</el-radio-button>
              <el-radio-button :label="true">是</el-radio-button>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item label="是否忽略缓存" prop="ignoreKeepAlive" v-if="menuType === 1">
          <div style="line-height: 20px">
            <el-radio-group v-model="menuFormData.ignoreKeepAlive">
              <el-radio-button :label="false">否</el-radio-button>
              <el-radio-button :label="true">是</el-radio-button>
            </el-radio-group>
          </div>
        </el-form-item>
      </el-form>
    </basic-dialog>

    <el-dialog title="选择图标" v-model="iconDialogVisible">
      <ul class="flex items-center justify-evenly">
        <li
          v-for="item in menuIconList"
          :key="item.id"
          class="*flex-center flex-col cursor-pointer"
          @click="onIconSelect(item)"
        >
          <svg-icon size="24" :name="item.icon" />
          <span class="mt-2">{{ item.label }}</span>
        </li>
      </ul>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, unref, computed } from 'vue';
  import type { Ref } from 'vue';
  import { columns } from './data';
  import { menuIconList } from './data';
  import { addMenu, delMenu, getMenuList, getOneMenu, MenuListItem, MenuParams, updateMenu } from '@/api/system';
  import { formValidate, formResetFields } from '@/utils/tools';
  import { useMessage } from '@/hooks/web/useMessage';
  import { omit } from 'lodash-es';

  defineOptions({
    name: 'MenuManagement',
  });

  const { createConfirm, createBriefSuccessMsg } = useMessage();

  const dataLoading = ref(false);
  const list = ref([]) as Ref<MenuListItem[]>;
  async function loadList() {
    try {
      dataLoading.value = true;
      list.value = await getMenuList();
    } catch (e) {
      console.error(e);
    } finally {
      dataLoading.value = false;
    }
  }

  onMounted(() => {
    loadList();
  });

  const dialogVisible = ref(false);
  const isEdit = ref(false);
  const curMenu = ref({}) as Ref<MenuListItem>;
  const dialogFormLoading = ref(false);
  const getTitle = computed(() => (unref(isEdit) ? '编辑菜单' : '新增菜单'));

  const menuFormRef = ref();
  const menuType = ref(1); // 1 菜单 2 二级目录 3 按钮权限
  const menuFormData = ref({
    title: '',
    path: '',
    name: '',
    component: '',
    icon: '',
    parentId: '',
    permission: '',
    sort: '',
    hideMenu: false,
    isSecondary: false,
    ignoreKeepAlive: false,
  }) as Ref<MenuParams>;
  const menuFormRules = computed(() => {
    return {
      title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
      path: [{ required: [1, 2].includes(unref(menuType)), message: '请输入path', trigger: 'blur' }],
      name: [{ required: [1, 2].includes(unref(menuType)), message: '请输入菜单name', trigger: 'blur' }],
      parentId: [{ required: [2, 3].includes(unref(menuType)), message: '请选择上级菜单', trigger: 'blur' }],
      permission: [{ required: unref(menuType) === 3, message: '请输入相关角色', trigger: 'blur' }],
    };
  });

  function onTypeChange() {
    menuFormRef.value?.clearValidate(['title', 'permission', 'parentId', 'path', 'name']);
  }
  const menuSelectData = ref([]) as Ref<MenuListItem[]>;

  async function onSubmit({ showLoading, closeLoading, closeDialog }) {
    await formValidate(menuFormRef);
    showLoading && showLoading();

    let params: MenuParams = {
      title: menuFormData.value.title,
    };
    if (unref(menuType) === 3) {
      params.sort = menuFormData.value.sort;
      params.parentId = menuFormData.value.parentId;
      params.permission = menuFormData.value.permission;
    } else if (unref(menuType) === 2) {
      menuFormData.value.isSecondary = true;
      params = omit(unref(menuFormData), 'id', 'component');
    } else {
      params = omit(unref(menuFormData), 'id');
    }

    try {
      if (!menuFormData.value.parentId) delete params.parentId;
      if (unref(isEdit)) {
        await updateMenu({ ...params, id: unref(curMenu).id });
        createBriefSuccessMsg(`更新《${unref(menuFormData).title}》菜单成功`);
      } else {
        await addMenu(params);
        createBriefSuccessMsg(`新建《${unref(menuFormData).title}》菜单成功`);
      }
      closeDialog && closeDialog();
    } catch (e) {
      console.error(e);
    } finally {
      await loadList();
      closeLoading && closeLoading();
    }
  }
  function onClose() {
    formResetFields(menuFormRef);
  }
  async function onOpened() {
    if (unref(isEdit)) {
      const res = await getOneMenu(unref(curMenu).id);
      if (res.isSecondary) {
        menuType.value = 2;
      } else {
        menuType.value = res.path ? 1 : 3;
      }
      menuFormData.value = res;
    }
    dialogFormLoading.value = false;
  }

  const iconDialogVisible = ref(false);
  function onIconSelect(item) {
    createBriefSuccessMsg(`已选择${item.label}图标`);
    menuFormData.value.icon = item.icon;
    iconDialogVisible.value = false;
  }

  async function onClick(type: 'add' | 'edit' | 'del', item?: MenuListItem) {
    switch (type) {
      case 'del':
        createConfirm({
          message: `此操作将永久删除《${item!.title}》该菜单, 是否继续?`,
          title: '菜单删除',
          type: 'warning',
          beforeClose: async (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              try {
                await delMenu(item!.id);
                createBriefSuccessMsg('删除成功');
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
          .then(() => {
            loadList();
          })
          .catch(() => {});
        break;
      case 'add':
      case 'edit':
        isEdit.value = type === 'edit';
        menuSelectData.value = await getMenuList({ type: 1 });
        dialogFormLoading.value = true;

        if (unref(isEdit)) {
          curMenu.value = item!;
        }

        dialogVisible.value = true;
        break;
    }
  }
</script>
