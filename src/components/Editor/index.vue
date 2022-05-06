<template>
  <div class="editor-container">
    <div :id="id"></div>
  </div>
</template>

<script lang="ts">
  import { ref, onMounted, watch } from 'vue';
  import wangeditor from 'wangeditor';

  export default {
    name: 'WangEditor',
    props: {
      // 节点 id
      id: {
        type: String,
        default: 'wangeditor',
      },
      // 是否禁用
      isDisable: {
        type: Boolean,
        default: false,
      },
      // 双向绑定
      modelValue: String,
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
      const editor = ref();
      // 初始化富文本
      // https://www.wangeditor.com/doc/
      const initEditor = () => {
        editor.value = new wangeditor('#wangeditor');
        editor.value.config.placeholder = '请输入内容';
        editor.value.config.uploadImgShowBase64 = true;
        editor.value.config.showLinkImg = false;
        editor.value.config.excludeMenus = ['emoticon', 'video', 'code'];
        onEditorChange();
        editor.value.create();
        editor.value.txt.html(props.modelValue);
        props.isDisable ? editor.value.disable() : editor.value.enable();
      };
      // 内容改变时
      const onEditorChange = () => {
        editor.value.config.onchange = (html: string) => {
          emit('update:modelValue', html);
        };
      };
      // 页面加载时
      onMounted(() => {
        initEditor();
      });

      watch(
        () => props.modelValue,
        (val) => {
          editor.value.txt.html(val);
        },
      );
      return {
        editor,
      };
    },
  };
</script>
