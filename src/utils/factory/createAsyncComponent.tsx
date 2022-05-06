/*
 * @Author: handsomeFu
 * @Date: 2021-11-15 14:14:23
 * @LastEditTime: 2021-11-15 15:08:24
 * @LastEditors: handsomeFu
 * @Description:
 */
import { defineAsyncComponent } from 'vue';
import { Loading } from '@/components/Loading';
import { noop } from '@/utils';

interface Options {
  delay?: number;
  timeout?: number;
  loading?: boolean;
  retry?: boolean;
}

// https://v3.cn.vuejs.org/api/global-api.html#defineasynccomponent
export function createAsyncComponent(loader: Fn, options: Options = {}) {
  const { delay = 100, timeout = 30000, loading = false, retry = true } = options;
  return defineAsyncComponent({
    loader,
    loadingComponent: loading ? <Loading /> : undefined,
    timeout,
    delay,
    /**
     *
     * @param {*} error 错误信息对象
     * @param {*} retry 一个函数，用于指示当 promise 加载器 reject 时，加载器是否应该重试
     * @param {*} fail  一个函数，指示加载程序结束退出
     * @param {*} attempts 允许的最大重试次数
     */
    onError: !retry
      ? noop
      : (error, retry, fail, attempts) => {
          if (error.message.match(/fetch/) && attempts <= 3) {
            retry();
          } else {
            fail();
          }
        },
  });
}
