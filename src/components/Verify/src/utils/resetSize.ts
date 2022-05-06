/*
 * @Author: handsomeFu
 * @Date: 2021-11-04 09:51:54
 * @LastEditTime: 2021-11-17 10:07:49
 * @LastEditors: handsomeFu
 * @Description: Created By fzq on 2021/11/4 09:51
 */

export function resetSize(vm: any) {
  // 图片的宽度、高度，移动条的宽度、高度
  let img_width: string, img_height: string, bar_width: string, bar_height: string;

  const parentWidth = vm.$el.parentNode.offsetWidth || window.offsetWidth;
  const parentHeight = vm.$el.parentNode.offsetHeight || window.offsetHeight;

  const getWidth = (type: string) => {
    return (Math.floor(vm[type].width) / 100) * parentWidth + 'px';
  };
  const getHeight = (type: string) => {
    return (Math.floor(vm[type].height) / 100) * parentHeight + 'px';
  };

  if (vm.imgSize.width.indexOf('%') != -1) {
    img_width = getWidth('imgSize');
  } else {
    img_width = vm.imgSize.width;
  }

  if (vm.imgSize.height.indexOf('%') != -1) {
    img_height = getHeight('imgSize');
  } else {
    img_height = vm.imgSize.height;
  }

  if (vm.barSize.width.indexOf('%') != -1) {
    bar_width = getWidth('barSize');
  } else {
    bar_width = vm.barSize.width;
  }

  if (vm.barSize.height.indexOf('%') != -1) {
    bar_height = getHeight('barSize');
  } else {
    bar_height = vm.barSize.height;
  }

  return { imgWidth: img_width, imgHeight: img_height, barWidth: bar_width, barHeight: bar_height };
}
