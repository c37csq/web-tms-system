<template>
  <teleport to="body">
    <div class="mask" v-show="showBox">
      <div class="verify-box" :style="{ 'max-width': wrapMaxWidth }">
        <div class="verify-box-top">
          请完成安全验证
          <el-icon class="cursor-pointer" :size="18" @click="closeBox"><close /></el-icon>
        </div>

        <div class="verify-box-bottom">
          <div style="position: relative">
            <div class="verify-img-out" :style="{ height: imgWarpHeight }" v-loading="!backImgBase">
              <div class="verify-img-panel" :style="{ width: setSize.imgWidth, height: setSize.imgHeight }">
                <img
                  :src="'data:image/png;base64,' + backImgBase"
                  alt="captchaImg"
                  style="width: 100%; height: 100%; display: block"
                />
                <div class="verify-refresh" @click="refresh" v-show="showRefresh">
                  <el-icon :size="20" color="#fff">
                    <refresh-right />
                  </el-icon>
                </div>
                <transition name="tips">
                  <span class="verify-tips" v-if="tipWords" :class="passFlag ? 'suc-bg' : 'err-bg'">
                    {{ tipWords }}
                  </span>
                </transition>
              </div>
            </div>

            <div
              class="verify-bar-area"
              :style="{
                width: setSize.imgWidth,
                height: barSize.height,
                'line-height': barSize.height,
              }"
            >
              <span class="verify-msg" v-text="barText"></span>
              <div
                class="verify-left-bar"
                :style="{
                  width: getLeftBarWidth,
                  height: barSize.height,
                  'border-color': leftBarBorderColor,
                  transition: transitionWidth,
                }"
              >
                <span class="verify-msg" v-text="finishText"></span>
                <div
                  class="verify-move-block"
                  @touchstart="start"
                  @mousedown="start"
                  :style="{
                    width: barSize.width,
                    height: barSize.height,
                    'background-color': moveBlockBackgroundColor,
                    left: moveBlockLeft,
                    transition: transitionLeft,
                  }"
                >
                  <el-icon :size="18" :color="iconColor">
                    <component :is="iconType" />
                  </el-icon>
                  <div
                    v-if="blockBackImgBase"
                    class="verify-sub-block"
                    :style="{
                      width: getBackImgWidth,
                      height: setSize.imgHeight,
                      top: getBackImgTop,
                      'background-size': setSize.imgWidth + ' ' + setSize.imgHeight,
                    }"
                  >
                    <img
                      :src="'data:image/png;base64,' + blockBackImgBase"
                      alt=""
                      style="width: 100%; height: 100%; display: block"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { RefreshRight, ArrowRight, Close, Check } from '@element-plus/icons-vue';
  export default defineComponent({
    name: 'SlideVerify',
    components: { RefreshRight, ArrowRight, Close, Check },
  });
