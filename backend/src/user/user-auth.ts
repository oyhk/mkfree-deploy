export class UserAuth {
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
  expirationTime: 7 * 24 * 60 * 60, // 默认7天
  expiresIn: '7d', // 默认7天
};