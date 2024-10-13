# 函数

## 转大驼峰

```ts
export const camelize = (str: string): string =>
  str.replace(/-(\w)/g, (_, key) => key.toUpperCase());
```

## 转小驼峰

```ts
export const kebabCase = (str: string): string =>
  str.replace(
    /[A-Z]+(?![a-z])|[A-Z]/g,
    (_, ofs) => (ofs ? '-' : '') + _.toLowerCase()
  );
```

## 判断文件后缀

```ts
const extMap = {
  script: ['js', 'ts'],
  style: ['css', 'less'],
  jsx: ['jsx', 'tsx'],
};
const isTargetFile = (file: string, type: keyof typeof extMap) =>
  new RegExp(`\\.(${(extMap[type] || extMap['script']).join('|')})`, 'g').test(
    file
  );
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
  str: string;
  visibleStart?: number;
  visibleEnd?: number;
  mask?: string;
}) =>
  str
    .trim()
    .replace(
      new RegExp(`^([\\s\\S]{${visibleStart}}).*([\\s\\S]{${visibleEnd}})$`),
      (match, start, end) =>
        `${start}${'*'.repeat(match.length - start.length - end.length)}${end}`
    );

// 例子
obfuscateString({ str: '47382788239473894', visibleStart: 2, visibleEnd: 2 });
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
import getIdCardInfo from './getIdCardInfo';

const info = getIdCardInfo('310401200001243822');
console.log('info: ', info);
// { age: 24, birthday: '2000/01/24', gender: 0 }
```
</template>
</DemoBlock>
