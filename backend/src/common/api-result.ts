/**
 * ApiResult 用于API请求异常处理提示
 */
export class ARE {
  code?: number;
  desc?: string;


  constructor(code?: number, desc?: string) {
    this.code = code;
    this.desc = desc;
  }


}


export const ApiResultCode = {
  0: new ARE(0, '失败'),
  1: new ARE(1, '成功'),
  2: (descEx?: string) => new ARE(2, `参数提示：${descEx}`),
  3: (descEx?: string) => new ARE(3, `温馨提示：${descEx}`),

  11: { code: 11, desc: '系统：未安装' },
  12: { code: 12, desc: '系统：权限不足请联系超级管理员' },
  107: { code: 107, desc: '用户：权限不足，请联系超级管理员' },

  101: { code: 101, desc: '用户：用户不存在' },
  102: { code: 102, desc: '用户：密码错误' },
  103: { code: 103, desc: '用户：accessToken 无效，请重新登录' },
  104: { code: 104, desc: '用户：accessToken 已过期，请重新登录' },
  105: { code: 105, desc: '用户：用户名已存在' },
  106: { code: 106, desc: '用户：超级管理员不允许删除' },


  1001: { code: 1001, desc: '项目：请先初始化项目' },
  1002: { code: 1002, desc: '项目：构建环境目录不存在，请重新初始化项目' },
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

  param(operation, paramDesc?: string) {
    this.code = operation.code;
    this.desc = operation.desc + paramDesc;
  }

  remind(operation) {
    this.code = operation.code;
    this.desc = operation.desc;
  }

  custom(operation) {
    this.code = operation.code;
    this.desc = operation.desc;
  }

  remindRecordNotExist(entityName: string, params) {
    this.code = ApiResultCode['3']().code;
    this.desc = ApiResultCode['3'](`${entityName} params: ${JSON.stringify(params)}，记录不存在。`).desc;
  }

}