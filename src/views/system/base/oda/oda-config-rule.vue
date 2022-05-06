<template>
  <div class="oda-config-rule" v-loading="dataLoading">
    <div class="mb-20px text-xl">{{ route.params.name }}配置规则</div>

    <el-form size="small" inline class="filter-form" :model="form" ref="filterFormRef">
      <el-form-item label="ODA额外服务" prop="extraServiceCode">
        <el-select placeholder="请选择ODA额外服务" v-model="form.extraServiceCode" clearable filterable>
          <el-option
            v-for="item in extraServiceList"
            :key="item.extraServiceId"
            :label="item.extraServiceNameCn"
            :value="item.extraServiceCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="国家" prop="state">
        <el-select placeholder="请选择国家" v-model="form.state" clearable filterable>
          <el-option
            v-for="item in countryList"
            :key="item.stateCode"
            :label="item.stateChineseName"
            :value="item.stateCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="邮编" prop="postcode">
        <el-input placeholder="请输入邮编" v-model.trim="form.postcode" clearable />
      </el-form-item>
      <el-form-item>
        <basic-filter-search @search="onSearch" @reset="onReset" />
      </el-form-item>
    </el-form>

    <div class="mb-20px">
      <add-button @click="operate('add')" v-auth="['system:odaRule:add']" />
      <danger-button @click="operate('batchDel')" :disabled="!selectOdaList.length" v-auth="['system:odaRule:del']">
        批量删除
      </danger-button>
      <import-button @click="operate('import')" v-auth="['system:odaRule:import']" />
      <export-button :api="exportOdaRule" :params="{ odaId }" :filename="`${route.params.name}配置规则`" />
    </div>

    <el-table :data="list" size="small" border stripe @selection-change="onSelectionChange">
      <el-table-column type="selection" width="50" />
      <el-table-column prop="state" label="国家" />
      <el-table-column prop="postcode" label="邮编" />
      <el-table-column prop="extraServiceCode" label="ODA额外服务" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="action" label="操作">
        <template #default="scope">
          <el-button type="text" size="small" @click="operate('edit', scope.row)" v-auth="['system:odaRule:edit']">
            编辑
          </el-button>
          <el-button type="text" size="small" @click="operate('del', scope.row)" v-auth="['system:odaRule:del']">
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
      width="500px"
      :title="getTitle"
      @submit="onSubmit"
      @close="onClose"
      @opened="onOpened"
    >
      <el-form
        label-width="120px"
        size="small"
        :model="dialogFormData"
        :rules="dialogFormRules"
        ref="dialogFormRef"
        v-loading="dialogFormLoading"
      >
        <el-form-item label="国家" prop="state">
          <el-select placeholder="请选择国家" v-model="dialogFormData.state" filterable>
            <el-option
              v-for="item in countryList"
              :key="item.stateCode"
              :label="item.stateChineseName"
              :value="item.stateCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="邮编" prop="postcode">
          <el-input v-model="dialogFormData.postcode" placeholder="请输入邮编" />
        </el-form-item>
        <el-form-item label="ODA额外服务" prop="extraServiceCode">
          <el-select placeholder="请选择ODA额外服务" v-model="dialogFormData.extraServiceCode" filterable>
            <el-option
              v-for="item in extraServiceList"
              :key="item.extraServiceId"
              :label="item.extraServiceNameCn"
              :value="item.extraServiceCode"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </basic-dialog>

    <import-dialog
      v-model="odaRuleImportState.visible"
      :action="odaRuleImportState.action"
      :params="odaRuleImportState.params"
      :template-url="odaRuleImportState.templateUrl"
      @success="onImportSuccess"
    />
  </div>
</template>

