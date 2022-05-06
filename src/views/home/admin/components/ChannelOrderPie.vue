<template>
  <div class="rounded-xl">
    <div class="pt-20px px-20px">
      <div class="flex items-center">
        <span class="text-secondary-300 text-lg mr-4">各渠道订单量</span>
        <el-select size="small" placeholder="请选择周期" :model-value="curSelectDate" @change="onChangeChannelDate">
          <el-option v-for="item in filterData" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <p class="text-primary font-bold mt-10px">总数量: {{ totalCount }}</p>
    </div>

    <div ref="channelPieRef" :style="{ height: height * 1.6 + 'px', width }"></div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'ChannelOrderPie',
  });
</script>

<script lang="ts" setup>
  import { Ref, ref, onMounted, unref } from 'vue';
  import type { PropType } from 'vue';
  import { useECharts } from '@/hooks/web/useECharts';
  import { commonPieOptions, filterData } from './chartPieOptions';
  import { getAdminPieData } from '@/api/home';

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

  const channelPieRef = ref<HTMLDivElement | null>(null);
  const curSelectDate = ref('0');
  const totalCount = ref(0);

  const { setOptions } = useECharts(channelPieRef as Ref<HTMLDivElement>);

  async function loadPieData() {
    const { tab2 } = await getAdminPieData({ tab1: 0, tab2: unref(curSelectDate) });
    return tab2;
  }

  async function initial() {
    const pieData = await loadPieData();
    setOptions({
      ...commonPieOptions,
      series: [
        {
          name: '渠道',
          type: 'pie',
          radius: [0, 70],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            formatter: '{name|{b}}\n{time|订单量 {c}}',
            minMargin: 5,
            lineHeight: 16,
            rich: {
              time: {
                fontSize: 10,
                color: '#999',
              },
            },
          },
          labelLine: {
            length: 15,
            length2: 20,
            maxSurfaceAngle: 80,
          },
          data: pieData,
        },
      ],
    });
    totalCount.value = pieData.map((e) => e.value).reduce((cur, pre) => cur + pre, 0);
  }

  onMounted(() => {
    initial();
  });

  async function onChangeChannelDate(val) {
    curSelectDate.value = val;
    await initial();
  }
</script>
