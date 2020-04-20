export const ApiHttpCode = {
  0: { code: 0, desc: '失败' },
  1: { code: 1, desc: '成功' },
  2: { code: 2, desc: '参数提示：' },
  3: { code: 3, desc: '温馨提示：' },
  101: { code: 101, desc: '用户登录：用户不存在' },
  102: { code: 102, desc: '用户登录：密码错误' },
  1001: { code: 1001, desc: '环境不存在' },
};

export class ApiResult<T> {

  code: number;
  desc: string;
  result: T;

  constructor();

  constructor(code?: number, desc?: string);

  constructor(code?: number, desc?: string, data?: T) {
    if (!code && !desc) {
      code = ApiHttpCode['1'].code;
      desc = ApiHttpCode['1'].desc;
    }
    this.code = code;
    this.desc = desc;
    this.result = data;
  }


}