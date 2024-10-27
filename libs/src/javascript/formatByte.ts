/**
 * @description 格式化字节大小。
 * @param bytes 字节数。
 */
export const formatByte = (bytes: number) => {
  if (!bytes) return [0, 'B', '0 B']
  let k = 1024,
    size: number | string = 0,
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k))
  i = Math.min(i, sizes.length - 1) // 防止超出数组范围
  size = (bytes / k ** i).toFixed(2) ? (bytes / k ** i).toFixed(2) : 0
  return [parseFloat(String(size)), sizes[i], `${size} ${sizes[i]}`]
}

