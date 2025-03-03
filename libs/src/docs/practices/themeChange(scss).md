# Scss 主题切换

## 定义

```scss
$themes: (
  light: (
    background: #fff,
    color: #333,
    border: 1px solid #ddd,
  ),
  dark: (
    background: #333,
    color: #fff,
    border: 1px solid #333,
  ),
);
$curTheme: light;
@function getVar($key) {
  @return map-get(map-get($themes, $curTheme), $key);
}

@mixin useTheme() {
  @each $key, $value in $themes {
    $curTheme: $key !global;
    html[data-theme='#{$key}'] & {
      @content;
    }
  }
}
```

## 使用

```scss
.abc {
  width: 100px;
  height: 100px;
  @include useTheme {
    background: getVar(background);
    color: getVar(color);
    border: getVar(border);
  }
}
```

