/**
 * api数据传输DTO
 */
export interface BaseDto {
  // eachKey
  key?:string;
  id?: number;
  // 分页参数
  pageNo?:number;
  pageSize?:number;
  createdAt?:Date;
  updatedAt?:Date;
}
