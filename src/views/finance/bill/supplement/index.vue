<template>
  <div class="supplement-bill">
    <el-form size="small" inline class="filter-form" :model="form" ref="filterFormRef">
      <el-form-item label="补收账单号" prop="subBillsNumber">
        <el-input placeholder="请输入补收账单号" v-model="form.subBillsNumber" clearable />
      </el-form-item>
      <el-form-item label="账单时间" prop="dateRange">
        <el-date-picker
          v-model="form.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        />
      </el-form-item>
      <el-form-item>
        <basic-filter-search @search="onSearch" @reset="onReset" />
      </el-form-item>
    </el-form>

    <div class="mb-20px">
      <import-button @click="onImport" v-auth="['finance:bill:supplement:operate']"> 导入账单 </import-button>
    </div>

    <el-table :data="list" v-loading="dataLoading" size="small" border stripe>
      <el-table-column label="补收账单号" prop="subBillsNumber" />
      <el-table-column label="账单时间" prop="subBillsDate" />
      <el-table-column label="成本金额" prop="subBillsCostMoney" />
      <el-table-column label="销售金额" prop="subBillsSellMoney" />
      <el-table-column label="系统差异" prop="sysBillsCostMoney" />
      <el-table-column label="重计状态" prop="exeStatus">
        <template #default="{ row }">
          <re-costing-status-text :status="row.exeStatus" />
        </template>
      </el-table-column>
      <el-table-column label="错误提示" prop="exeMsg" />
      <el-table-column label="状态" prop="subBillStatus">
        <template #default="scope">
          <span class="text-delete" v-if="scope.row.subBillStatus === '2'">作废</span>
          <span v-if="scope.row.subBillStatus === '0'">草稿</span>
          <span class="text-active" v-if="scope.row.subBillStatus === '1'">已确认</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人" prop="createBy" />
      <el-table-column label="操作" prop="action">
        <template #default="{ row }">
          <el-dropdown @command="(command) => onOperate(command, row)">
            <span class="text-active el-dropdown-link cursor-pointer">
              更多操作 <el-icon><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <template v-if="row.subBillStatus === '0'">
                  <el-dropdown-item command="costReCosting" v-auth="['finance:bill:supplement:operate']">
                    费用重计
                  </el-dropdown-item>
                  <el-dropdown-item command="againImport" v-auth="['finance:bill:supplement:operate']">
                    二次补收账单导入
                  </el-dropdown-item>
                  <el-dropdown-item
                    command="diffImport"
                    v-if="row.exeStatus !== '0'"
                    v-auth="['finance:bill:supplement:operate']"
                  >
                    导入差异账单
                  </el-dropdown-item>
                </template>
                <el-dropdown-item
                  command="check"
                  v-auth="['finance:bill:supplement:operate']"
                  v-if="row.exeStatus !== '0'"
                >
                  核对账单
                </el-dropdown-item>
                <el-dropdown-item command="saleBill" v-if="row.exeStatus !== '0'"> 销售账单 </el-dropdown-item>
                <el-dropdown-item
                  v-if="row.subBillStatus === '0'"
                  command="confirm"
                  v-auth="['finance:bill:supplement:status']"
                >
                  确认
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="row.subBillStatus === '0'"
                  command="delete"
                  v-auth="['finance:bill:supplement:status']"
                >
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
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
      :title="importState.title"
      destroy-on-close
      append-to-body
      @close="onClose"
      @submit="onSubmit"
      submit-text="确认"
      v-model="importState.visible"
      width="500px"
    >
      <el-form label-width="120px" size="small" :model="importState.form" ref="dialogFormRef">
        <el-form-item
          label="补收账单号："
          prop="subBillNumber"
          :rules="[{ required: true, message: '请输入补收账单号', trigger: 'blur' }]"
        >
          <el-input
            :disabled="importState.type !== 'first'"
            v-model="importState.form.subBillNumber"
            placeholder="请输入补收账单号"
            clearable
          />
        </el-form-item>
        <el-form-item label="附件上传：">
          <el-upload
            :action="UploadApi.CommonUpload"
            :auto-upload="false"
            :show-file-list="false"
            accept=".xlsx,.xls"
            :on-change="onFileChange"
          >
            <div class="*flex-center">
              <import-button>选择文件</import-button>
              <el-tooltip
                :content="importState.fileData.fileName ? importState.fileData.fileName : '请选择文件'"
                placement="top"
              >
                <span
                  class="text-primary text-xl ml-4 text-overflow"
                  style="max-width: 180px"
                  :title="importState.fileData.fileName"
                >
                  {{ importState.fileData.fileName ? importState.fileData.fileName : '未选择文件' }}
                </span>
              </el-tooltip>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                <div class="download-template mt-4">
                  模板:
                  <a
                    class="text-download"
                    href="https://frontend-tms.obs.ap-southeast-1.myhuaweicloud.com/import-template/supplement-bill-template.xlsx"
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    点击下载模板
                  </a>
                </div>
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
    </basic-dialog>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { ImportButton } from '@/components/Button';
  import { ArrowDown } from '@element-plus/icons-vue';
  import ReCostingStatusText from './components/ReCostingStatusText';

  export default defineComponent({
    name: 'SupplementBill',
    components: { ImportButton, ArrowDown, ReCostingStatusText },
  });
