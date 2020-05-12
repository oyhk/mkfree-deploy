export class UserAuth {
  id:number;
  username: string;
  roleType: number;
  permissionList: [];
  /**
   * jwtServer decode return field
   *
   * 创建时间
   */
  iat: number;
  /**
   * jwtServer decode return field
   *
   * 过期时间
   */
  exp: number;
}

/**
 * 用户认证操作
 */
export const UserAuthOperation = {
  expiresIn: '7d', // 默认7天,
  accessTokenKey:'access_token', // access_token key
};