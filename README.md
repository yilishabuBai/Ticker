# Ticker

用于维护项目时间线的工具

## 使用示例

```js
Ticker.start(); // 启动Ticker，此时systemTime为0
```

或者

```js
var currentTime = new Date().getTime();
Ticker.start(currentTime);  // 启动Ticker，此时systemTime从currentTime开始计时
```

注册钩子函数

```js
// Ticker会每隔33毫秒执行一次钩子函数，并将两次执行的间隔时间当作参数传入
// 由于使用链式setTimeout调用，实际执行间隔会大于33毫秒
function callback (delayTime) {
    console.log(delayTime);
}

Ticker.register(callback);
```

注册延时执行函数

```js
function callback () {
    console.log('1000毫秒后，我会打印.');
}

Ticker.registerDelay(callback, 1000);
```

注册定时执行函数

```js
function callback () {
    console.log('当systemTime到1000毫秒的时候，我会打印');
}

Ticker.registerTimer(callback, 1000);
```