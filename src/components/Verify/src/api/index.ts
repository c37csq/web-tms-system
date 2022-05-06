/**
 * Created By fzq on 2021/12/3 09:21
 */
import { tmsHttp } from '@/utils/http/axios';

enum Api {
  Get = '/captcha/get',
  Check = '/captcha/check',
}

// 滑块 | 点击文字
export type CaptchaType = 'blockPuzzle' | 'clickWord';

// repCode 0000 success 6100 验证码已失效，请重新获取
interface RequestData<T> {
  repCode: string;
  repData: T;
  repMsg: string;
  success: boolean;
}

interface GetData {
  jigsawImageBase64: string;
  originalImageBase64: string;
  result: boolean;
  secretKey: string;
  token: string;
  ts: number;
  wordList: string[];
}

export const getImg = (captchaType: CaptchaType) =>
  tmsHttp.post<RequestData<GetData>>(
    { url: Api.Get, params: { captchaType }, timeout: 1000 },
    { isTransformResponse: false, errorMessageMode: 'none' },
  );

export const checkValid = (params: { captchaType: CaptchaType; pointJson: string; token: string }) =>
  tmsHttp.post<RequestData<null>>({ url: Api.Check, params }, { isTransformResponse: false });
