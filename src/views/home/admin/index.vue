<template>
  <div class="home" v-loading="dataLoading">
    <div class="home-admin" v-if="isTop">
      <div class="home-item" :class="{ 'mb-4': !hasServiceQuotaPerm }">
        <div class="home-service">
          <template v-if="hasServiceQuotaPerm">
            <el-carousel
              trigger="click"
              :arrow="serviceData.length > 4 ? 'hover' : 'never'"
              :autoplay="false"
              indicator-position="outside"
              :height="serviceItemHeight * 2 + 16 + 'px'"
              ref="carouselRef"
            >
              <el-carousel-item v-for="(i, idx) in serviceDataRange" :key="i" :name="i.toString()">
                <div
                  class="home-service-item rounded-xl"
                  v-for="item in serviceData.slice(idx * 4, (idx + 1) * 4)"
                  :key="item.title"
                  :style="{ color: item.color || '#ccc', height: serviceItemHeight + 'px' }"
                >
                  <div class="home-service-item-info">
                    <div class="info-container">
                      <p class="text-lg">{{ item.title }}</p>
                      <div class="price">
                        <span class="text-bebasNeue text-6xl pr-20px">
                          $ {{ digitallyReplaceThousands(item.price) }}
                        </span>
                        <div v-show="item.isRecharge" class="tip-img img-animation">
                          <img :src="rechargeImg" alt="Img" />
                        </div>
                      </div>
                    </div>
                    <p>
                      <span>
                        上一周: <span class="text-bebasNeue">{{ item.preWeek }}</span>
                      </span>
                      <span class="ml-20px">
                        上一月: <span class="text-bebasNeue">{{ item.preMonth }}</span>
                      </span>
                    </p>
                  </div>
                  <div
                    class="home-service-item-img"
                    :style="{
                      width: serviceItemImgWidth + 'px',
                      height: serviceItemImgHeight + 'px',
                    }"
                  >
                    <img :src="item.imgUrl || defaultServiceImg" :alt="item.title" />
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
          </template>
          <template v-else>
            <div class="bg-white rounded-xl" :style="{ height: serviceItemHeight * 2 + 16 + 'px' }"></div>
          </template>
        </div>
        <service-order-pie
          class="home-pie"
          :height="serviceItemHeight"
          :style="{ height: serviceItemHeight * 2 + 16 + 'px' }"
        />
      </div>
      <div class="home-item">
        <service-finance-bar
          v-if="hasServiceFinancePerm"
          class="flex-1 bg-white"
          :height="serviceItemHeight"
          :style="{ height: serviceItemHeight * 2 + 16 + 'px' }"
        />
        <client-balance-reminder-list
          v-else
          class="pt-20px px-20px flex-1"
          :height="serviceItemHeight"
          :list="customerBalanceList"
          :columns="clientScrollColumns"
          @item-click="onItemClick"
        />

        <channel-order-pie
          class="home-pie"
          :height="serviceItemHeight"
          :style="{ height: serviceItemHeight * 2 + 16 + 'px' }"
        />
      </div>
    </div>
    <div class="home-client" v-else>
      <div class="home-item">
        <div class="flex-1 bg-white rounded-xl mr-10px" :style="{ height: serviceItemHeight * 2 + 16 + 'px' }">
          <div class="info-content py-20px pl-20px">
            <div>
              <div class="price-item">
                <p class="text-active text-lg mb-1">账户余额</p>
                <el-popover
                  placement="top-start"
                  :width="300"
                  trigger="hover"
                  content="账户余额 = 充值总金额 - 销售订单金额"
                >
                  <template #reference>
                    <span class="text-bebasNeue text-6xl text-primary">
                      $ {{ digitallyReplaceThousands(clientInfo.currentBalance) }}
                    </span>
                  </template>
                </el-popover>
              </div>
              <div class="flex price-content mt-20px">
                <div class="price-item" v-for="(item, idx) in clientInfo.priceList" :key="idx">
                  <p class="text-active text-lg">{{ item.label }}</p>
                  <div class="price">
                    <span class="text-bebasNeue text-2xl text-primary pr-20px">
                      $ {{ digitallyReplaceThousands(item.price) }}
                    </span>
                    <div class="tip-img" style="width: 90px">
                      <img :src="item.imgUrl" alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex mt-20px text-primary">
              <div class="contact-item" v-for="item in clientInfo.contactList" :key="item.label">
                <p>{{ item.label }}：</p>
                <div class="mt-8px pl-8px">
                  <p>
                    <svg-icon name="cs" size="14" class="cursor-pointer" />
                    <span class="ml-10px">{{ item.name }}</span>
                  </p>
                  <p class="mt-4px">
                    <svg-icon name="tel" size="14" class="cursor-pointer" />
                    <span class="ml-10px">{{ item.tel }}</span>
                  </p>
                  <p class="mt-4px">
                    <svg-icon name="qq" size="14" class="cursor-pointer" />
                    <span class="ml-10px">{{ item.qq }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex-1 bg-white rounded-xl ml-10px">
          <client-message-box :height="serviceItemHeight" />
        </div>
      </div>
      <div class="home-item mt-4">
        <client-order-line
          class="flex-1 bg-white"
          :height="serviceItemHeight"
          :style="{ height: serviceItemHeight * 2 + 16 + 'px' }"
        />
        <express-pie
          class="home-pie"
          :height="serviceItemHeight"
          :style="{ height: serviceItemHeight * 2 + 16 + 'px' }"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import ServiceOrderPie from '@/views/home/admin/components/ServiceOrderPie.vue';
  import ChannelOrderPie from '@/views/home/admin/components/ChannelOrderPie.vue';
  import ClientBalanceReminderList from '@/views/home/admin/components/ClientBalanceReminderList.vue';
  import ClientMessageBox from '@/views/home/admin/components/ClientMessageBox.vue';
  import ClientOrderLine from '@/views/home/admin/components/ClientOrderLine.vue';
  import ExpressPie from '@/views/home/admin/components/ExpressPie.vue';
  import ServiceFinanceBar from '@/views/home/admin/components/ServiceFinanceBar.vue';

  export default defineComponent({
    name: 'AdminHome',
    components: {
      ServiceOrderPie,
      ChannelOrderPie,
      ClientBalanceReminderList,
      ClientMessageBox,
      ClientOrderLine,
      ExpressPie,
      ServiceFinanceBar,
    },
  });
</script>

<script lang="ts" setup>
  import { ref, onMounted, computed, unref, onBeforeUnmount, Ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useParamsStore } from '@/store/modules/params';
  import { useUserStore } from '@/store/modules/user';
  import { ClientItem, getAdminHomeList, getClientInfo, PriceItem } from '@/api/home';
  import { digitallyReplaceThousands } from '@/utils/tools';
  import rechargeImg from '@/assets/home/recharge.png';
  import defaultServiceImg from '@/assets/home/b.png';
  import { useDebounceFn } from '@vueuse/core';
  import { clientScrollColumns } from './data';
  import ApplyCrImg from '@/assets/home/apply-cr.png';
  import ApplySellImg from '@/assets/home/apply-sell.png';
  import { usePermission } from '@/hooks/web/usePermission';

  const userStore = useUserStore();
  const router = useRouter();
  const isTop = userStore.getIsTop;
  const { hasPermission } = usePermission();
  // 服务器商收支表权限
  const hasServiceFinancePerm = hasPermission('home:service:finance');
  // 服务器余额权限
  const hasServiceQuotaPerm = hasPermission('home:service:quota');

  const dataLoading = ref(true);
  const serviceData = ref<PriceItem[]>([]);
  const serviceDataRange = computed((): number => Math.ceil(unref(serviceData).length / 4));
  const carouselRef = ref();

  const serviceItemHeight = ref(188);
  const serviceBarHeight = ref(0);
  const serviceItemImgWidth = ref(0);
  const serviceItemImgHeight = ref(0);
  const calcItemHeight = () => {
    const bodyHeight = document.body.clientHeight;
    if (bodyHeight > 902) {
      const beyondHeight = bodyHeight - 888;
      serviceItemHeight.value = 162 + Math.floor(beyondHeight / 4);
      serviceBarHeight.value = 218 + Math.floor(beyondHeight / 4);
      serviceItemImgWidth.value = 110 + Math.floor(beyondHeight / 4);
      serviceItemImgHeight.value = 130 + Math.floor(beyondHeight / 4);
    } else {
      serviceItemHeight.value = 162;
      serviceBarHeight.value = 218;
      serviceItemImgWidth.value = 110;
      serviceItemImgHeight.value = 130;
    }
  };

  const customerBalanceList = ref<ClientItem[]>([]);
  function onItemClick({ clientCode }) {
    const paramsStore = useParamsStore();
    paramsStore.setClientCode(clientCode);
    router.push({
      name: 'CustomerManagementList',
    });
  }

  async function initialAdmin() {
    const { price, clientList } = await getAdminHomeList();
    serviceData.value = price;
    if (hasServiceQuotaPerm && unref(carouselRef)) {
      unref(carouselRef).setActiveItem('1');
    }
    customerBalanceList.value = clientList;
  }

  type ClientInfoData = {
    currentBalance: number;
    priceList: { label: string; price: number; imgUrl: string }[];
    contactList: { label: string; name: string; tel: string; qq: string }[];
  };
  const clientInfo = ref({
    currentBalance: 0,
    priceList: [],
    contactList: [],
  }) as Ref<ClientInfoData>;
  async function loadClientInfo() {
    const data = await getClientInfo();
    clientInfo.value.currentBalance = data?.currentBalance;
    clientInfo.value.priceList.push(
      {
        label: '固定额度',
        price: data?.fixedQuota,
        imgUrl: ApplyCrImg,
      },
      {
        label: '信用额度',
        price: data?.currentQuota,
        imgUrl: ApplySellImg,
      },
    );
    clientInfo.value.contactList.push(
      {
        label: '客服代表',
        name: data?.customerName || '/',
        tel: data?.customerPhone || '/',
        qq: data?.customerQq || '/',
      },
      {
        label: '销售代表',
        name: data?.sellName || '/',
        tel: data?.sellPhone || '/',
        qq: data?.sellQq || '/',
      },
    );
  }

  async function initialClient() {
    await loadClientInfo();
  }

  onMounted(() => {
    if (!/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
      calcItemHeight();
    }
    window.addEventListener('resize', useDebounceFn(calcItemHeight, 100), { passive: true });
    try {
      isTop ? initialAdmin() : initialClient();
    } catch (e) {
      console.error(e);
    } finally {
      dataLoading.value = false;
    }
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', calcItemHeight);
  });
</script>

<style scoped lang="scss">
  $service--item--margin--top: 16px;

  .home {
    height: 100%;
    min-width: 1200px;

    &-item {
      display: flex;
      justify-content: space-between;
    }

    &-service {
      flex: 1;
      min-width: 900px;

      &-item {
        flex: 0 0 49%;
        transition: height 300ms linear;
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        padding: 20px 16px 16px 24px;

        &:nth-child(1) {
          color: #3a96b7;
        }
        &:nth-child(3) {
          margin-top: $service--item--margin--top;
        }
        &:nth-child(4) {
          margin-top: $service--item--margin--top;
        }

        &-info {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .info-container {
            .title {
              font-size: 16px;
            }
          }
        }
        &-img {
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }

    &-pie {
      margin-left: 20px;
      background-color: #fff;
      transition: height 300ms linear;
      flex: 0 0 32%;
    }

    @keyframes tipImgBounce {
      0% {
        transform: scale(1);
      }
      25% {
        transform: scale(1.05);
      }
      50% {
        transform: scale(1.1);
      }
      75% {
        transform: scale(1.05);
      }
      100% {
        transform: scale(1);
      }
    }

    .price {
      position: relative;
    }

    .tip-img {
      position: absolute;
      width: 110px;
      top: 50%;
      left: 100%;
      transform: translateY(-50%);

      img {
        width: 100%;
      }
    }
    .img-animation {
      img {
        transition: all 900ms linear;
        animation: tipImgBounce 800ms ease-in-out 15;
      }
    }

    &-client {
      .info-content {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .contact-item + .contact-item {
        margin-left: 100px;
      }
      .price-item + .price-item {
        margin-left: 200px;
      }
    }
  }
</style>
