<template>
  <div class="rounded-xl">
    <div class="pt-20px px-20px">
      <span class="text-secondary-300 text-lg">15日订单量</span>
    </div>

    <div ref="clientOrderLineRef" :style="{ height: height * 1.6 + 21 + 'px', width }"></div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'ClientOrderLine',
  });
</script>

<script lang="ts" setup>
  import { PropType, Ref, ref, onMounted } from 'vue';
  import { useECharts } from '@/hooks/web/useECharts';
  import { getClientLineData } from '@/api/home';

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

  const clientOrderLineRef = ref<HTMLDivElement | null>(null);

  const { setOptions, resize } = useECharts(clientOrderLineRef as Ref<HTMLDivElement>);

  async function initial() {
    const data = await getClientLineData();
    setOptions({
      tooltip: {
        show: true,
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
      },
      grid: {
        top: '40',
        right: '2%',
        bottom: '20',
        left: '2%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.map((e) => e.day),
      },
      // @ts-ignore
      yAxis: {
        type: 'value',
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
          data: data.map((e) => e.num),
          type: 'line',
          name: '订单量',
          lineStyle: {
            color: '#6e8ed8',
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(110, 142, 216, 0.3)', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(110, 142, 216, 0.11)', // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
      ],
    });
    resize();
  }
  onMounted(() => {
    initial();
  });
</script>