</script>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { onMounted, ref, computed, reactive, getCurrentInstance, nextTick } from 'vue';

  import type { CaptchaType } from './api';
  import { getImg, checkValid } from './api';
  import { resetSize } from './utils/resetSize';
  import { aesEncrypt } from './utils/ase';

  const instance = getCurrentInstance();

  const props = defineProps({
    captchaType: {
      type: String as PropType<CaptchaType>,
      default: 'blockPuzzle',
      validator: (value: string) => ['blockPuzzle', 'clickWord'].includes(value),
    },
    mode: {
      type: String,
      default: 'pop',
    },
    explain: {
      type: String,
      default: '向右滑动完成验证',
    },
    vSpace: {
      type: Number,
      default: 8, // 图片距离底部bar的位置
    },
    imgSize: {
      type: Object as PropType<{ width: string; height: string }>,
      default: () => ({ width: '310px', height: '155px' }),
    },
    blockSize: {
      type: Object as PropType<{ width: string; height: string }>,
      default: () => ({ width: '50px', height: '50px' }),
    },
    barSize: {
      type: Object as PropType<{ width: string; height: string }>,
      default: () => ({ width: '40px', height: '40px' }),
    },
  });
  const emit = defineEmits(['ready', 'success', 'error']);

  const clickShow = ref(false);

  const showBox = computed((): Boolean => {
    if (props.mode === 'pop') {
      return clickShow.value;
    } else {
      return true;
    }
  });

  const wrapMaxWidth = computed((): string => {
    return parseInt(props.imgSize.width) + '30px';
  });
  const imgWarpHeight = computed(() => {
    return parseInt(setSize.imgHeight) + props.vSpace + 'px';
  });
  const getBackImgWidth = computed((): string => {
    return Math.floor((parseInt(setSize.imgWidth) * 47) / 310) + 'px';
  });
  const getBackImgTop = computed((): string => {
    return '-' + (parseInt(setSize.imgHeight) + props.vSpace) + 'px';
  });

  const closeBox = () => {
    clickShow.value = false;
    refresh();
  };

  // 重置后的宽高
  const setSize = reactive({
    imgHeight: '',
    imgWidth: '',
    barHeight: '',
    barWidth: '',
  });

  const backImgBase = ref(''); //验证码背景图片
  const blockBackImgBase = ref(''); //验证滑块的背景图片
  const backToken = ref(''); //后端返回的唯一token值
  const secretKey = ref(''); //后端返回的ase加密秘钥

  const passFlag = ref(false); // 验证是否通过

  const tipWords = ref('');
  const barText = ref('');
  const barArea = computed(() => {
    return document.querySelector('.verify-bar-area') as HTMLElement;
  });

  const startMoveTime = ref(); //移动开始的时间
  const endMoveTime = ref(); //移动结束的时间
  const moveBlockLeft = ref('0px');
  const leftBarWidth = ref('');
  const moveBlockBackgroundColor = ref('#fff'); // 移动中样式
  const leftBarBorderColor = ref('#ddd');
  const iconColor = ref();
  const iconType = ref('arrow-right');
  const status = ref(false); //鼠标状态
  const isEnd = ref(false); //是够验证完成

  const showRefresh = ref(true);
  const finishText = ref('');
  const transitionLeft = ref('');
  const transitionWidth = ref('');
  const startLeft = ref(0);

  function getEventPageX(e: MouseEvent | TouchEvent) {
    return (e as MouseEvent).clientX || (e as TouchEvent).touches[0].pageX;
  }

  // 鼠标按下
  function start(e: TouchEvent | MouseEvent) {
    startLeft.value = Math.floor(getEventPageX(e) - barArea.value.getBoundingClientRect().left);
    startMoveTime.value = +new Date(); //开始滑动的时间
    if (!isEnd.value) {
      barText.value = '';
      moveBlockBackgroundColor.value = '#337ab7';
      leftBarBorderColor.value = '#337AB7';
      iconColor.value = '#fff';
      e.stopPropagation();
      status.value = true;
    }
  }
  // 鼠标移动
  function move(e: TouchEvent | MouseEvent) {
    if (status.value && !isEnd.value) {
      const x = getEventPageX(e);
      let bar_area_left = barArea.value.getBoundingClientRect().left;
      let move_block_left = x - bar_area_left; //小方块相对于父元素的left值
      if (move_block_left >= barArea.value.offsetWidth - Math.floor(parseInt(props.blockSize.width) / 2) - 2) {
        move_block_left = barArea.value.offsetWidth - Math.floor(parseInt(props.blockSize.width) / 2) - 2;
      }
      if (move_block_left <= 0) {
        move_block_left = Math.floor(parseInt(props.blockSize.width) / 2);
      }

      // 拖动后小方块的left值
      if (move_block_left - startLeft.value < 0) {
        moveBlockLeft.value = '0px';
        leftBarWidth.value = '0px';
      } else {
        moveBlockLeft.value = move_block_left - startLeft.value + 'px';
        leftBarWidth.value = move_block_left - startLeft.value + 'px';
      }
    }
  }
  // 鼠标松开
  function end() {
    endMoveTime.value = +new Date();
    // 判断是否重合
    if (status.value && !isEnd.value) {
      let moveLeftDistance = parseInt((moveBlockLeft.value || '').replace('px', ''));
      moveLeftDistance = (moveLeftDistance * 310) / parseInt(setSize.imgWidth);
      let data = {
        captchaType: props.captchaType,
        pointJson: secretKey.value
          ? aesEncrypt(JSON.stringify({ x: moveLeftDistance, y: 5.0 }), secretKey.value)
          : JSON.stringify({ x: moveLeftDistance, y: 5.0 }),
        token: backToken.value,
      };
      checkValid(data).then((res) => {
        if (res.repCode === '0000') {
          moveBlockBackgroundColor.value = '#5cb85c';
          leftBarBorderColor.value = '#5cb85c';
          iconColor.value = '#fff';
          iconType.value = 'check';
          showRefresh.value = false;
          isEnd.value = true;
          if (props.mode === 'pop') {
            setTimeout(() => {
              clickShow.value = false;
              refresh();
            }, 1500);
          }
          passFlag.value = true;
          tipWords.value = `${((endMoveTime.value - startMoveTime.value) / 1000).toFixed(2)}s验证成功`;
          let captchaVerification = secretKey.value
            ? aesEncrypt(backToken.value + '---' + JSON.stringify({ x: moveLeftDistance, y: 5.0 }), secretKey.value)
            : backToken.value + '---' + JSON.stringify({ x: moveLeftDistance, y: 5.0 });
          setTimeout(() => {
            tipWords.value = '';
            closeBox();
            emit('success', { captchaVerification });
          }, 1000);
        } else {
          moveBlockBackgroundColor.value = '#d9534f';
          leftBarBorderColor.value = '#d9534f';
          iconColor.value = '#fff';
          iconType.value = 'close';
          passFlag.value = false;
          tipWords.value = '验证失败';
          setTimeout(function () {
            refresh();
            tipWords.value = '';
          }, 1000);
          emit('error', instance?.proxy);
        }
      });
      status.value = false;
    }
  }

  const refresh = () => {
    showRefresh.value = true;
    finishText.value = '';

    transitionLeft.value = 'left .3s';
    moveBlockLeft.value = '0px';

    leftBarWidth.value = '';
    transitionWidth.value = 'width .3s';

    leftBarBorderColor.value = '#ddd';
    moveBlockBackgroundColor.value = '#fff';
    iconColor.value = '#000';
    iconType.value = 'arrow-right';
    isEnd.value = false;

    getPicture();
    setTimeout(() => {
      transitionWidth.value = '';
      transitionLeft.value = '';
      barText.value = props.explain;
    }, 300);
  };

  const getPicture = async () => {
    const res = await getImg(props.captchaType);
    if (res.repCode === '0000') {
      backImgBase.value = res.repData.originalImageBase64;
      blockBackImgBase.value = res.repData.jigsawImageBase64;
      backToken.value = res.repData.token;
      secretKey.value = res.repData.secretKey;
    } else {
      tipWords.value = res.repMsg;
    }
  };
  const initial = () => {
    barText.value = props.explain;
    getPicture();

    nextTick(() => {
      const { imgHeight, imgWidth, barHeight, barWidth } = resetSize(instance?.proxy);
      setSize.imgHeight = imgHeight;
      setSize.imgWidth = imgWidth;
      setSize.barHeight = barHeight;
      setSize.barWidth = barWidth;
      emit('ready', instance?.proxy);
    });

    window.removeEventListener('touchmove', function (e) {
      move(e);
    });
    window.removeEventListener('mousemove', function (e) {
      move(e);
    });

    // 鼠标松开
    window.removeEventListener('touchend', function () {
      end();
    });
    window.removeEventListener('mouseup', function () {
      end();
    });

    window.addEventListener('touchmove', function (e) {
      move(e);
    });
    window.addEventListener('mousemove', function (e) {
      move(e);
    });

    // 鼠标松开
    window.addEventListener('touchend', function () {
      end();
    });
    window.addEventListener('mouseup', function () {
      end();
    });
  };

  onMounted(() => {
    initial();
  });

  const getLeftBarWidth = computed((): string => {
    return leftBarWidth.value ? leftBarWidth.value : props.barSize.width;
  });

  const show = () => {
    if (props.mode === 'pop') {
      clickShow.value = true;
    }
  };
  // 必须使用 expose
  defineExpose({
    show,
  });
</script>

<style scoped lang="scss">
  @import 'slideVerify.scss';
</style>
