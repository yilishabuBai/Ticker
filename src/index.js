import Ticker from './js/ticker';

var root = document.getElementById('root');
var updateNode = document.createElement('div');
root.appendChild(updateNode);

var updateTimes = 0;
function update (delayTime) {
    updateTimes++;
    updateNode.innerText = '钩子函数执行间隔' + delayTime + '毫秒，执行次数' + updateTimes;
}

var delayNode = document.createElement('div');
root.appendChild(delayNode);
delayNode.innerText = '系统开始运行';
function run () {
    delayNode.innerText = '系统运行时间' + Math.floor(Ticker.systemTime / 1000) + '秒';
}

var onceNode = document.createElement('div');
root.appendChild(onceNode);
onceNode.innerText = '5秒钟之后我会发生变化';
function once () {
    onceNode.innerText = '我发生了变化';
}

var timerNode = document.createElement('div');
root.appendChild(timerNode);
timerNode.innerText = '系统时间运行到10秒，我会发生变化';
function timer () {
    timerNode.innerText = '我发生了变化';
}

// 使用Ticker
Ticker.start();
Ticker.register(update);
Ticker.registerDelay(run, 1000, 0);
Ticker.registerDelay(once, 5000);
Ticker.registerTimer(timer, 10000);