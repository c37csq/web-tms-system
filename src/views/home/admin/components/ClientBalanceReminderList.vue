<template>
  <div class="rounded-xl bg-white">
    <p class="text-secondary-300 text-lg">客户余额提醒</p>
    <div class="scroll-list text-sm home-scroll mt-20px" :style="{ height: height * 2 - 46 + 'px' }">
      <div class="scroll-list-hd flex items-center">
        <span v-for="item in columns.map((e) => e.label)" :key="item">{{ item }}</span>
      </div>
      <div class="custom-scroll" :style="{ height: height * 2 - 106 + 'px' }">
        <div class="scroll-list-item flex items-center" v-for="(item, i) in list" :key="i" @click="onClick(item)">
          <span v-for="(prop, idx) in columns.map((e) => e.prop)" :key="idx">
            <template v-if="prop !== 'operate'">{{ item[prop] ?? '/' }}</template>
            <slot v-else :row="item" :prop="prop"></slot>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import type { PropType } from 'vue';
  import { ClientItem } from '@/api/home';
  import { BasicClientScrollColumns } from '@/views/home/admin/data';

  export default defineComponent({
    name: 'ClientScrollList',
    props: {
      height: {
        type: Number as PropType<number>,
        required: true,
      },
      list: {
        type: Array as PropType<ClientItem[]>,
        required: true,
      },
      columns: {
        type: Array as PropType<BasicClientScrollColumns[]>,
        required: true,
      },
    },
    emits: ['itemClick'],
    setup(_, { emit }) {
      const onClick = (item) => {
        emit('itemClick', item);
      };
      return {
        onClick,
      };
    },
  });
</script>

<style scoped lang="scss">
  .scroll-list {
    &-hd {
      color: #000;
      background-color: #ecf0f2;
      padding: 10px 0;
    }

    &-item {
      color: #666;
      padding: 10px 0;
      &:nth-child(even) {
        background-color: #f1f5f7;
      }

      &:hover {
        background-color: #f5f7fa;
      }
    }

    .scroll-list-hd span,
    .scroll-list-item span {
      padding: 0 10px;
      flex: 1;
    }
  }
</style>
