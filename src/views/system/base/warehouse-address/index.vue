<template>
  <div class="warehouse-address" v-loading="dataLoading">
    <el-form size="small" inline class="filter-form" :model="form" ref="filterFormRef">
      <el-form-item label="类型" prop="warehouseType">
        <el-select placeholder="请选择仓库类型" v-model="form.warehouseType" clearable filterable>
          <el-option
            v-for="item in warehouseTypeList"
            :key="item.id"
            :label="item.label"
            :value="item.value.toString()"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="仓库代码" prop="warehouseCode">
        <el-input placeholder="请输入仓库代码" v-model.trim="form.warehouseCode" clearable />
      </el-form-item>
      <el-form-item label="仓库名称" prop="warehouseName">
        <el-input placeholder="请输入仓库名称" v-model.trim="form.warehouseName" clearable />
      </el-form-item>
      <el-form-item label="公司名称" prop="companyName">
        <el-input placeholder="请输入公司名称" v-model.trim="form.companyName" clearable />
      </el-form-item>
      <el-form-item>
        <basic-filter-search @search="onSearch" @reset="onReset" />
      </el-form-item>
    </el-form>

    <div class="mb-20px">
      <add-button @click="operate('add')" v-auth="['system:warehouse:add']" />
      <import-button @click="operate('import')" v-auth="['system:warehouse:import']"> 批量导入仓库 </import-button>
    </div>

    <el-table :data="list" size="small" border stripe>
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :formatter="column.formatter"
      />
      <el-table-column width="100" prop="action" label="操作">
        <template #default="{ row }">
          <template v-if="+row.delFlag">
            <el-button type="text" size="small" @click="operate('recovery', row)" v-auth="['system:warehouse:del']">
              恢复
            </el-button>
          </template>
          <template v-else>
            <el-button type="text" size="small" @click="operate('edit', row)" v-auth="['system:warehouse:edit']">
              编辑
            </el-button>
            <el-button type="text" size="small" @click="operate('del', row)" v-auth="['system:warehouse:del']">
              废弃
            </el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <basic-pagination
      :current="pageParams.pageNum"
      :size="pageParams.pageSize"
      :total="pageParams.total"
      @page-change="onPageChange"
    />

    <import-dialog
      v-model="importData.visible"
      :action="importData.action"
      :params="importData.params"
      :template-url="importData.templateUrl"
      @success="onImportSuccess"
    />

    <basic-dialog
      v-model="dialogVisible"
      width="800px"
      :is-scroll="isEdit"
      :title="getTitle"
      @submit="onSubmit"
      @close="onClose"
      @opened="onOpened"
    >
      <el-form
        inline
        size="small"
        :model="dialogFormData"
        :rules="dialogFormRules"
        ref="dialogFormRef"
        v-loading="dialogFormLoading"
      >
        <el-form-item label="仓库代码" prop="warehouseCode">
          <el-input v-model="dialogFormData.warehouseCode" placeholder="请输入仓库代码" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="仓库名称" prop="warehouseName">
          <el-input v-model="dialogFormData.warehouseName" placeholder="请输入仓库名称" />
        </el-form-item>
        <el-form-item label="类型" prop="warehouseType">
          <el-select placeholder="请选择仓库类型" v-model="dialogFormData.warehouseType" clearable>
            <el-option v-for="item in warehouseTypeList" :key="item.id" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="国家" prop="countryCode">
          <el-select placeholder="请选择国家" v-model="dialogFormData.countryCode" clearable filterable>
            <el-option
              v-for="item in countryList"
              :key="item.stateCode"
              :label="item.stateChineseName"
              :value="item.stateCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="省/州" prop="state">
          <el-input v-model="dialogFormData.state" placeholder="请输入省" />
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-input v-model="dialogFormData.city" placeholder="请输入城市" />
        </el-form-item>
        <el-form-item label="区/县" prop="county">
          <el-input v-model="dialogFormData.county" placeholder="请输入区/县" />
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="dialogFormData.linkman" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系人电话" prop="phoneNo">
          <el-input v-model="dialogFormData.phoneNo" placeholder="请输入联系人电话" />
        </el-form-item>
        <el-form-item label="地址1" prop="streetAddress1">
          <el-input v-model="dialogFormData.streetAddress1" placeholder="请输入地址1" />
        </el-form-item>
        <el-form-item label="地址2" prop="streetAddress2">
          <el-input v-model="dialogFormData.streetAddress2" placeholder="请输入地址2" />
        </el-form-item>
        <el-form-item label="邮编" prop="postcode">
          <el-input v-model="dialogFormData.postcode" placeholder="请输入邮编" />
        </el-form-item>
        <el-form-item label="邮箱" prop="mail">
          <el-input v-model="dialogFormData.mail" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="公司名称" prop="companyName">
          <el-input v-model="dialogFormData.companyName" placeholder="请输入公司名称" />
        </el-form-item>
      </el-form>

      <div v-if="isEdit">
        <h4 class="my-20px">分区方案</h4>
        <el-table :data="dialogFormData.schemeList" size="small" border stripe empty-text="暂无分区方案">
          <el-table-column prop="teamCode" label="产品组" />
          <el-table-column prop="operatorName" label="快递公司" />
          <el-table-column prop="schemeCode" label="分区方案" />
        </el-table>
      </div>
    </basic-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted, h, unref, computed } from 'vue';
  import type { Ref } from 'vue';
  import { useCountryList, useDictData } from '@/hooks/select/useSelect';
  import { CountryItem, DictOptionItem } from '@/api/sys';
  import { PageChangeParams, pageData } from '@/components/Pagination';
  import { WarehouseItem, WarehouseParams, WarehouseSearchParams } from '@/api/system';
  import { BasicTableColumn } from '@/components/Table/';
  import { ImportButton } from '@/components/Button';

  import { formResetFields, formValidate } from '@/utils/tools';
  import { addWarehouse, delWarehouse, getWarehouseByPage, updateWarehouse } from '@/api/system/base/warehouseAddress';
  import { useMessage } from '@/hooks/web/useMessage';
  import ImportDialog from '@/components/Dialog/src/ImportDialog.vue';
  import { importDialogState, UploadApi } from '@/api/sys/upload';
  import { isFullPunctuation } from '@/utils/is';
  import { checkPhoneNumber, checkPostCode } from '@/utils/check';
  import { omit } from 'lodash-es';

  defineOptions({
    name: 'WarehouseAddressManagement',
  });
  const { createConfirm, createBriefSuccessMsg } = useMessage();

  const form = reactive({
    warehouseType: '',
    warehouseCode: '',
    warehouseName: '',
    companyName: '',
  });
  const filterFormRef = ref();
  const warehouseTypeList = ref<DictOptionItem[]>([]);
  const countryList = ref<CountryItem[]>([]);

  const importData = importDialogState(
    UploadApi.Warehouse,
    'https://frontend-tms.obs.ap-southeast-1.myhuaweicloud.com:443/import-template/warehouse-template.xls',
  );
  async function onImportSuccess({ close }) {
    await loadList();
    close && close();
  }

  const pageParams = pageData();
  const onPageChange = (params: PageChangeParams) => {
    params.pageSize && (pageParams.pageSize = params.pageSize);
    params.pageNum && (pageParams.pageNum = params.pageNum);
    loadList();
  };

  async function onSearch() {
    pageParams.pageNum = 1;
    await loadList();
  }
  async function onReset() {
    formResetFields(filterFormRef);
    await loadList();
  }

  const columns: BasicTableColumn[] = [
    { label: '仓库代码', prop: 'warehouseCode' },
    { label: '仓库名称', prop: 'warehouseName' },
    {
      label: '类型',
      prop: 'warehouseType',
      formatter: (_row, _column, cellValue) => {
        return unref(warehouseTypeList).find((item) => +item.value === cellValue)?.label;
      },
    },
    {
      label: '状态',
      prop: 'delFlag',
      formatter: (_row, _column, cellValue) => {
        const statusList = ['可用', '', '废弃'];
        const colorList = ['text-publish', '', 'text-delete'];
        return h(
          'span',
          {
            class: colorList[cellValue],
          },
          statusList[cellValue],
        );
      },
    },
    { label: '国家', prop: 'countryCode' },
    { label: '省/州', prop: 'state' },
    { label: '创建者', prop: 'createBy' },
    { label: '创建时间', prop: 'createTime' },
  ];
  const list = ref<WarehouseItem[]>([]);
  const dataLoading = ref(false);
  async function loadList() {
    try {
      dataLoading.value = true;
      const params: WarehouseSearchParams = {
        pageSize: pageParams.pageSize,
        pageNum: pageParams.pageNum,
      };
      form.warehouseType && (params.warehouseType = form.warehouseType);
      form.warehouseCode && (params.warehouseCode = form.warehouseCode);
      form.warehouseName && (params.warehouseName = form.warehouseName);
      form.companyName && (params.companyName = form.companyName);

      const { list: lists, total, pageNum } = await getWarehouseByPage(params);
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

  const dialogVisible = ref(false);
  const isEdit = ref(false);
  const getTitle = computed(() => (unref(isEdit) ? '编辑' : '新增'));

  const curWarehouseAddress = ref({}) as Ref<WarehouseItem>;

  const dialogFormData = ref({}) as Ref<WarehouseParams>;
  const dialogFormLoading = ref(false);
  const dialogFormRef = ref();
  const dialogFormRules = {
    warehouseCode: [{ required: true, message: '仓库代码不能为空', trigger: 'blur' }],
    warehouseName: [{ required: true, message: '仓库名称不能为空', trigger: 'blur' }],
    warehouseType: [{ required: true, message: '仓库类型不能为空', trigger: 'change' }],
    linkman: [
      {
        required: true,
        validator: (_rule, value, callback) => {
          if (!value || value === '') {
            callback(new Error('联系人不能为空'));
          } else if (isFullPunctuation(value)) {
            callback(new Error('联系人仅允许中文、英文、半角符号'));
          } else {
            callback();
          }
        },
        trigger: 'blur',
      },
    ],
    phoneNo: [{ required: true, validator: checkPhoneNumber, trigger: 'blur' }],
    countryCode: [{ required: true, message: '国家不能为空', trigger: 'change' }],
    state: [{ required: true, message: '省/州不能为空', trigger: 'blur' }],
    city: [{ required: true, message: '城市不能为空', trigger: 'blur' }],
    streetAddress1: [{ required: true, message: '联系地址1不能为空', trigger: 'blur' }],
    companyName: [
      {
        required: true,
        validator: (_rule, value, callback) => {
          if (!value || value === '') {
            callback(new Error('公司名称不能为空'));
          } else if (isFullPunctuation(value)) {
            callback(new Error('公司名称仅允许中文、英文、半角符号'));
          } else {
            callback();
          }
        },
        trigger: 'blur',
      },
    ],
    postcode: [{ required: true, validator: checkPostCode, trigger: 'blur' }],
  };

  async function onSubmit({ showLoading, closeLoading, closeDialog }) {
    await formValidate(dialogFormRef);
    showLoading && showLoading();
    try {
      if (unref(isEdit)) {
        await updateWarehouse({
          warehouseId: unref(curWarehouseAddress).warehouseId,
          ...unref(dialogFormData),
        });
        createBriefSuccessMsg('编辑仓库成功');
      } else {
        await addWarehouse(unref(dialogFormData));
        createBriefSuccessMsg('新建仓库成功');
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
      // 排除 id createBy createTime
      dialogFormData.value = omit(
        unref(curWarehouseAddress),
        'createBy',
        'createTime',
        'warehouseId',
      ) as WarehouseParams;
    }
    dialogFormLoading.value = false;
  }

  type OperateType = 'add' | 'edit' | 'import' | 'recovery' | 'del';
  async function operate(type: OperateType, item?: WarehouseItem) {
    switch (type) {
      case 'add':
      case 'edit':
        isEdit.value = type === 'edit';

        if (unref(isEdit)) {
          curWarehouseAddress.value = item!;
        }

        dialogFormLoading.value = true;
        dialogVisible.value = true;
        break;
      case 'import':
        importData.visible = true;
        break;
      case 'del':
        createConfirm({
          title: '废弃仓库',
          message: `请确认是否废弃仓库代码为《${item!.warehouseCode}》的仓库`,
          type: 'info',
          beforeClose: async (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              try {
                await delWarehouse(item!.warehouseId);
                createBriefSuccessMsg('废弃成功');
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
      case 'recovery':
        createConfirm({
          title: '恢复仓库',
          message: `请确认是否恢复仓库代码为《${item!.warehouseCode}》的仓库`,
          type: 'info',
          beforeClose: async (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              try {
                const params = omit(unref(item), 'createBy', 'createTime');
                params.delFlag = 0;
                await updateWarehouse(params as WarehouseParams);
                createBriefSuccessMsg('恢复成功');
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
    }
  }

  async function initial() {
    warehouseTypeList.value = await useDictData('warehouseType');
    countryList.value = await useCountryList();
    await loadList();
  }
  onMounted(() => {
    initial();
  });
</script>
