/*
 * @Author: handsomeFu
 * @Date: 2021-11-09 16:20:27
 * @LastEditTime: 2021-11-10 18:48:47
 * @LastEditors: handsomeFu
 * @Description:
 */
import dayjs from 'dayjs';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATE_FORMAT = 'YYYY-MM-DD ';

/**
 * 格式化日期时间-年月日时分秒
 * @param date
 * @param format
 */
export function formatToDateTime(date: dayjs.ConfigType, format = DATE_TIME_FORMAT): string {
  return dayjs(date).format(format);
}

/**
 * 格式化日期-年月日
 * @param date
 * @param format
 */
export function formatToDate(date: dayjs.ConfigType, format = DATE_FORMAT): string {
  return dayjs(date).format(format);
}

/**
 * @description 填充时间
 * @param startTime
 * @param endTime
 */
export const fillDateTime = (startTime, endTime) => {
  if (startTime) {
    startTime = dayjs(startTime).startOf('date').format('YYYY-MM-DD HH:mm:ss');
  }
  if (endTime) {
    endTime = dayjs(endTime).endOf('date').format('YYYY-MM-DD HH:mm:ss');
  }
  return { startTime, endTime };
};
/**
 * 获取日期选择面板时间
 * @param dateRange 时间数组
 */
export const getPickerDate = (dateRange: string[]) => {
  let startTime, endTime;
  if (Array.isArray(dateRange) && dateRange?.length) {
    startTime = dayjs(dateRange[0]).startOf('date').format('YYYY-MM-DD HH:mm:ss');
    endTime = dayjs(dateRange[1]).endOf('date').format('YYYY-MM-DD HH:mm:ss');
  }
  return { startTime, endTime };
};

export const dateUtil = dayjs;
