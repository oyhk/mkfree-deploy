/**
 * Created by oyhk on 2017/7/3.
 */


/**
 * 返回分页的数据，通过ant design规则添加table 每行的key
 * @param items
 */
export function addKey(items) {
  items.forEach((item, index) => {
    item.key = index;
  });
}
