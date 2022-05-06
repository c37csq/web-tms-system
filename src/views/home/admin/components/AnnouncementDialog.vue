<template>
  <BasicDialog
    title="公告"
    isScroll
    width="800px"
    destroy-on-close
    append-to-body
    :before-close="onClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="onClose"
    :model-value="visible"
  >
    <div class="container-box">
      <h3 class="text-center text-2xl">{{ item?.messageTitle }}</h3>
      <div v-html="item?.message"></div>
      <div class="mt-6" v-if="item?.fileUrl && item?.fileName">
        附件名称: {{ item.fileName }}
        <a :href="item.fileUrl" target="_blank" class="text-active">下载附件</a>
      </div>
      <div class="mt-6 text-right">{{ item?.createTime }}</div>
    </div>
    <template #footer>
      <div class="is-compel" v-if="canReadChange">
        <el-checkbox :model-value="isRead" @change="onChange">标记为已读</el-checkbox>
      </div>
      <div class="dialog-footer">
        <el-button round size="small" type="primary" @click="onPrev" v-if="isPrev"> 上一条 </el-button>
        <el-button round size="small" type="primary" @click="onNext" v-if="isNext"> 下一条 </el-button>
        <el-button round size="small" @click="onClose" class="cancel-btn">关 闭</el-button>
      </div>
    </template>
  </BasicDialog>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'AnnouncementDialog',
  });
</script>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { MessageItem } from '@/api/home';
  import { computed, ref } from 'vue';
  import { useMessage } from '@/hooks/web/useMessage';

  const props = defineProps({
    visible: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    item: {
      type: Object as PropType<MessageItem>,
    },
    isNext: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    isPrev: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    canOperate: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
  });

  const emit = defineEmits(['update:visible', 'next', 'prev', 'change', 'close']);

  const { createInfoAlert } = useMessage();

  const updateVisible = (val) => {
    emit('update:visible', val);
  };

  const onClose = () => {
    if (!isRead.value && props.item?.isCompel && !props.item.isExpire && props.canOperate) {
      createInfoAlert({
        title: '提示',
        message: '请先勾已读',
      });
      return;
    }

    emit('close', { isExpire: props.item?.isExpire, canOperate: props.canOperate }, () => {
      updateVisible(false);
    });
  };

  const onNext = () => {
    if (!isRead.value && props.item?.isCompel) {
      createInfoAlert({
        title: '提示',
        message: '请先勾已读',
      });
      return;
    }
    emit('next');
  };
  const onPrev = () => {
    emit('prev');
  };

  const canReadChange = computed(() => props.item?.isCompel && !props.item.isExpire && props.canOperate);

  const isRead = ref(props.item!.isRead);
  const onChange = (val) => {
    isRead.value = val;
    emit('change', { id: props.item?.id, val });
  };
</script>

<style scoped lang="scss">
  .container-box {
    padding: 20px;
  }
  .is-compel {
    padding-left: 20px;
    width: 100%;
    display: flex;
    justify-content: flex-start;
  }
</style>
