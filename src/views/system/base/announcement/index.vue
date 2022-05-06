<template>
  <div class="announcement" v-loading="dataLoading">
    <el-form size="small" :model="form" inline class="filter-form" ref="filterFormRef">
      <el-form-item label="有效期" prop="dateRange">
        <el-date-picker
          v-model="form.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        />
      </el-form-item>
      <el-form-item label="强制阅读" prop="compelStatus">
        <el-select placeholder="请选择强制阅读" v-model="form.compelStatus" clearable>
          <el-option label="否" value="0" />
          <el-option label="是" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <basic-filter-search @search="onSearch" @reset="onReset" />
      </el-form-item>
    </el-form>
    <div class="mb-20px">
      <add-button @click="operate('add')" />
    </div>

    <el-table :data="list" size="small" border stripe>
      <el-table-column
        v-for="item in columns"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :formatter="item.formatter"
      />
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button type="text" size="small" @click="operate('edit', row)">编辑</el-button>
          <el-button type="text" size="small" @click="operate('del', row)">删除</el-button>
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
      width="800px"
      :title="getTitle"
      @submit="onSubmit"
      @close="onClose"
      @opened="onOpened"
      destroy-on-close
      class="announcement-dialog"
      :ok-loading="okLoading"
    >
      <el-form
        class="announceForm"
        label-width="120px"
        size="small"
        :model="dialogFormData"
        :rules="dialogFormRules"
        ref="dialogFormRef"
        v-loading="dialogFormLoading"
      >
        <el-form-item label="是否公开" prop="publicStatus">
          <el-select
            @change="onPublicChange"
            placeholder="请选择是否公开"
            v-model="dialogFormData.publicStatus"
            clearable
          >
            <el-option label="否" value="0" />
            <el-option label="是" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item :show-message="dialogFormData.publicStatus !== '1'" label="指定客户" prop="clientCodeList">
          <el-select
            :disabled="dialogFormData.publicStatus === '1'"
            placeholder="请选择指定客户"
            v-model="dialogFormData.clientCodeList"
            filterable
            clearable
            multiple
          >
            <el-option
              v-for="item in clientCodeList"
              :key="item.clientCode"
              :label="`${item.clientCode}[${item.companyName}]`"
              :value="item.clientCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="messageTitle">
          <el-input placeholder="请输入标题" v-model="dialogFormData.messageTitle" clearable />
        </el-form-item>
        <div class="*flex-ac">
          <el-form-item style="display: flex; align-items: center" label="强制阅读" prop="compelStatus">
            <el-select placeholder="请选择强制阅读" v-model="dialogFormData.compelStatus" clearable>
              <el-option label="否" value="0" />
              <el-option label="是" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="有效期" prop="dateRange">
            <el-date-picker
              v-model="dialogFormData.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-form-item>
        </div>
        <el-form-item label="上传附件">
          <upload-btn
            @error="onUploadError"
            @success="onUploadSuccess"
            ref="uploadBtnRef"
            @remove="onFileRemove"
            @process="onUploadProcess"
          />
        </el-form-item>
        <el-form-item label="内容部分" prop="message">
          <Editor :is-disable="false" v-model="editorVal" />
        </el-form-item>
      </el-form>
    </basic-dialog>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import Editor from '@/components/Editor/index.vue';
  import UploadBtn from '@/components/Upload/src/UploadBtn.vue';

  export default defineComponent({
    name: 'AnnouncementManagement',
    components: { Editor, UploadBtn },
  });
</script>

