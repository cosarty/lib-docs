import { match as _pinyinMatch } from 'pinyin-pro'

/**
 * @description 正则搜索
 * @param data 需要搜索的数据
 * @param value 搜索的值
 * @param keys 搜索的键名
 * @param highlight 是否高亮
 */
export const pinyinSearch = <T>(
  data: T[],
  value: string | string[],
  keys: string | string[],
  highlight = false,
): T[] => {
  if (!Array.isArray(value) && value === '') {
    return data
  }

  const arr: T[] = []

  // 根据给定的值和键名进行搜索
  const fn = (searchValue: string, key: string): void => {
    const reg = new RegExp(searchValue.toLowerCase(), 'i') // 创建正则表达式
    data.forEach((item: any) => {
      item[key] = item[key].toString() // 确保属性为字符串

      if (_pinyinMatch(item[key], searchValue, { precision: 'start' })) {
        // 匹配拼音或属性值
        if (highlight && searchValue) {
          item[key] = item[key].replace(
            reg,
            (match: string) => `<i style="color:var(--blue)">${match}</i>`,
          ) // 高亮匹配部分
        }
        arr.push(item)
      }
    })
  }

  if (Array.isArray(keys)) {
    keys.forEach((key: string) => fn(value as string, key)) // 遍历键名进行搜索
  } else if (Array.isArray(value)) {
    value.forEach((val: string) => {
      if (Array.isArray(keys)) {
        keys.forEach((key: string) => fn(val, key)) // 遍历值和键名进行搜索
      } else {
        fn(val, keys) // 单个键名和多个值进行搜索
      }
    })
  } else {
    fn(value, keys) // 单个值和单个键名进行搜索
  }

  return arr
}
