/**
 * Created By fzq on 2021/11/26 09:25
 */

/**
 * @description: 输入的值大于0时返回true
 * @return {boolean}
 * @param num
 */
export const isNumGreaterZero = (num) => {
  return !isNaN(num) && num > 0;
};

/**
 * @description: 输入的值大于等于0时返回true
 * @return {boolean}
 * @param num
 */
export const isNumGreaterEqualZero = (num) => {
  return !isNaN(num) && num >= 0;
};

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return reg.test(email);
}

export const checkPhoneNumber = (_rule, value, callback) => {
  if (!value) {
    callback(new Error('手机号不能为空'));
  } else if (typeof value !== 'number' && !/^\d+$/.test(value)) {
    callback(new Error('请输入数字值'));
  } else {
    callback();
  }
};

// 邮编校验 必须为数字
export const checkPostCode = (_rule, value, callback) => {
  if (!value) {
    callback(new Error('邮编不能为空'));
  } else if (typeof value !== 'number' && !/^\d+$/.test(value)) {
    callback(new Error('请输入数字值'));
  } else {
    callback();
  }
};

// 验证金额 小数点前最多9位 小数点后最多3位
export const checkPrice = (_rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入金额'));
  } else if (!/^([1-9]\d{0,9}|0)(\.\d{1,3})?$/.test(value)) {
    callback(new Error('请输入正确的金额'));
  } else {
    callback();
  }
};

/**
 * 验证试算价邮编
 * @param _rule
 * @param value
 * @param callback
 */
export const validateZipCode = (_rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入目的邮编'));
  } else if (!Number.isInteger(+value)) {
    callback(new Error('目的邮编应为纯数字'));
  } else {
    callback();
  }
};

/**
 * 验证长
 * @param _rule
 * @param value
 * @param callback
 * @return {*}
 */
export const checkLength = (_rule, value, callback) => {
  if (!value) {
    return callback(new Error('长不能为空'));
  }
  setTimeout(() => {
    if (isNaN(value)) {
      callback(new Error('请输入数字'));
    } else if (!isNumGreaterZero(value)) {
      callback(new Error('不能为负数'));
    } else {
      callback();
    }
  }, 100);
};

/**
 * 验证宽
 * @param _rule
 * @param value
 * @param callback
 * @return {*}
 */
export const checkWide = (_rule, value, callback) => {
  if (!value) {
    return callback(new Error('宽不能为空'));
  }
  setTimeout(() => {
    if (isNaN(value)) {
      callback(new Error('请输入数字'));
    } else if (!isNumGreaterZero(value)) {
      callback(new Error('不能为负数'));
    } else {
      callback();
    }
  }, 100);
};

/**
 * 验证高
 * @param _rule
 * @param value
 * @param callback
 * @return {*}
 */
export const checkHigh = (_rule, value, callback) => {
  if (!value) {
    return callback(new Error('高不能为空'));
  }
  setTimeout(() => {
    if (isNaN(value)) {
      callback(new Error('请输入数字'));
    } else if (!isNumGreaterZero(value)) {
      callback(new Error('不能为负数'));
    } else {
      callback();
    }
  }, 100);
};

/**
 * 验证重量
 * @param _rule
 * @param value
 * @param callback
 * @return {*}
 */
export const checkWeight = (_rule, value, callback) => {
  if (!value) {
    return callback(new Error('重量不能为空'));
  }
  setTimeout(() => {
    if (isNaN(value)) {
      callback(new Error('请输入数字'));
    } else if (!isNumGreaterZero(value)) {
      callback(new Error('不能为负数'));
    } else {
      callback();
    }
  }, 100);
};

/**
 * 验证邮箱
 * @param _rule
 * @param value
 * @param callback
 */
export const checkEmail = (_rule, value, callback) => {
  if (!value) {
    callback(new Error('邮箱不能为空'));
  } else if (!validEmail(value)) {
    callback(new Error('邮箱格式有误'));
  } else {
    callback();
  }
};

/**
 * 客户列表-冻结金额
 * @param _rule
 * @param value
 * @param callback
 */
export const checkBalance = (_rule, value, callback) => {
  if (!value) {
    return callback(new Error('冻结金额不能为空'));
  }

  setTimeout(() => {
    if (isNaN(value)) {
      callback(new Error('请输入数字'));
    } else if (value < 0) {
      callback(new Error('要冻结的金额不能小于0'));
    } else {
      callback();
    }
  }, 100);
};
