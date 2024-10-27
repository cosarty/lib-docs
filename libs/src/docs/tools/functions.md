# 函数

## 转大驼峰

```ts
export const camelize = (str: string): string =>
  str.replace(/-(\w)/g, (_, key) => key.toUpperCase())
```

## 转小驼峰

```ts
export const kebabCase = (str: string): string =>
  str.replace(
    /[A-Z]+(?![a-z])|[A-Z]/g,
    (_, ofs) => (ofs ? '-' : '') + _.toLowerCase(),
  )
```

## 判断文件后缀

```ts
const extMap = {
  script: ['js', 'ts'],
  style: ['css', 'less'],
  jsx: ['jsx', 'tsx'],
}
const isTargetFile = (file: string, type: keyof typeof extMap) =>
  new RegExp(`\\.(${(extMap[type] || extMap['script']).join('|')})`, 'g').test(
    file,
  )
```

## 隐藏字符串位数

默认全部隐藏

```ts
const obfuscateString = ({
  str,
  visibleStart = 0,
  visibleEnd = 0,
  mask = '*',
}: {
  str: string
  visibleStart?: number
  visibleEnd?: number
  mask?: string
}) =>
  str
    .trim()
    .replace(
      new RegExp(`^([\\s\\S]{${visibleStart}}).*([\\s\\S]{${visibleEnd}})$`),
      (match, start, end) =>
        `${start}${'*'.repeat(match.length - start.length - end.length)}${end}`,
    )

// 例子
obfuscateString({ str: '47382788239473894', visibleStart: 2, visibleEnd: 2 })
//  输出 -> **3827882394738**
```

## 提取身份证信息

[正则表达式所在位置](./regexp#isIdCardregexp)

- #### 参数

  - **idCard:** 身份证号码
  - **separator:** 出生年月日的分割字符，默认为 `/`

- #### 返回值

  - **age:** 年龄（实岁）
  - **birthday:** 出生年月日
  - **gender:** 性别（0 女 1 男）

<DemoBlock src='javascript/getIdCardInfo.ts'>
<template #demo>

```ts
import getIdCardInfo from './getIdCardInfo'

const info = getIdCardInfo('310401200001243822')
console.log('info: ', info)
// { age: 24, birthday: '2000/01/24', gender: 0 }
```

</template>
</DemoBlock>

## 判断变量类型

<DemoBlock src='javascript/isPlainType.ts'>
<template #demo>

```ts
import { BASIC_TYPES, isPlainType } from './isPlainType.ts'

console.log(isPlainType({}, BASIC_TYPES.Object)) // true
console.log(isPlainType([], BASIC_TYPES.Array)) // true
```

</template>
</DemoBlock>

## 随机数

随机生成指定范围的数据，生成的数字会包含两个参数

<DemoBlock src='javascript/random.ts'>

<template #demo>

```ts
random(0, 1, 2) //0.57
```

</template>
</DemoBlock>

## 浏览器标签标题交互

```ts
/** @description 网站标题交互 */
export const _tagTitleTip = () => {
  let document_title = ''
  let timer: NodeJS.Timeout
  window.addEventListener('visibilitychange', () => {
    clearTimeout(timer)

    if (document.hidden) {
      if (document.title !== 'o(*≧▽≦)ツ欢迎回来！') {
        document_title = document.title
      }
      document.title = 'ヽ(≧∀≦)ﾉ来和妲己玩耍吧！'
      return
    }

    document.title = 'o(*≧▽≦)ツ欢迎回来！'

    timer = setTimeout(() => {
      document.title = document_title
    }, 1000)
  })
}
```

## 彩色打印

带时分秒前缀的颜色打印

<DemoBlock src='javascript/colorConsole.ts'>

<template #demo>

```ts
colorConsole('测试'，'red')
```

</template>
</DemoBlock>

## 文件大小格式化

返回一个数组，数组元素分别是`['大小', '单位', '大小及单位']`

<DemoBlock src='javascript/colorConsole.ts'>

<template #demo>

```ts
formatByte(2000) //['1.95', 'KB', '1.95 KB']
formatByte(2048) //['2.00', 'KB', '2.00 KB']
```

</template>
</DemoBlock>

## 拼音搜索

依赖于`pinyin-pro`插件

<DemoBlock src='javascript/pinyinSearch.ts'>

<template #demo>

```ts
const obj = [
  { id: 1, name: '张三', age: 20 },
  { id: 2, name: '李四', age: 24 },
  { id: 3, name: '王五', age: 24 },
  { id: 4, name: '赵六', age: 23 },
]

console.log(_search(obj, 24, ['name', 'age']))
/* [ { id: 2, name: '李四', age: '24' },
  { id: 3, name: '王五', age: '24' } ] */

console.log(_search(obj, ['zs'], ['name', 'age']))
/* [ { id: 1, name: '张三', age: '20' } ] */

console.log(_search(obj, 'LiS', ['name', 'age']))
/* [ { id: 2, name: '李四', age: '24' } ] */

console.log(_search(obj, ['张三', 'ww', 23], ['name', 'age']))
/* [ { id: 1, name: '张三', age: '20' },
  { id: 3, name: '王五', age: '24' },
  { id: 4, name: '赵六', age: '23' } ] */
```

</template>
</DemoBlock>

## 精确的十进制计算

<DemoBlock src='javascript/decimal.ts'>

<template #demo>

```ts
decimal([1, 2, 3], ['+', '-'], 2)
```

</template>
</DemoBlock>
