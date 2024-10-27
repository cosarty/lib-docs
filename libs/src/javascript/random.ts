/** @description 随机数
 * @param min 最小值
 * @param max 最大值
 * @param num 保留小数位数
 */
export const random = (min: number, max: number, num = 0) => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(num))
}
