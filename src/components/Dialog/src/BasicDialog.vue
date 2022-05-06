<template>
  <el-dialog
    append-to-body
    :custom-class="getCustomClass"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :model-value="modelValue"
    :close-icon="CloseIcon"
    @open="() => $emit('open')"
    @opened="() => $emit('opened')"
    @close="onClose"
    @closed="() => $emit('closed')"
    v-bind="$attrs"
  >
    <template #title>
      <slot name="title"></slot>
      {{ !$slots.title ? title : '' }}
    </template>

    <el-scrollbar><slot></slot></el-scrollbar>

    <template #footer v-if="showFooter">
      <slot name="insertFooter"></slot>
      <el-button
        type="primary"
        v-if="showSubmitBtn"
        round
        size="small"
        @click="onSubmit"
        :loading="submitLoading || okLoading"
      >
        {{ submitText ? submitText : t('button.save') }}
      </el-button>
      <slot name="centerFooter"></slot>
      <cancel-button v-if="showCancelBtn" @click="onClose" />
      <slot name="appendFooter"></slot>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { watch, ref, computed } from 'vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { DialogSubmitAction } from './typing';
  import { CloseIcon } from '@/components/Icon';

  defineOptions({
    name: 'BasicDialog',
  });

  const { t } = useI18n();

  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true,
    },
    title: String,
    isScroll: Boolean,
    class: {
      type: String,
      default: '',
    },
    showSubmitBtn: {
      type: Boolean,
      default: true,
    },
    showCancelBtn: {
      type: Boolean,
      default: true,
    },
    submitText: {
      type: String,
      default: '',
    },
    okLoading: Boolean,
    showFooter: {
      type: Boolean,
      default: true,
    },
  });

  const emit = defineEmits(['update:modelValue', 'close', 'open', 'opened', 'closed', 'submit']);

  const getCustomClass = computed((): string => {
    return props.isScroll ? 'basic-dialog basic-dialog-scroll' : `basic-dialog ${props.class}`;
  });

  function changeVisible(visible: boolean) {
    emit('update:modelValue', visible);
  }

  watch(
    () => props.modelValue,
    (val) => {
      submitLoading.value = false;
      changeVisible(val);
    },
  );

  function onClose() {
    emit('close');
    changeVisible(false);
  }

  const submitLoading = ref(false);
  function onSubmit() {
    emit('submit', {
      showLoading: (): void => {
        submitLoading.value = true;
      },
      closeLoading: (): void => {
        submitLoading.value = false;
      },
      closeDialog: (): void => {
        changeVisible(false);
      },
    } as DialogSubmitAction);
  }
</script>
