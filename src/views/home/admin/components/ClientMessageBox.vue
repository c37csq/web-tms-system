<template>
  <div class="client-scroll-list home-scroll" :style="{ height: height * 2 - 10 + 'px' }">
    <div class="client-scroll-list-hd text-lg">
      <template v-for="item in filterData" :key="item.label">
        <el-badge
          :value="item.count"
          :hidden="!item.count"
          :max="99"
          class="client-badge-item"
          @click="onChangeFilter(item.value)"
          type="danger"
        >
          <span>{{ item.label }}</span>
          <span :class="[curFilter === item.value && 'active']"></span>
        </el-badge>
      </template>
    </div>
    <div class="custom-scroll text-sm mt-15px" :style="{ height: height * 2 - 82 + 'px' }">
      <ul class="client-scroll-list-bd">
        <li class="client-scroll-list-item" v-for="(item, idx) in list" :key="idx" @click="onOpenDialog(item)">
          <div class="flex items-center">
            <span :class="{ dot: item.haveRead === '0' }"></span>
            <span class="text-overflow">{{ item.messageTitle }}</span>
          </div>
          <div class="flex items-center text-xs ml-10px">
            <span class="text-secondary-600 truncate">{{ item.createTime }}</span>
            <div class="ml-40px" v-if="item.messageType === '0'">
              <template v-if="item.haveRead === '0'">
                <div class="no-read truncate" @click.stop="onRead(item)">标记为已读</div>
              </template>
              <template v-else>
                <span class="text-secondary-600 truncate">已读</span>
              </template>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <announcement-dialog
      v-model:visible="announcementDialogVisible"
      :item="oneAnnouncement"
      :key="announcementDialogKey"
      @change="onChange"
      @close="onClose"
      :can-operate="canOperate"
      :is-next="isNext"
      @next="onNext"
      :is-prev="isPrev"
      @prev="onPrev"
    />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import AnnouncementDialog from '@/views/home/admin/components/AnnouncementDialog.vue';

  export default defineComponent({
    name: 'ClientMessageBox',
    components: { AnnouncementDialog },
  });
</script>

<script lang="ts" setup>
  import { ref, reactive, watchEffect, unref, Ref } from 'vue';
  import type { PropType } from 'vue';
  import { clientMessageRead, getClientMessage, MessageItem } from '@/api/home';
  import { cloneDeep } from 'lodash-es';
  import { useParamsStore } from '@/store/modules/params';

  defineProps({
    height: {
      type: Number as PropType<number>,
      required: true,
    },
  });

  const filterData = reactive([
    { label: '公告栏', count: 0, value: 1 },
    { label: '消息中心', count: 0, value: 0 },
  ]);
  const curFilter = ref(1);
  const onChangeFilter = (val) => {
    curFilter.value = val;
  };

  const appParams = useParamsStore();

  const announcementDialogVisible = ref(false);
  const announcementDialogKey = ref(1);
  const oneAnnouncement = ref({}) as Ref<MessageItem>;
  const isNext = ref(true);
  const isPrev = ref(false);
  const canOperate = ref(true);

  const onNext = () => {
    isPrev.value = true;
    unReadIdx.value++;
    isNext.value = unReadIdx.value < unReadList.value.length - 1;
    oneAnnouncement.value = unReadList.value[unReadIdx.value];
    announcementDialogKey.value++;
  };
  const onPrev = () => {
    isNext.value = true;
    unReadIdx.value--;
    isPrev.value = !!Math.max(unReadIdx.value, 0);
    oneAnnouncement.value = unReadList.value[unReadIdx.value];
    announcementDialogKey.value++;
  };
  const onChange = ({ id, val }) => {
    const curAnnouncement = unReadList.value.find((e) => e.id === id);
    if (curAnnouncement) {
      curAnnouncement.isRead = val;
    }
  };
  const onClose = async ({ isExpire, canOperate }, cb) => {
    if (!isExpire && canOperate) {
      const unReadIds = unReadList.value.filter((e) => e.isRead).map((e) => e.id);
      if (unReadIds.length) {
        await clientMessageRead(unReadIds);
        appParams.setAnnouncementVisible(false);
      }
    }
    cb && cb();
  };

  const list = ref<MessageItem[]>([]);
  const unReadList = ref<MessageItem[]>([]);
  const unReadIdx = ref(0);
  watchEffect(async () => {
    const { list: _list, count } = await getClientMessage(unref(curFilter));
    filterData[1].count = count;
    const listData = cloneDeep(_list);
    list.value = listData.map((e) => {
      e.isCompel = !!+e.compelStatus;
      e.isExpire = true;
      return e;
    });

    unReadList.value = listData
      .filter((item) => item.expires)
      .map((e) => {
        e.isCompel = !!+e.compelStatus;
        e.isExpire = false;
        e.isRead = false;
        return e;
      });

    if (unReadList.value.length && appParams.getAnnouncementVisible) {
      oneAnnouncement.value = unReadList.value[unReadIdx.value];
      isNext.value = unReadList.value.length > 1;
      announcementDialogVisible.value = true;
    }
  });

  function onOpenDialog(item: MessageItem) {
    if (!curFilter.value) return;
    if (item.messageTitle) {
      oneAnnouncement.value = item;
      isNext.value = false;
      canOperate.value = false;
      announcementDialogVisible.value = true;
      announcementDialogKey.value++;
    }
  }

  // 消息才有已读未读
  async function onRead(item: MessageItem) {
    await clientMessageRead([item.id]);
    item.haveRead = '1';
    filterData[1].count = list.value.filter((e) => +e.haveRead === 0).length;
  }
</script>

<style scoped lang="scss">
  .client-scroll-list {
    padding-top: 20px;
    &-hd {
      padding-left: 30px;
      height: 40px;

      .client-badge-item {
        height: 100%;
        cursor: pointer;
        position: relative;

        .active {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 18px;
          height: 4px;
          background: #3a5daf;
          border-radius: 2px;
        }
      }
      .client-badge-item + .client-badge-item {
        margin-left: 30px;
      }
    }

    &-bd {
      padding-left: 30px;
      padding-right: 10px;
    }
    &-item {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .dot {
        display: inline-block;
        width: 6px;
        height: 6px;
        background: #ed5d85;
        border-radius: 2px;
        margin-right: 10px;
      }

      padding: 20px 20px;
      color: #4f71c6;

      .no-read {
        background-color: #d6ddf8;
        border-radius: 10px;
        padding: 3px 5px;
        font-weight: 400;
        color: #4f71c6;
        cursor: pointer;
      }

      &:nth-child(odd) {
        background-color: #f1f5f7;
      }
    }
  }
</style>
