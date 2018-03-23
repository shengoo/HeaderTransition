1. 初始化项目

```js
react-native init HeaderTransition
```

1. 定义header的最大和最小高度，以及可滚动的距离

```js
const HEADER_MAX_HEIGHT = 160;
const HEADER_MIN_HEIGHT = 44;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
```

1. 