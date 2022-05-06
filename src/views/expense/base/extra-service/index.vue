<template>
  <div class="extra-service" v-loading="dataLoading">
    <el-form size="small" inline class="filter-form" :model="form" ref="filterFormRef">
      <el-form-item label="额外服务编号" prop="extraServiceCode">
        <el-input
          placeholder="请输入额外服务编号"
          v-model.trim="form.extraServiceCode"
          @keydown.enter="onSearch"
          clearable
        />
      </el-form-item>
      <el-form-item label="额外服务名称" prop="extraServiceNameCn">
        <el-input
          placeholder="请输入额外服务名称"
          v-model.trim="form.extraServiceNameCn"
          @keydown.enter="onSearch"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <basic-filter-search @search="onSearch" @reset="onReset" />
      </el-form-item>
    </el-form>

    <div class="mb-20px">
      <add-button @click="operate('add')" v-auth="['expenses:extra:add']" />
    </div>

    <el-table :data="list" size="small" border stripe>
      <el-table-column prop="extraServiceCode" label="额外服务编号" />
      <el-table-column prop="extraServiceNameCn" label="额外服务名称" />
      <el-table-column prop="operate" label="操作">
        <template #default="{ row }">
          <el-button type="text" size="small" @click="operate('edit', row)" v-auth="['expenses:extra:edit']">
            编辑
          </el-button>
          <el-button type="text" size="small" @click="operate('del', row)" v-auth="['expenses:extra:del']">
            删除
          </el-button>
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
      width="420px"
      :title="getTitle"
      @submit="onSubmit"
      @close="onClose"
      @opened="onOpened"
    >
      <el-form
        size="small"
        label-width="140px"
        :model="dialogFormData"
        :rules="dialogFormRules"
        ref="dialogFormRef"
        v-loading="dialogFormLoading"
      >
        <el-form-item label="额外服务编号" prop="extraServiceCode">
          <el-input placeholder="请输入额外服务编号" v-model="dialogFormData.extraServiceCode" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="额外服务名称" prop="extraServiceNameCn">
          <el-input placeholder="请输入额外服务名称" v-model="dialogFormData.extraServiceNameCn" />
        </el-form-item>
      </el-form>
    </basic-dialog>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'ExtraServiceManagement',
  });
</script>

<script lang="ts" setup>
  import { ref, onMounted, computed, unref } from 'vue';
  import type { Ref } from 'vue';
  import { PageChangeParams, pageData } from '@/components/Pagination';
  import {
    addExtraService,
    delExtraService,
    ExtraServiceItem,
    ExtraServiceParams,
    ExtraServiceSearchParams,
    getExtraServiceListByPage,
    updateExtraService,
  } from '@/api/expense';
  import { formResetFields, formValidate } from '@/utils/tools';
  import { useMessage } from '@/hooks/web/useMessage';
  import { pick } from 'lodash-es';

  const { createConfirm, createBriefSuccessMsg } = useMessage();

  const pageParams = pageData();
  const onPageChange = (params: PageChangeParams) => {
    params.pageSize && (pageParams.pageSize = params.pageSize);
    params.pageNum && (pageParams.pageNum = params.pageNum);
    loadList();
  };

  const form = ref({}) as Ref<ExtraServiceSearchParams>;
  const filterFormRef = ref();

  async function onSearch() {
    pageParams.pageNum = 1;
    await loadList();
  }
  async function onReset() {
    formResetFields(filterFormRef);
    await loadList();
  }

  const list = ref<ExtraServiceItem[]>([]);
  const dataLoading = ref(false);
  async function loadList() {
    try {
      dataLoading.value = true;
      const params: ExtraServiceSearchParams = {
        pageSize: pageParams.pageSize,
        pageNum: pageParams.pageNum,
      };
      form.value.extraServiceCode && (params.extraServiceCode = form.value.extraServiceCode);
      form.value.extraServiceNameCn && (params.extraServiceNameCn = form.value.extraServiceNameCn);
      const { list: lists, total, pageNum } = await getExtraServiceListByPage(params);
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
  onMounted(() => {
    loadList();
  });

  const dialogVisible = ref(false);
  const isEdit = ref(false);
  const getTitle = computed(() => (unref(isEdit) ? '编辑' : '新增'));
  const dialogFormData = ref({}) as Ref<ExtraServiceParams>;
  const dialogFormRules = {
    extraServiceCode: [{ required: true, message: '额外服务编号不能为空', trigger: 'blur' }],
    extraServiceNameCn: [{ required: true, message: '额外服务名称不能为空', trigger: 'blur' }],
  };
  const dialogFormRef = ref();
  const dialogFormLoading = ref(false);
  const curExtraService = ref({}) as Ref<ExtraServiceItem>;

  async function onSubmit({ showLoading, closeLoading, closeDialog }) {
    await formValidate(dialogFormRef);
    showLoading && showLoading();
    try {
      if (unref(isEdit)) {
        await updateExtraService({
          ...unref(dialogFormData),
          extraServiceId: unref(curExtraService).extraServiceId,
        });
        createBriefSuccessMsg('修改成功');
      } else {
        await addExtraService(unref(dialogFormData));
        createBriefSuccessMsg('新增成功');
      }
      await loadList();
      closeDialog && closeDialog();
    } catch (e) {
      console.error(e);
    } finally {
      closeLoading && closeLoading();
    }
  }
  function onClose() {
    formResetFields(dialogFormRef);
  }
  function onOpened() {
    if (unref(isEdit)) {
      dialogFormData.value = pick(unref(curExtraService), 'extraServiceCode', 'extraServiceNameCn');
    }
    dialogFormLoading.value = false;
  }

  function operate(type: 'add' | 'edit' | 'del', item?: ExtraServiceItem) {
    if (type === 'del') {
      createConfirm({
        title: '删除额外服务',
        message: `请确认是否删除《${item?.extraServiceNameCn}》额外服务`,
        type: 'info',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            try {
              await delExtraService([item!.extraServiceId]);
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
    } else {
      isEdit.value = type === 'edit';

      if (unref(isEdit)) {
        curExtraService.value = item!;
      }

      dialogFormLoading.value = true;
      dialogVisible.value = true;
    }
  }
</script>
