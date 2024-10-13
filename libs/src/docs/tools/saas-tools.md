# saas 工具集合

`Sass` 是一款强化 `CSS` 的辅助工具（即 `CSS` 预处理器或 `CSS` 预编译语言），它在 `CSS` 语法的基础上增加了变量 (`variables`)、嵌套 (`nested rules`)、混合 (`mixins`)、导入 (`inline imports`) 等高级功能，这些拓展令 `CSS` 更加强大与优雅。

- [Sass 官网](https://sass-lang.com/)

## mixins

### 元素大小

```scss
@mixin size($width, $height: $width) {
  width: $width;
  height: $height;
}
```

### flex 居中

```scss
@mixin flex-center($direction: row) {
  display: flex;
  @if $direction != row {
    flex-direction: $direction;
  }
  justify-content: center;
  align-items: center;
}
```

### 显示省略号

```scss
/* 单行省略号 */
@mixin ellipsis() {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 多行省略号 */
@mixin multi-ellipsis($row: 2) {
  @if type-of($row) != 'number' {
    @error '$row 必须是一个有效的数字';
  }

  display: -webkit-box;
  -webkit-line-clamp: $row;
  line-clamp: $row;
  /* autoprefixer: ignore next */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break:break-all;
}

/* 组合写法 */
@mixin ellipsis($row: 1) {
  @if type-of($row) != 'number' {
    @error '$row 必须是一个有效的数字';
  }

  @if $row == 1 {
    white-space: nowrap;
  } @else {
    display: -webkit-box;
    -webkit-line-clamp: $row;
    line-clamp: $row;
    /* autoprefixer: ignore next */
    -webkit-box-orient: vertical;
    word-break:break-all;
  }
  overflow: hidden;
  text-overflow: ellipsis;
}
```

### 滚动

```scss
@mixin scroll($type: 'y') {
  @if $type == 'x' {
    overflow-x: auto;
    overflow-y: hidden;
  } @else if $type == 'y' {
    overflow-x: hidden;
    overflow-y: auto;
  } @else {
    overflow: auto;
  }
  -webkit-overflow-scrolling: touch;
}
```

### 扩展点击区域

常用于移动端，毕竟总有一些小图标按钮不好点击,strip-unit的定义[在此处](#strip-unit) 

```scss
/* 移除单位 */
@function strip-unit($value) {
  @return $value / ($value * 0 + 1);
}

@mixin extend-click($size: 5) {
  $value: strip-unit($size) * -1px;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    top: $value;
    left: $value;
    right: $value;
    bottom: $value;
  }
}
```

### 安全距离

iPhone X 以上手机添加安全距离

```scss
@mixin safe-area($direction, $value) {
  @if not index(top right bottom left, $direction) {
    @error '$direction 必须为 `top`, `right`, `bottom`, `left`';
  }

  @if $value {
    padding-#{$direction}: $value;
    padding-#{$direction}: calc(
      constant(safe-area-inset-#{$direction}) + #{$value}
    );
    padding-#{$direction}: calc(env(safe-area-inset-#{$direction}) + #{$value});
  } @else {
    padding-#{$direction}: constant(safe-area-inset-#{$direction});
    padding-#{$direction}: env(safe-area-inset-#{$direction});
  }
}
```

## function

### 移除单位 {#strip-unit}

```scss
@function strip-unit($value) {
  @return $value / ($value * 0 + 1);
}

/* math 函数版本（个人不太喜欢） */
@function strip-unit($value) {
  @return math.div($value, ($value * 0 + 1));
}
```

### 转换为 rem

一般情况下使用 [postcss-pxtorem](https://github.com/cuth/postcss-pxtorem) 处理就行，但是有些神坑项目里面存在几套 `rem` 标准

```scss
$rem-base: 16px !default;

@function to-rem($value, $base: $rem-base) {
  $result: strip-unit($value) / strip-unit($base) * 1rem;
  @if $result == '0rem' {
    @return 0;
  }
  @return $result;
}
```

### 转换hex颜色格式 演示格式为 rgba

```scss

@use 'sass:color';
@use 'sass:meta';


// 定义一个Sass函数，该函数接收一个颜色值作为输入，并返回一个包含RGB三个分量的字符串。
@function getRgbString($color,$alpha: 1) {
    @if (meta.type-of($color) == color) {
      @return color.red($color) color.green($color) color.blue($color) / #{$alpha};
    } @else {
      @return $color;
    }
  }

// 例子
// dominant:getRgbString(#35affd,0.36)
```
