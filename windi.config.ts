/*
 * @Author: handsomeFu
 * @Date: 2021-11-15 11:07:15
 * @LastEditTime: 2021-11-17 14:06:51
 * @LastEditors: handsomeFu
 * @Description:
 */
import { defineConfig } from 'vite-plugin-windicss';

function range(size: number, startAt = 1) {
  return Array.from(Array(size).keys()).map((i) => i + startAt);
}

export default defineConfig({
  preflight: true,
  attributify: true,
  safelist: [
    range(3).map((i) => `p-${i}`), // p-1 到 p-3
    range(10).map((i) => `mt-${i}`), // mt-1 到 mt-10
  ],
  extract: {
    include: ['src/**/*.{vue,html,jsx,tsx}'],
    exclude: ['node_modules', '.git'],
  },
  alias: {
    'flex-item-center': 'flex items-center',
    'flex-center': 'flex items-center justify-center',
    'flex-btc-ac': 'flex items-center justify-between',
    'flex-btc': 'flex justify-between',
    'flex-ac': 'flex items-center',
    'flex-between-center': 'flex items-center justify-between',
  },
  theme: {
    extend: {
      colors: {
        primary: '#304281',
        secondary: {
          300: '#333',
          600: '#666',
          900: '#999',
        },
        active: '#6e8ed8',
        invalid: '#aaa',
        publish: '#80d0ce',
        delete: '#ed5d85',
        download: '#7b98e0',
      },
      screens: {
        sm: { min: '640px', max: '767px' },
        md: { min: '768px', max: '1023px' },
        lg: { min: '1024px', max: '1279px' },
        xl: { min: '1280px', max: '1536px' },
        '2xl': { min: '1537px' },
      },
    },
  },
});
