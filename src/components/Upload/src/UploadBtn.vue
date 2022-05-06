<template>
  <div class="upload-btn-container">
    <el-upload
      class="upload-btn-content"
      :file-list="fileList"
      :action="action"
      :accept="accept"
      :headers="fileHeaders"
      :on-remove="onFileRemove"
      :on-exceed="onFileExceed"
      :on-change="onFileChange"
      :limit="1"
    >
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
    <slot name="tip">
      <p class="text-sm mt-1">(仅支持{{ accept }}格式文件)</p>
    </slot>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import type { PropType } from 'vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import type { UploadProps, UploadUserFile } from 'element-plus';
  import { getToken } from '@/utils/auth';
  import { UploadApiResult } from '@/api/sys/model/uploadModel';
  import { UploadApi } from '@/api/sys/upload';

  defineOptions({
    name: 'UploadBtn',
  });

  const { createMessage } = useMessage();

  defineProps({
    action: {
      type: String as PropType<string>,
      default: UploadApi.CommonUpload,
    },
    accept: {
      type: String as PropType<string>,
      default: '.xls, .xlsx, .pdf, .doc, .docx',
    },
  });

  const emit = defineEmits(['success', 'process', 'error', 'remove']);
  const fileList = ref<UploadUserFile[]>([]);

  const fileHeaders = {
    Authorization: 'Bearer ' + getToken(),
  };

  const onFileRemove: UploadProps['onRemove'] = () => {
    fileList.value = [];
    emit('remove');
  };

  const onFileChange: UploadProps['onChange'] = (file) => {
    if (file.status === 'success') {
      const fileUrl = (file.response as UploadApiResult)?.data;
      if (fileUrl) {
        emit('success', { fileUrl: (file.response as UploadApiResult)?.data, fileName: file.name });
      } else {
        createMessage.error((file.response as UploadApiResult).message || '文件上传异常');
        emit('error');
      }
    } else {
      emit('process');
    }
  };
  const onFileExceed = () => {
    createMessage.info('一次只能上传一个附件');
  };

  defineExpose({
    setFileList: ({ fileName, fileUrl }: { fileName: string; fileUrl: string }) => {
      if (fileName && fileUrl) {
        fileList.value = [{ name: fileName, url: fileUrl }];
      } else {
        fileList.value = [];
      }
    },
  });
</script>
