/*
 * @Author: handsomeFu
 * @Date: 2021-11-08 15:53:00
 * @LastEditTime: 2021-11-10 18:49:18
 * @LastEditors: handsomeFu
 * @Description:
 */
import { isDevMode } from '@/utils/env';

// System default cache time, in seconds
export const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7;

// aes encryption key
export const cacheCipher = {
  key: '_11111000001111@',
  iv: '@11111000001111_',
};

// Whether the system cache is encrypted using aes
export const enableStorageEncryption = !isDevMode();
