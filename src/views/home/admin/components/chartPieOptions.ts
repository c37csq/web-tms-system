/**
 * Created By fzq on 2021/12/2 10:22
 */
import { ref } from 'vue';
import { EChartsOption } from 'echarts';

export const commonPieOptions: EChartsOption = {
  // Best Trading 大健 One pizza 华磊
  color: ['#aebdf5', '#80d0ce', '#ed5d85', '#6e8ed8', '#ff8265'],
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)',
  },
  legend: {
    bottom: '15',
    left: 'center',
    // selectedMode: false,
    itemWidth: 10,
    itemHeight: 10,
  },
};

/**
 * 通用过滤数据
 */
export const filterData = ref([
  { id: 1, label: '昨日', value: '0' },
  { id: 1, label: '周', value: '1' },
  { id: 1, label: '月', value: '2' },
]);
