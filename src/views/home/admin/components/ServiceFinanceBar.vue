<template>
  <div class="rounded-xl">
    <div class="pt-20px px-20px flex items-center">
      <span class="text-secondary-300 text-lg">各服务商收入支出表</span>
      <div class="ml-4">
        <el-date-picker
          size="small"
          :disabled-date="disabledDate"
          v-model="dateRange"
          type="daterange"
          unlink-panels
          range-separator="-"
          start-placeholder="请选择开始日期"
          end-placeholder="请选择结束日期"
          :shortcuts="shortcuts"
          @change="onDateChange"
          :clearable="false"
        />
      </div>
    </div>
    <div ref="serviceFinanceBarRef" :style="{ height: height * 1.8 + 'px', width }"></div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'ServiceFinanceBar',
  });
</script>

<script lang="ts" setup>
  import { onMounted, PropType, Ref, ref, unref } from 'vue';
  import { useECharts } from '@/hooks/web/useECharts';
  import { getAdminBarData } from '@/api/home';
  import { usePermission } from '@/hooks/web/usePermission';
  import { dateUtil, getPickerDate } from '@/utils/dateUtil';

  defineProps({
    width: {
      type: String as PropType<string>,
      default: '100%',
    },
    height: {
      type: Number as PropType<number>,
      default: 166,
    },
  });

  const serviceFinanceBarRef = ref<HTMLDivElement | null>(null);

  const { setOptions, getInstance, resize } = useECharts(serviceFinanceBarRef as Ref<HTMLDivElement>);

  const dateRange = ref([
    dateUtil().subtract(7, 'day').startOf('day').format(),
    dateUtil().subtract(0, 'day').endOf('day').format(),
  ]);
  function disabledDate(time) {
    return time.getTime() > Date.now();
  }
  const shortcuts = [
    {
      text: '本月',
      value: () => {
        const start = dateUtil().subtract(0, 'month').startOf('month').format();
        const end = new Date();
        return [start, end];
      },
    },
    {
      text: '上个月',
      value: () => {
        const start = dateUtil().subtract(1, 'month').startOf('month').format();
        const end = dateUtil().subtract(1, 'month').endOf('month').format();
        return [start, end];
      },
    },
    {
      text: '本年',
      value: () => {
        const start = dateUtil().subtract(0, 'year').startOf('year').format();
        const end = new Date();
        return [start, end];
      },
    },
  ];

  async function initial(startDate: string, endDate: string) {
    getInstance()?.showLoading({
      text: ' ',
      color: '#aebdf5',
      maskColor: 'rgba(255, 255, 255, 0.3)',
      spinnerRadius: 40,
    });
    const { category, incomeData, outlayData } = await getAdminBarData({ startDate, endDate });
    setOptions({
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['收入', '支出'],
        right: '2%',
      },
      grid: {
        left: '3%',
        right: '3%',
        bottom: '6%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: category,
      },
      // @ts-ignore
      yAxis: {
        type: 'value',
        name: '单位（USD）',
        axisLabel: {
          formatter: function (val: number): string[] {
            let tmp: string[] = [];
            if (val > 9999) {
              tmp.push((val / 10000).toFixed(1) + 'W');
            } else if (val > 999) {
              tmp.push((val / 1000).toFixed(1) + 'K');
            } else {
              tmp.push(val.toString());
            }
            return tmp;
          },
        },
      },
      series: [
        {
          name: '收入',
          type: 'bar',
          barWidth: 25,
          color: '#aebdf5',
          data: incomeData,
        },
        {
          name: '支出',
          type: 'bar',
          barWidth: 25,
          color: '#ff8265',
          data: outlayData,
        },
      ],
    });
    resize();
    getInstance()?.hideLoading();
  }

  function onDateChange(val) {
    const { startTime, endTime } = getPickerDate(val);
    initial(startTime, endTime);
  }

  onMounted(() => {
    const { hasPermission } = usePermission();
    const hasServiceFinancePerm = hasPermission('home:service:finance');
    if (hasServiceFinancePerm) {
      const { startTime, endTime } = getPickerDate(unref(dateRange));
      initial(startTime, endTime);
    }
  });
</script>
