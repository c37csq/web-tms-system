<template>
  <el-button class="export-btn" round size="small" @click="onExportClick" :loading="exportLoading" v-bind="$attrs">
    <slot>{{ btnText }}</slot>
  </el-button>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import type { PropType } from 'vue';

  import { AxiosResponse } from 'axios';
  import { downloadByData } from '@/utils/file/download';

  import { isArray } from '@/utils/is';

  import { useMessage } from '@/hooks/web/useMessage';
  import { useI18n } from '@/hooks/web/useI18n';

  defineOptions({
    name: 'ExportButton',
    inheritAttrs: false,
  });

  const { t } = useI18n();
  const { createMessage } = useMessage();

  const props = defineProps({
    // 导出分为两种 通过接口参数导出/选择表格数据导出 1 接口 2 数据
    exportType: {
      type: Number as PropType<number>,
      default: 1,
    },
    api: {
      type: Function as PropType<(arg?: any) => Promise<AxiosResponse<any>>>,
      default: null,
    },
    params: {
      type: [Object, Array],
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    isTxtFile: {
      type: Boolean,
      default: false,
    },
  });

  const exportLoading = ref(false);
  const btnText = computed((): string => {
    if (props.exportType === 2) return t('button.selectExport');
    return t('button.export');
  });

  const onExportClick = async () => {
    try {
      if (props.exportType === 2 && isArray(props.params) && !props.params.length) {
        createMessage.info(t('component.excel.exportInfoTip'));
        return;
      }

      exportLoading.value = true;
      const res = await props.api(props.params);

      if (res.data.type === 'application/json') {
        let enc = new TextDecoder('utf-8');
        res.data.arrayBuffer().then((buffer) => {
          const { message } = JSON.parse(enc.decode(new Uint8Array(buffer)));
          createMessage.error(message || '导出失败');
        });
        exportLoading.value = false;
        return;
      }

      downloadByData(res.data, `${props.filename}_${+new Date()}`, props.isTxtFile ? 'text/plain' : res.data.type);
      createMessage.success(t('component.excel.exportSuccessTip'));
    } catch (e) {
      console.error(e);
    } finally {
      exportLoading.value = false;
    }
  };
</script>

<style lang="scss" scoped>
  .export-btn:not(.el-button--text) {
    background-color: #2f9b98;
    border-color: #2f9b98;
    color: #fff;

    &:hover {
      background-color: #218a88;
    }
  }
</style>
