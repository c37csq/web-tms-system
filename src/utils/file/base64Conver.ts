/*
 * @Author: handsomeFu
 * @Date: 2021-09-23 11:38:20
 * @LastEditTime: 2021-11-12 16:37:24
 * @LastEditors: handsomeFu
 * @Description:
 */

/**
 * @description: base64 to blob
 */
export function dataURLtoBlob(base64Buf: string): Blob {
  const arr = base64Buf.split(',');
  const typeItem = arr[0];
  const mime = typeItem.match(/:(.*?);/)![1];
  const bstr = window.atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * base64 转 blob
 * @param base64Data
 * @param type mime类型
 * @return {Blob}
 */
export function base642Blob(base64Data: string, type: string) {
  const raw = window.atob(base64Data);
  const uInt8Array = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  // type: 'application/vnd.ms-excel', 'application/octet-stream'
  return new Blob([uInt8Array], { type });
}

/**
 * img url to base64
 * @param url
 * @param mineType
 */
export function urlToBase64(url: string, mineType?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let canvas = document.createElement('CANVAS') as Nullable<HTMLCanvasElement>;
    const ctx = canvas!.getContext('2d');

    const img = new Image();
    img.crossOrigin = '';
    img.onload = function () {
      if (!canvas || !ctx) {
        return reject();
      }
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL(mineType || 'image/png');
      canvas = null;
      resolve(dataURL);
    };
    img.src = url;
  });
}
