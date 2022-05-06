/*
 * @Author: handsomeFu
 * @Date: 2021-11-05 15:33:18
 * @LastEditTime: 2021-11-05 15:36:25
 * @LastEditors: handsomeFu
 * @Description: Used to parse the .env.development proxy configuration / 解析 .env.development 代理配置
 */

import type { ProxyOptions } from 'vite';

type ProxyItem = [string, string];
type ProxyList = ProxyItem[];

type ProxyTargetList = Record<string, ProxyOptions>;

const httpsRE = /^https:\/\//;

/**
 * Generate proxy / 生成代理
 * @param list
 */
export function createProxy(list: ProxyList = []) {
  const ret: ProxyTargetList = {};

  for (const [prefix, target] of list) {
    const isHttps = httpsRE.test(target);

    // https://github.com/http-party/node-http-proxy#options
    ret[prefix] = {
      target: target,
      changeOrigin: true,
      ws: true,
      rewrite: (path) => path.replace(new RegExp(`^${prefix}`), ''),
      // https is require secure=false / https 是否需要安全
      ...(isHttps ? { secure: false } : {}),
    };
  }
  return ret;
}
