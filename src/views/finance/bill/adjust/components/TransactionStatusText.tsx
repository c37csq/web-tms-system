import { defineComponent, PropType } from 'vue';
import { AdjustStatus } from '@/api/finance/bill';

export default defineComponent({
  name: 'TransactionStatusText',
  props: {
    status: {
      type: Number as PropType<AdjustStatus>,
      required: true,
    },
  },
  setup(props) {
    const stateList = ['', '待审核', '已扣款', '不通过'];
    const classList = ['', 'text-publish', 'text-active', 'text-delete'];
    return () => <span class={classList[props.status]}>{stateList[props.status]}</span>;
  },
});
