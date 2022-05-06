<template>
  <basic-dialog
    title="导入"
    destroy-on-close
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="onClose"
    @submit="onSubmit"
    submit-text="确认"
    :model-value="modelValue"
    :ok-loading="loading"
    width="400px"
  >
    <el-upload
      ref="importRef"
      :action="action"
      :auto-upload="false"
      :show-file-list="false"
      accept=".xlsx,.xls"
      :data="params"
      :on-change="onFileChange"
    >
      <div class="*flex-center">
        <import-button>选择文件</import-button>
        <el-tooltip :content="fileData.fileName ? fileData.fileName : '请选择文件'" placement="top">
          <span class="text-primary text-xl ml-4 text-overflow" style="max-width: 200px" :title="fileData.fileName">
            {{ fileData.fileName ? fileData.fileName : '未选择文件' }}
          </span>
        </el-tooltip>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          <div class="download-template mt-4" v-if="templateUrl">
            模板:
            <a class="text-download" :href="templateUrl" download target="_blank" rel="noopener noreferrer">
              点击下载模板
            </a>
          </div>
          <p class="mt-1">Tips：只能上传 xls/xlsx 文件</p>
          <template v-if="fileData.errorCode">
            <p class="mt-1">
              <span class="text-delete">{{ fileData.errorMessage }}</span>
              ，请
              <span class="cursor-pointer text-download" @click="onErrorDownload">下载文件</span>
              进行修改
            </p>
          </template>
        </div>
      </template>
    </el-upload>
  </basic-dialog>
</template>

<script lang="ts" setup>
  import type { PropType, Ref } from 'vue';
  import { ref } from 'vue';
  import type { UploadProps, UploadRawFile } from 'element-plus';
  import { downloadByBase64 } from '@/utils/file/download';
  import { commonUpload } from '@/api/sys/upload';
  import { Result } from '#/axios';
  import { AxiosResponse } from 'axios';
  import { ResultEnum } from '@/enums/httpEnum';
  import { useMessage } from '@/hooks/web/useMessage';
  import { ImportButton } from '@/components/Button';

  defineOptions({
    name: 'ImportDialog',
  });

  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    params: {
      type: Object as PropType<any>,
      default: () => ({}),
    },
    templateUrl: String,
  });
  const emit = defineEmits(['update:modelValue', 'success', 'error']);

  function updateVisible(visible: boolean) {
    emit('update:modelValue', visible);
  }

  const { createMessage, createBriefSuccessMsg } = useMessage();
  const loading = ref(false);
  type FileData = {
    fileName: string;
    file: UploadRawFile | File | Blob;

    errorCode: string | number;
    errorData: string;
    errorMessage: string;
  };
  const fileData = ref({}) as Ref<FileData>;
  const onClose = () => {
    fileData.value = {} as FileData;
    loading.value = false;
    updateVisible(false);
  };
  const onSubmit = async () => {
    if (!fileData.value.file) {
      createMessage.info('请选择要导入的文件');
      return;
    }
    loading.value = true;
    try {
      const res = await commonUpload(props.action, {
        file: fileData.value.file,
        ...props.params,
      });
      const { data } = res as AxiosResponse<Result>;
      if (data.code === ResultEnum.SUCCESS) {
        emit('success', {
          getData: () => {
            return data.data;
          },
          close: () => {
            onClose();
          },
        });
        createBriefSuccessMsg(data.message);
      } else if (data.code === ResultEnum.UN_AUTH) {
        createMessage.info(data.message);
      } else if ([ResultEnum.FILE_SOME_SUCCESS, ResultEnum.FILE_ERROR].includes(data.code)) {
        fileData.value.errorData = data.data;
        fileData.value.errorCode = data.code;
        fileData.value.errorMessage = data.message;
        createMessage.error(data.message);
      } else {
        createMessage.error(data.message);
      }
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  const onFileChange: UploadProps['onChange'] = (file) => {
    fileData.value.fileName = file.name;
    fileData.value.file = file.raw as UploadRawFile;

    fileData.value.errorCode = '';
  };

  const onErrorDownload = () => {
    downloadByBase64(fileData.value.errorData, fileData.value.fileName);
  };
</script>