</script>

<script lang="ts" setup>
  import { reactive, ref, onMounted } from 'vue';
  import { formResetFields, formValidate } from '@/utils/tools';
  import { getPickerDate } from '@/utils/dateUtil';
  import { PageChangeParams, pageData } from '@/components/Pagination';
  import {
    changeSupplementBillStatus,
    costReCosting,
    exportCostBill,
    exportSellBill,
    getSupplementListByPage,
    importAgainBill,
    importDiffBill,
    importSupplementBill,
    SupplementImportParams,
    SupplementItem,
    SupplementSearchParams,
  } from '@/api/finance/bill';
  import { useMessage } from '@/hooks/web/useMessage';
  import { CommandType } from '@/views/finance/bill/supplement/typing';
  import { AxiosResponse } from 'axios';
  import { Result } from '#/axios';
  import { downloadByData } from '@/utils/file/download';
  import { UploadApi } from '@/api/sys/upload';

  const { createConfirm, createMessage, createBriefSuccessMsg } = useMessage();

  const pageParams = pageData();
  const onPageChange = (params: PageChangeParams) => {
    params.pageSize && (pageParams.pageSize = params.pageSize);
    params.pageNum && (pageParams.pageNum = params.pageNum);
    loadList();
  };

  type FormData = {
    subBillsNumber: string;
    dateRange: string[];
    startBillsDate: string;
    endBillsDate: string;
  };
  const form = reactive<FormData>({
    subBillsNumber: '',
    dateRange: [],
    startBillsDate: '',
    endBillsDate: '',
  });
  const filterFormRef = ref();

  async function onSearch() {
    pageParams.pageNum = 1;
    await loadList();
  }
  async function onReset() {
    formResetFields(filterFormRef);
    await loadList();
  }
  function onImport() {
    importState.type = 'first';
    importState.form.subBillNumber = '';
    importState.visible = true;
  }

  const list = ref<SupplementItem[]>([]);
  const dataLoading = ref(false);
  async function loadList() {
    try {
      dataLoading.value = true;
      const params: SupplementSearchParams = {
        pageSize: pageParams.pageSize,
        pageNum: pageParams.pageNum,
      };
      const { startTime, endTime } = getPickerDate(form.dateRange);
      form.startBillsDate = startTime;
      form.endBillsDate = endTime;

      form.subBillsNumber && (params.subBillsNumber = form.subBillsNumber);
      form.startBillsDate && (params.startBillsDate = form.startBillsDate);
      form.endBillsDate && (params.endBillsDate = form.endBillsDate);
      const { list: lists, total, pageNum } = await getSupplementListByPage(params);
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

  type ImportStateData = {
    visible: boolean;
    title: string;
    type: 'first' | 'diffImport' | 'againImport'; // 首次导入  差异账单 再次导入
    form: {
      subBillNumber: string;
    };
    fileData: {
      fileName: string;
      file: File | '';
    };
  };
  const importState = reactive<ImportStateData>({
    visible: false,
    title: '导入账单',
    type: 'first',
    form: {
      subBillNumber: '',
    },
    fileData: {
      fileName: '',
      file: '',
    },
  });
  const dialogFormRef = ref();

  function onFileChange(file) {
    importState.fileData.fileName = file.name;
    importState.fileData.file = file.raw;
  }

  async function onSubmit({ showLoading, closeLoading, closeDialog }) {
    await formValidate(dialogFormRef);
    if (!importState.fileData.fileName) {
      return createMessage.error('请选择账单附件');
    }
    showLoading();
    try {
      const params: SupplementImportParams = {
        subBillNumber: importState.form.subBillNumber,
        file: importState.fileData.file as File,
      };
      if (importState.type === 'first') {
        const res = (await importSupplementBill(params)) as AxiosResponse<Result>;
        if (res.data.code !== 1) {
          createMessage.error(res.data.message);
        } else {
          createBriefSuccessMsg('导入成功');
          await loadList();
          closeDialog();
        }
      } else if (importState.type === 'diffImport') {
        const res = (await importDiffBill(params)) as AxiosResponse<Result>;
        if (res.data.code !== 1) {
          createMessage.error(res.data.message);
        } else {
          createBriefSuccessMsg('导入成功');
          await loadList();
          closeDialog();
        }
      } else {
        const res = (await importAgainBill(params)) as AxiosResponse<Result>;
        if (res.data.code !== 1) {
          createMessage.error(res.data.message);
        } else {
          createBriefSuccessMsg('导入成功');
          await loadList();
          closeDialog();
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      closeLoading();
    }
  }
  function onClose() {
    formResetFields(dialogFormRef);
    importState.fileData.fileName = '';
    importState.fileData.file = '';
  }

  async function onOperate(command: CommandType, item: SupplementItem) {
    switch (command) {
      case 'costReCosting':
        createConfirm({
          title: '费用重计',
          message: `请确认是否要重新计费`,
          type: 'info',
          beforeClose: async (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              try {
                await costReCosting(item.subBillsNumber);
                await loadList();
                createBriefSuccessMsg('操作成功');
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
        break;
      case 'confirm':
      case 'delete':
        const confirmTitle = command === 'confirm' ? '确认账单' : '删除账单';
        const confirmMsg = command === 'confirm' ? '此操作将修改账单状态为确认' : '请确认是否删除账单';
        const confirmStatus = command === 'confirm' ? '1' : '2';
        createConfirm({
          title: confirmTitle,
          message: confirmMsg,
          type: 'info',
          beforeClose: async (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              try {
                await changeSupplementBillStatus({
                  subBillsNumber: item!.subBillsNumber,
                  billStatus: confirmStatus,
                });
                await loadList();
                createBriefSuccessMsg(`${confirmTitle}成功`);
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
        break;
      case 'check':
      case 'saleBill':
        if (command === 'check') {
          const res = await exportCostBill(item!.subBillsNumber);
          if (res.data.type === 'application/json') {
            createMessage.info('暂无数据');
          } else {
            downloadByData(res.data, `账单号${item.subBillsNumber}的账单核对_${+new Date()}`, res.data.type);
          }
        } else {
          const res = await exportSellBill(item!.subBillsNumber);
          if (res.data.type === 'application/json') {
            createMessage.info('暂无数据');
          } else {
            downloadByData(res.data, `账单号${item.subBillsNumber}的销售账单_${+new Date()}`, res.data.type);
          }
        }
        break;
      case 'againImport':
      case 'diffImport':
        // 再次导入账单 导入差异账单
        importState.type = command;

        importState.form.subBillNumber = item.subBillsNumber;
        importState.title = command === 'againImport' ? '二次补收账单导入' : '导入差异账单';

        importState.visible = true;
        break;
    }
  }
</script>