<script lang="ts" setup>
  import type { Ref } from 'vue';
  import { onMounted, ref, unref, reactive, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { useTabs } from '@/hooks/web/useTabs';
  import { ImportButton } from '@/components/Button';
  import { ExportButton } from '@/components/Button';
  import { useCountryList, useExtraServiceList } from '@/hooks/select/useSelect';
  import { CountryItem, ExtraServiceItem } from '@/api/sys';
  import {
    addOdaRule,
    delOdaRule,
    getOdaRuleByPage,
    updateOdaRule,
    exportOdaRule,
    OdaRuleItem,
    OdaRuleParams,
    OdaRuleSearchParams,
  } from '@/api/system';
  import { PageChangeParams, pageData } from '@/components/Pagination';
  import { filter } from 'lodash-es';
  import { formResetFields, formValidate } from '@/utils/tools';
  import ImportDialog from '@/components/Dialog/src/ImportDialog.vue';
  import { importDialogState, UploadApi } from '@/api/sys/upload';
  import { useMessage } from '@/hooks/web/useMessage';

  defineOptions({
    name: 'OdaConfigRule',
  });

  const route = useRoute();
  const odaId = ref(route.params!.id);

  const { setTitle } = useTabs();

  const { createConfirm, createBriefSuccessMsg } = useMessage();

  const form = reactive({
    extraServiceCode: '',
    postcode: '',
    state: '',
  });
  const filterFormRef = ref();
  const list = ref<OdaRuleItem[]>([]);
  const dataLoading = ref(false);
  async function loadList() {
    try {
      dataLoading.value = true;
      const params: OdaRuleSearchParams = {
        pageSize: pageParams.pageSize,
        pageNum: pageParams.pageNum,
        odaId: +route.params.id,
      };
      form.extraServiceCode && (params.extraServiceCode = form.extraServiceCode);
      form.state && (params.state = form.state);
      form.postcode && (params.postcode = form.postcode);
      const { list: lists, total, pageNum } = await getOdaRuleByPage(params);
      list.value = lists;
      // filter 过滤出中文
      list.value = list.value.map((e) => {
        e.extraServiceName = filter(unref(extraServiceList), {
          extraServiceCode: e.extraServiceCode,
        })[0].extraServiceNameCn;
        return e;
      });
      pageParams.total = total;
      pageParams.pageNum = pageNum;
    } catch (e) {
      console.error(e);
      list.value = [];
      pageParams.total = 0;
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

  const extraServiceList = ref<ExtraServiceItem[]>([]);
  const countryList = ref<CountryItem[]>([]);
  async function initial() {
    extraServiceList.value = await useExtraServiceList();
    countryList.value = await useCountryList();
    await loadList();
  }

  function onSearch() {
    pageParams.pageNum = 1;
    loadList();
  }
  function onReset() {
    formResetFields(filterFormRef);
    loadList();
  }

  const selectOdaList = ref<OdaRuleItem[]>([]);
  function onSelectionChange(val: OdaRuleItem[]) {
    selectOdaList.value = val;
  }

  const dialogVisible = ref(false);
  const isEdit = ref(false);
  const getTitle = computed(() => (unref(isEdit) ? '编辑' : '新增'));
  const curOdaRule = ref({}) as Ref<OdaRuleItem>;

  const dialogFormData = reactive<OdaRuleParams>({
    odaId: +route.params!.id,
    extraServiceCode: '',
    postcode: '',
    state: '',
  });
  const dialogFormRules = {
    extraServiceCode: [{ required: true, message: '请选择ODA额外服务', trigger: 'change' }],
    postcode: [{ required: true, message: '请输入邮编', trigger: 'blur' }],
    state: [{ required: true, message: '请选择国家', trigger: 'change' }],
  };
  const dialogFormRef = ref();
  const dialogFormLoading = ref(false);

  async function onSubmit({ showLoading, closeLoading, closeDialog }) {
    await formValidate(dialogFormRef);
    try {
      showLoading && showLoading();

      if (unref(isEdit)) {
        await updateOdaRule({ ...dialogFormData, odaDetailId: unref(curOdaRule).odaDetailId });
        createBriefSuccessMsg('编辑成功');
      } else {
        await addOdaRule(dialogFormData);
        createBriefSuccessMsg('新建成功');
      }

      await loadList();
      closeDialog && closeDialog();
    } finally {
      closeLoading && closeLoading();
    }
  }
  function onClose() {
    formResetFields(dialogFormRef);
  }
  function onOpened() {
    if (unref(isEdit)) {
      dialogFormData.odaId = unref(curOdaRule).odaId;
      dialogFormData.extraServiceCode = unref(curOdaRule).extraServiceCode;
      dialogFormData.postcode = unref(curOdaRule).postcode;
      dialogFormData.state = unref(curOdaRule).state;
    }
    dialogFormLoading.value = false;
  }

  const odaRuleImportState = importDialogState(
    UploadApi.OdaRule,
    'https://frontend-tms.obs.myhuaweicloud.com/import-template/oda-rule.xls',
    { odaid: unref(odaId) },
  );
  async function onImportSuccess({ close }) {
    await loadList();
    close && close();
  }

  const isBatchDel = ref(false);
  type OperateType = 'add' | 'edit' | 'del' | 'batchDel' | 'import' | 'export';
  function operate(type: OperateType, item?: OdaRuleItem) {
    switch (type) {
      case 'del':
      case 'batchDel':
        isBatchDel.value = type === 'batchDel';
        const msg = unref(isBatchDel) ? '批量' : '';
        createConfirm({
          title: '删除ODA',
          message: `请确认是否${msg}删除ODA`,
          type: 'info',
          beforeClose: async (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              try {
                const idList: number[] = unref(isBatchDel)
                  ? unref(selectOdaList).map((e) => e.odaDetailId)
                  : [item!.odaDetailId];
                await delOdaRule(idList);
                createBriefSuccessMsg('删除成功');
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

        if (unref(isEdit)) {
          curOdaRule.value = item!;
        }

        dialogFormLoading.value = true;
        dialogVisible.value = true;
        break;
      case 'import':
        odaRuleImportState.visible = true;
        break;
    }
  }

  onMounted(() => {
    initial();
    setTitle((route.params?.name || 'oda') + '配置规则');
  });
</script>
