export const ApiResultCode = {
  0: { code: 0, desc: '失败' },
  1: { code: 1, desc: '成功' },
  2: { code: 2, desc: '参数提示：' },
  3: { code: 3, desc: '温馨提示：' },
  101: { code: 101, desc: '用户：用户不存在' },
  102: { code: 102, desc: '用户：密码错误' },
  103: { code: 103, desc: '用户：accessToken 无效，请重新登录' },
  104: { code: 104, desc: '用户：accessToken 已过期，请重新登录' },

  1001: { code: 1001, desc: '项目：请先初始化项目' },
};

export class ApiResult<T> {

  code: number;
  desc: string;
  result: T;

  constructor();

  constructor(code?: number, desc?: string);

  constructor(code?: number, desc?: string, result?: T) {
    if (!code && !desc) {
      code = ApiResultCode['1'].code;
      desc = ApiResultCode['1'].desc;
    }
    this.code = code;
    this.desc = desc;
    this.result = result;
  }

  remind(operation) {
    this.code = operation.code;
    this.desc = operation.desc;
  }


  remindRecordNotExist(entityName: string,params) {
    this.code = ApiResultCode['3'].code;
    this.desc = `${ApiResultCode['3'].desc}${entityName} params: ${params}，记录不存在。`;
  }

}