# 正则表达式

## 判断移动端设备 {#isMobile}

```javaScript
const IsMobileRegx = /phone|pad|pod|iphone|ipod|ios|ipad|android|mobile|blackberry|iemobile|mqqbrowser|juc|fennec|wosbrowser|browserng|webos|symbian|windows phone/

// 例
const isMobile = IsMobileRegx.test(navigator.userAgent.toLowerCase())

```

## 是否是金额

```javascript
/^(0|([1-9]\d*))(\.\d{1,2})?$/

/(?:^[1-9]([0-9]+)?(?:\.[0-9]{1,2})?$)|(?:^(?:0){1}$)|(?:^[0-9]\.[0-9](?:[0-9])?$)/
```

## 是否是手机号

```javascript
/^1\d{10}$/

/^1[3-9]\d{9}$/
```

## 是否是邮箱

```javascript
/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

/**
 * 参考 MDN
 * https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/Input/email#basic_validation
 */
/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
```

## 是否是链接地址

```javascript
/^(https|http):\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/
```
## 是否是身份证号码 {#isIdCardregexp}

```javascript
/^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/

```

## 是否是 16 进制颜色

```javascript
/^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/
```

## 环境判断

```js
const UA = window.navigator.userAgent.toLowerCase()

// Android
const isAndroid = /android/.test(UA)

// IOS
const isIOS = /iphone|ipad|ipod|ios/.test(UA)

// 浏览器环境
const inBrowser = typeof window !== 'undefined'

// IE
const isIE = /msie|trident/.test(UA)

// Edge
const isEdge = UA.indexOf('edge/') > 0

// Chrome
const isChrome = /chrome\/\d+/.test(UA) && !isEdge

// 微信
const isWeChat = /micromessenger/.test(UA)

// 移动端
const isMobile = 'ontouchstart' in window
```

