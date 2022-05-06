import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'ReCostingStatusText',
  props: {
    status: {
      type: String as PropType<string>,
      required: true,
    },
  },
  setup(props) {
    //  0 未计费  1 计费中  2 计费成功 3 计费失败
    const stateList = ['未计费', '计费中', '计费成功', '计费失败'];
    const classList = ['text-publish', 'text-active', 'text-invalid', 'text-delete'];
    return () => <span class={classList[+props.status]}>{stateList[+props.status]}</span>;
  },
});
