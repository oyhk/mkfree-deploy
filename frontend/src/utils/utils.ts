import { DefaultFooter } from '@ant-design/pro-layout';
import React from 'react';
import moment from 'moment';

/**
 * uuid 生成
 */
export const uuid = () => {

  let uuidValue = '';
  let randomValue;
  // eslint-disable-next-line no-plusplus
  for (let k = 0; k < 32; k++) {
    // eslint-disable-next-line no-bitwise
    randomValue = Math.random() * 16 | 0;

    if (k === 8 || k === 12 || k === 16 || k === 20) {
      uuidValue += '-';
    }
    // eslint-disable-next-line no-bitwise,no-nested-ternary
    uuidValue += (k === 12 ? 4 : (k === 16 ? (randomValue & 3 | 8) : randomValue)).toString(16);
  }
  return uuidValue;
};

/**
 * 时间格式化
 * @param date
 */
export const momentFormat = (date: Date | string) => date ? moment(date).format('YYYY-MM-DD HH:mm:ss') : '';
