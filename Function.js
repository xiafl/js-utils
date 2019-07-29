

/**
 * 按照参数的类型将其分配到指定的变量中
 * @public
 * @param {Array} args - 参数
 * @param {Object} params_outer - 配置 类似于： {'1': 'age', 'string': 'name' , 'boolean': 'loop', 'number': 'volume', 'function': 'callback'};
 *                                属性名为数字时，表示args数组中的索引； 属性名为字符串时，表示类型；值表示变量名
 *                                支持的类型有: 'boolean' 'number' 'string' 'function' 'Array' 'RegExp' 'Promise' 'object' 
 * @returns {Object} 获取到的参数对象 如: {'age': 17, name: '小明', 'loop': true, volume: 0.73}
 * @example
 * 1. getTypeParams([true, '小明', 17], {'string': 'name', 'number': 'age', 'boolean': 'isStudent'});
 * // => {name: '小明', age: 17, isStudent: true}
 * 
 * 2. getTypeParams([98, true, '小明', 17], {'string': 'name', 'number': 'age', 'boolean': 'isStudent', '0': 'score'});
 * // => {score: 98, name: '小明', age: 17, isStudent: true}
 */
function getTypeParams(args, params_outer){
    let params = Object.assign({}, params_outer);
    for(let i=0, arg, propName; i<args.length; i++){
        arg = args[i];
        if(i in params){
            propName = params[i];
            delete params[i];
            params[propName] = arg;
            args.splice(i, 1);
            i --;
        }
    }

    for(let i=0, arg, propName; i<args.length; i++){
        arg = args[i];
        switch(typeof arg){
            case 'boolean': 
            case 'number': 
            case 'string': 
            case 'function': 
            delete params[ arg ];
                propName = params[ arg ]; 
                delete params[ arg ];
                params[propName] = arg; 
            break;
            case 'object': 
                if(Array.isArray(arg)){
                    if('Array' in params){
                        propName = params[ 'Array' ];
                        delete params[ 'Array' ] ;
                    }else{
                        break;
                    }
                }else if(arg instanceof RegExp){
                    if('RegExp' in params){
                        propName = params[ 'RegExp' ];
                        delete params[ 'RegExp' ] ;
                    }else{
                        break;
                    }
                }else if(arg instanceof Promise){
                    if('Promise' in params){
                        propName = params[ 'Promise' ];
                        delete params[ 'Promise' ] ;
                    }else{
                        break;
                    }
                }else{
                    if('object' in params){
                        propName = params[ 'object' ];
                        delete params[ 'object' ] ;
                    }else{
                        break;
                    }
                }
                params[propName] = arg;
            break;
        }
    }
    for(prop in params_outer){
        if(prop in params){
            delete params[prop];
        }
    }
    params_outer = null;
    return params;
}

/**
 * 分次执行某个函数
 * 使用场景: 异步执行某个操作，这个操作可能会失败，所以当失败时，需要再尝试几次，直到成功或尝试次数用完
 * @public
 * @param {function} callback - 要执行的函数 callback.call(thisObj, next, currCount, timers)
 * @param {any} [thisObj=null] - callback中的this
 * @returns {function} 返回next函数，next函数可以传入以下两个参数   
 * 					  {any} [delayTime=-1] - 延迟多久(ms)再执行下一次callback回调
 * 											 负数、NaN、Infinite表示立即同步调用，其它值表示延迟执行
 * 					  {string} [type='both'] - 当调用next时，如果其它地方也调用了next并且还没有完成，此时该保留哪次调用
 * 						   				'new' - 保留本次的，清除所有原来的
 * 						   				'old' - 保留所有原来的，舍弃本次的
 * 						   				'both' - 两个都保留
 * @example
 * 1. 最简单的使用
 * stepRunFunc((next, currCount, timers)=>{
 * 		console.log('执行第' + currCount + '次');
 *      currCount <= 2 && next(2000);
 * })();
 * // => 会立即执行第一次，然后2s后再执行第二次
 * 
 * 2. next()函数的第二个参数，是考虑到，用户可能会在短时间内连续调用多次，此时应该怎么处理这些next调用之间的关系
 * stepRunFunc((next, currCount, timers)=>{
 * 		console.log('执行第' + currCount + '次');
 *      if(currCount <= 2 ){
 *          next(3000);
 *          setTimeout(()=>{next(1000, 'old')}, 1000); // 这一次next调用将不起作用
 *      }
 * })();
 * // => 会立即执行第一次，然后3s后再执行第二次
 */
function stepRunFunc(callback, thisObj = null){
    const getDelayTime = (delayTime)=>{ // 转换delayTime的格式
        delayTime = parseInt(delayTime);
        if(isNaN(delayTime) || !isFinite(delayTime)){
            delayTime = -1;
        }
        return delayTime;
    }
    const timers = []; // 记录所有正在执行的计时器
    const clearTimer = (oneTimer)=>{  // 清除定时器
        if(oneTimer == null){
            for(let i=0; i<timers.length; i++){
                clearTimeout(timers[i]);
            }
            timers.length = 0;
        }else{
            const index = timers.indexOf(oneTimer);
            if(index > -1){
                clearTimeout(timers[index]);
                timers.splice(index, 1);
            }
        }
    }
    let currCount = 0; // 记录callback当前已经执行了的次数
    const next = function(delayTime = -1, type = 'both'){
        if(type === 'new'){ // 如果只保留最新的next回调
            clearTimer();
        }else if(type === 'old' && timers.length > 0){ // 保留以前的next回调，忽略本次next回调
            return;
        }
        delayTime = getDelayTime(delayTime);
        if(delayTime < 0){
            callback.call(thisObj, next, ++currCount, timers);
        }else{
            const oneTimer = setTimeout(()=>{
                clearTimer(oneTimer);
                callback.call(thisObj, next, ++currCount, timers);
            }, delayTime);
            timers.push(oneTimer);
        }
    }
    return next;
}