<script lang="ts" setup>
  import { reactive, ref, onMounted, computed, unref } from 'vue';
  import type { Ref } from 'vue';
  import { columns } from './data';
  import { formResetFields, formValidate } from '@/utils/tools';
  import { getPickerDate } from '@/utils/dateUtil';
  import {
    addAnnouncement,
    AnnouncementItem,
    AnnouncementParams,
    AnnouncementSearchParams,
    delAnnouncement,
    getAnnouncementListByPage,
    updateAnnouncement,
  } from '@/api/system';
  import { PageChangeParams, pageData } from '@/components/Pagination';
  import { useClientCodeList } from '@/hooks/select/useSelect';
  import { ClientItem } from '@/api/sys/model/selectModel';
  import { useMessage } from '@/hooks/web/useMessage';
  import { UploadBtnSuccessParams } from '@/components/Upload';
  import { omit } from 'lodash-es';

  const { createBriefSuccessMsg, createConfirm } = useMessage();
  type FormData = {
    dateRange: string[];
    startTime: string;
    endTime: string;
    compelStatus: '' | '0' | '1';
  };
  const form = reactive<FormData>({
    dateRange: [],
    startTime: '',
    endTime: '',
    compelStatus: '',
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

  const pageParams = pageData();
  const onPageChange = (params: PageChangeParams) => {
    params.pageSize && (pageParams.pageSize = params.pageSize);
    params.pageNum && (pageParams.pageNum = params.pageNum);
    loadList();
  };

  const list = ref<AnnouncementItem[]>([]);
  const dataLoading = ref(false);
  async function loadList() {
    try {
      dataLoading.value = true;

      const { startTime, endTime } = getPickerDate(form.dateRange);
      form.startTime = startTime;
      form.endTime = endTime;

      const params: AnnouncementSearchParams = {
        pageSize: pageParams.pageSize,
        pageNum: pageParams.pageNum,
      };
      form.startTime && (params.startTime = form.startTime);
      form.endTime && (params.endTime = form.endTime);
      form.compelStatus && (params.compelStatus = form.compelStatus);
      const { list: lists, total, pageNum } = await getAnnouncementListByPage(params);
      list.value = lists;
      pageParams.total = total;
      pageParams.pageNum = pageNum;
    } catch (e) {
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
  const getTitle = computed(() => (unref(isEdit) ? '编辑公告' : '新增公告'));
  const clientCodeList = ref<ClientItem[]>([]);
  const dialogFormRef = ref();
  type DialogFormData = AnnouncementParams & { dateRange: string[]; clientCodeList: string[] };
  const dialogFormData = reactive<DialogFormData>({
    dateRange: [],
    clientCodeList: [],
    publicStatus: '', // 是否公开（0不公开1公开）;
    clientCodes: '',
    fileUrl: '',
    fileName: '',
    messageTitle: '',
    compelStatus: '',
    startTime: '',
    endTime: '',
    message: '',
  });
  const dialogFormRules = {
    publicStatus: [{ required: true, message: '请选择是否公开', trigger: 'change' }],
    clientCodeList: [
      {
        validator: (_rule, value, callback) => {
          if (value.length === 0 && dialogFormData.publicStatus !== '1') {
            callback(new Error('请选择指定客户'));
          } else {
            callback();
          }
        },
        trigger: 'change',
      },
    ],
    messageTitle: [{ required: true, message: '请输入标题', trigger: 'blur' }],
    compelStatus: [{ required: true, message: '请选择是否强制阅读', trigger: 'change' }],
    dateRange: [{ required: true, message: '请选择有效期', trigger: 'change' }],
    message: [{ required: true, message: '请填写主体内容' }],
  };
  const editorVal = ref('');
  const curAnnouncement = ref({}) as Ref<AnnouncementItem>;
  const dialogFormLoading = ref(false);

  const uploadBtnRef = ref();
  const onUploadSuccess = ({ fileUrl, fileName }: UploadBtnSuccessParams) => {
    dialogFormData.fileUrl = fileUrl;
    dialogFormData.fileName = fileName;
    okLoading.value = false;
  };
  const onUploadError = () => {
    unref(uploadBtnRef).setFileList({ fileName: '', fileUrl: '' });
    okLoading.value = false;
  };
  const onUploadProcess = () => {
    okLoading.value = true;
  };
  const onFileRemove = () => {
    dialogFormData.fileUrl = '';
    dialogFormData.fileName = '';
  };

  function onPublicChange(val) {
    if (val === '1') {
      unref(dialogFormRef).clearValidate(['clientCodeList']);
      dialogFormData.clientCodeList = [];
    }
  }

  const okLoading = ref(false);
  async function onSubmit({ showLoading, closeLoading, closeDialog }) {
    dialogFormData.message = unref(editorVal).trim() === '' ? '' : unref(editorVal);
    await formValidate(dialogFormRef);
    showLoading && showLoading();
    if (dialogFormData.publicStatus === '0') {
      dialogFormData.clientCodes = dialogFormData.clientCodeList.join(',');
    }

    const { startTime, endTime } = getPickerDate(dialogFormData.dateRange);
    dialogFormData.startTime = startTime;
    dialogFormData.endTime = endTime;

    const params = omit(dialogFormData, 'dateRange', 'clientCodeList');
    try {
      if (unref(isEdit)) {
        await updateAnnouncement({ ...params, id: unref(curAnnouncement).id });
        createBriefSuccessMsg('编辑公告成功');
      } else {
        await addAnnouncement(params as AnnouncementParams);
        createBriefSuccessMsg('新建公告成功');
      }
      await loadList();
      closeDialog && closeDialog();
    } finally {
      closeLoading && closeLoading();
    }
  }
  function onClose() {
    formResetFields(dialogFormRef);
    // editorVal.value = '';
  }
  function onOpened() {
    formResetFields(dialogFormRef);
    if (unref(isEdit)) {
      const { startTime, endTime, clientCodes, publicStatus, messageTitle, compelStatus, message, fileUrl, fileName } =
        unref(curAnnouncement);
      if (fileUrl && fileName) {
        unref(uploadBtnRef).setFileList({ fileUrl, fileName });
      }
      dialogFormData.dateRange = [startTime, endTime];
      if (clientCodes) {
        dialogFormData.clientCodeList = clientCodes.split(',');
      }
      dialogFormData.messageTitle = messageTitle;
      dialogFormData.publicStatus = publicStatus;
      dialogFormData.compelStatus = compelStatus;
      dialogFormData.fileUrl = fileUrl;
      dialogFormData.fileName = fileName;
      dialogFormData.message = message;
    } else {
      unref(uploadBtnRef).setFileList({ fileName: '', fileUrl: '' });
    }
    dialogFormLoading.value = false;
  }

  async function operate(type: 'add' | 'edit' | 'del', item?: AnnouncementItem) {
    switch (type) {
      case 'del':
        createConfirm({
          title: '删除公告',
          message: `请确认是否删除《${item?.messageTitle}》公告`,
          type: 'info',
          beforeClose: async (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              try {
                await delAnnouncement(item!.id);
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

        clientCodeList.value = await useClientCodeList();

        if (type === 'edit') {
          curAnnouncement.value = item!;
          editorVal.value = item!.message;
        } else {
          editorVal.value = '';
        }

        dialogFormLoading.value = true;
        dialogVisible.value = true;
        break;
    }
  }
</script>
