/*
 * @Author: handsomeFu
 * @Date: 2021-11-05 16:42:39
 * @LastEditTime: 2021-11-05 17:58:03
 * @LastEditors: handsomeFu
 * @Description:  Image resource files used to compress the output of the production environment / 图片资源文件用于在生产环境中压缩输出
 * https://github.com/anncwb/vite-plugin-imagemin
 */
import viteImagemin from 'vite-plugin-imagemin';

export function configImageminPlugin() {
  return viteImagemin({
    gifsicle: {
      optimizationLevel: 7,
      interlaced: false,
    },
    optipng: {
      optimizationLevel: 7,
    },
    mozjpeg: {
      quality: 20,
    },
    pngquant: {
      quality: [0.8, 0.9],
      speed: 4,
    },
    svgo: {
      plugins: [
        {
          name: 'removeViewBox',
        },
        {
          name: 'removeEmptyAttrs',
          active: false,
        },
      ],
    },
  });
}
