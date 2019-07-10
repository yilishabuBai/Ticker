/*
 * @Author: 伊丽莎不白 
 * @Date: 2019-07-05 17:17:30 
 * @Last Modified by: 伊丽莎不白
 * @Last Modified time: 2019-07-10 15:35:20
 */
export default class Ticker {
    static _ticker: Ticker = new Ticker();
    
    _running: boolean = false;  // 正在运行
    _systemTime: number = 0;    // 系统时间
    _lastTime: number = 0;  // 上次执行时间
    _timerId: NodeJS.Timeout = null;    // 计时器id
    _delay: number = 33;    // 延时设定
    _funcs: Array<Function> = [];   // 钩子函数队列
    _executeFuncs: Array<ExecuteValue> = [];   // 定时执行函数队列，按执行时间升序排序

    constructor () {
    }

    /**
     * 查找第一个大于目标值的值的下标
     * @param time 
     */
    _searchIndex (time: number) {
        let funcs: Array<ExecuteValue> = this._executeFuncs;
        let low: number = 0;
        let high: number = funcs.length;
        let mid: number = 0;
        while (low < high) {
            mid = Math.floor(low + (high - low) / 2);
            if (time >= funcs[mid].time) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return low;
    }

    /**
     * 注册钩子函数
     * @param func 执行函数
     */
    _register (func: Function) {
        if (this._funcs.includes(func)) {
            return;
        }
        this._funcs.push(func);
    }

    /**
     * 注册一个函数，在一段时间之后执行
     * @param func 执行函数
     * @param delay 延时
     * @param time 执行时系统时间
     * @param loop 循环次数
     */
    _registerDelay (func: Function, delay: number, time: number, loop: number) {
        // 先查找后插入
        let index: number = this._searchIndex(time);
        let value: ExecuteValue = { func: func, time: time, delay: delay, loop: loop };
        this._executeFuncs.splice(index, 0, value);
    }

    /**
     * 注册一个函数，在某个时间点执行
     * @param func 执行函数
     * @param time 执行时间
     */
    _registerTimer (func: Function, time: number) {
        // 先查找后插入
        let index: number = this._searchIndex(time);
        let value: ExecuteValue = { func: func, time: time };
        this._executeFuncs.splice(index, 0, value);
    }

    /**
     * 移除钩子函数
     * @param func 执行函数
     */
    _unregister (func: Function) {
        this._funcs.map((value: Function, index: number) => {
            if (func === value) {
                this._funcs.splice(index, 1);
            }
        });
    }

    /**
     * 启动Ticker，并设置当前系统时间，通常与服务器时间同步
     * @param systemTime 系统时间
     */
    _start (systemTime: number = 0) {
        if (this._running) {
            return;
        }
        this._running = true;
        this._systemTime = systemTime;
        this._lastTime = new Date().getTime();
        this._update();
    }

    /**
     * 链式执行定时器，钩子函数队列为每次调用必执行，定时执行函数队列为系统时间大于执行时间时调用并移出队列
     */
    _update () {
        let currentTime: number = new Date().getTime();
        let delay: number = currentTime - this._lastTime;
        this._systemTime += delay;
        // 钩子函数队列，依次执行即可
        this._funcs.forEach((value: Function) => {
            value(delay);
        });

        this._executeFunc();
        
        this._lastTime = currentTime;
        this._timerId = setTimeout(this._update.bind(this), this._delay);
    }

    /**
     * 执行定时函数
     */
    _executeFunc () {
        // 取数组首项进行时间校验
        if (this._executeFuncs[0] && this._executeFuncs[0].time < this._systemTime) {
            // 取出数组首项并执行
            let value: ExecuteValue = this._executeFuncs.shift();
            value.func();

            // 递归执行下一项
            this._executeFunc();
            
            // 判断重复执行次数
            if (value.hasOwnProperty('loop')) {
                if (value.loop > 0 && --value.loop === 0) {
                    return;
                }
                // 计算下次执行时间，插入队列
                let fixTime: number = value.time + value.delay;
                this._registerDelay(value.func, value.delay, fixTime, value.loop);
            }
        }
    }

    /**
     * 停止Ticker
     */
    _stop () {
        if (this._timerId) {
            clearTimeout(this._timerId);
            this._timerId = null;
        }
        this._running = false;
    }
    
    /**
     * 公开的钩子函数注册方法
     * @param func 执行函数
     */
    static register (func: Function) {
        this._ticker._register(func);
    }

    /**
     * 公开的钩子函数移除方法
     * @param func 执行函数
     */
    static unregister (func: Function) {
        this._ticker._unregister(func);
    }

    /**
     * 公开的延时执行函数方法，用户可设置执行次数，loop为0时无限循环
     * @param func 执行函数
     * @param delay 延时
     * @param loop 循环次数
     */
    static registerDelay (func: Function, delay: number, loop: number = 1) {
        let time: number = this._ticker._systemTime + delay;
        this._ticker._registerDelay(func, delay, time, loop);
    }

    /**
     * 公开的定时执行函数方法
     * @param func 执行函数
     * @param time 执行时间
     */
    static registerTimer (func: Function, time: number) {
        this._ticker._registerTimer(func, time);
    }

    /**
     * 公开的启动方法
     * @param systemTime 系统时间
     */
    static start (systemTime: number = 0) {
        this._ticker._start(systemTime);
    }

    /**
     * 公开的停止方法
     */
    static stop () {
        this._ticker._stop();
    }

    /**
     * 系统时间
     */
    static get systemTime (): number {
        return this._ticker._systemTime;
    }

    /**
     * 正在运行
     */
    static get running (): boolean {
        return this._ticker._running;
    }
}

interface ExecuteValue {
    func: Function;
    time: number;
    delay?: number;
    loop?: number;
}