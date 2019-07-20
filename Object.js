

/**
 * 从一个对象上取指定的属性 或 设置属性的值
 * @public
 * @param {Object} obj - 对象
 * @param {Array} propArr - 属性名称的数组
 * @param {any} [val]   -  要设置的值 省略时表示获取，否则就是设置
 * @param {Boolean} [fource=false]   - 在设置时，如果不存在对应的属性，是否创建
 * @returns {any|undefined} 设置时一定返回undefined, 获取时，返回对应的值，如果不存在则返回undefined
 * @example
 * 1. props({}, ['aa', 'bb', 'cc'], 5);  // => undefined 什么也没做
 * 2. props({}, ['aa', 'bb', 'cc'], 5, true);  // => undefined  在空对象上创建了多层属性 {aa: {bb: {cc: 5} }}
 * 3. props({}, ['aa', 'bb', 'cc']);  // => undefined
 * 4. props({aa: {bb: 77}}, ['aa', 'bb']);  // => 77
 * 5. props({aa: 3}, ['aa', 'bb', 'cc'], 5);  // => undefined 什么也没做
 * 6. props({aa: 3}, ['aa'], 5);  // => undefined  设置了 aa 的值为5
 * 7. props({aa: 3}, [], 5);  // => undefined 什么也没做
 */
function props(obj, propArr, val, fource = false){
    for(let i=0, subObj = obj, len = propArr.length, propName; i<len; i++){
        propName = propArr[i];
        if(i === len -1 ){
            if(val === undefined){
                return subObj[ propName ];
            }else{
                subObj[ propName ] = val;
            }
        }else{
            if( !(subObj[ propName ] && typeof subObj[ propName ] === 'object') ){
                if(fource && val !== undefined){
                    subObj[ propName ] = {};
                }else{
                    return;
                }
            }
            subObj = subObj[ propName ];
        }
    }
}

/**
 * 递归法遍历对象的所有属性, 不改变原对象。  
 * 如果其中存在循环引用，则这个循环引用将不会再次被遍历到  
 * @public
 * @param {any} obj - 要遍历的对象
 * @param {function} leafCallback - 遍历到叶子节点时的回调 leafCallback(propArr, obj, parentObjsArr) 返回 'break' 可以跳出遍历
 * @param {Object} [{
 *                  leafThisObj = null, deep = 0, propArr = [], parentObjsArr = [], 
 *                  nodeCallback = null, nodeThisObj = null, cicleBreak = false
 *                  }] - 遍历的其它可选参数
 *         deep - 遍历的深度， 小于等于0表示不限制深度     
 *         propArr - 用于存储访问属性的路径     
 *         parentObjsArr - 用于存储遍历过的对象     
 *         nodeCallback - 遍历到每一个节点的回调，返回 'break' 可以跳出遍历， 返回 true 表示进行下一个分支的遍历   
 *         cicleBreak - 当遇到循环引用时，是否直接退出整个遍历   
 * @example
 * 1.  // 正常情况下
 * let testData = {aa: 3, bb: {ee: 4, ff: 5, gg: {kk: 6}}, cc: [{aa: 3}, {ee: {bb: 4}}]}; 
 * treeObject(testData, {leafCallback: function(propArr, val, parentObjsArr){console.log(propArr, val, parentObjsArr)}});
 * // => ["aa"]                    3    [{…}]
 * // => ["bb", "ee"]              4    [{…}, {…}]
 * // => ["bb", "ff"]              5    [{…}, {…}]
 * // => ["bb", "gg", "kk"]        6    [{…}, {…}, {…}]
 * // => ["cc", "0", "aa"]         3    [{…}, Array(2), {…}]
 * // => ["cc", "1", "ee", "bb"]   4    [{…}, Array(2), {…}, {…}]
 * 
 * 2. // 存在循环引用时
 *    let testData= {aa: 3, bb: 4}; testData.cc = testData;  
 *    treeObject(testData, {leafCallback: function(propArr, val, parentObjsArr){console.log(propArr, val, parentObjsArr)}});
 * // => ["aa"] 3 [{aa: 3, bb: 4, cc: {…}}]
 * // => ["bb"] 4 [{aa: 3, bb: 4, cc: {…}}]
 * // => 存在循环引用:  root => cc
 * 
 * 3. //指定遍历的深度
 *    let testData = {aa: 3, bb: {ee: 4, ff: 5, gg: {kk: 6}}, cc: [{aa: 3}, {ee: {bb: 4}}]}; 
 *    treeObject(testData, {leafCallback: function(propArr, val, parentObjsArr){console.log(propArr, val, parentObjsArr)}, deep: 1});
 * // => ["aa"] 3 [{…}]
 * // => ["bb"] {ee: 4, ff: 5, gg: {…}} [{…}]
 * // => ["cc"] (2) [{…}, {…}] [{…}]
 */
function treeObject(obj, {
        leafCallback = null, leafThisObj = null, 
        nodeCallback = null, nodeThisObj = null, 
        deep = 0, propArr = [], parentObjsArr = [], cicleBreak = false
    } = {}
    ){
    const treeCall = (obj)=>{
        let callResult;
        if(typeof nodeCallback === 'function'){  //判断是否应该提前结束本分支的遍历
            callResult = nodeCallback.call(nodeThisObj, propArr, obj, parentObjsArr);
            if(callResult === 'break'){
                return true;
            }
        }
        const isMathEnd = callResult === true;
        if(
            typeof leafCallback === 'function' && // 有回调才有这一步的必要
            (
                isMathEnd ||  //达到指定的条件时
                deep >0 && propArr.length >= deep ||  // 如果已经达到指定深度
                ! (obj && typeof obj === 'object')    // 如果不是对象
            )
        ){ 
            callResult = leafCallback.call(leafThisObj, propArr, obj, parentObjsArr);
            return callResult === 'break';
        }
        if(parentObjsArr.includes(obj)){
            console.error('存在循环引用: ', ['root', ...propArr].join(' => '));
            return cicleBreak;
        }
        callResult = null;
        parentObjsArr.push(obj);
        for(let [key, value] of Object.entries(obj)){
            propArr.push(key);
            callResult = treeCall(value);
            propArr.pop();
            if(callResult === true){
                break;
            }
        }
        parentObjsArr.pop();
        return callResult;
    }
    treeCall(obj);
    return obj;
}

/**
 * 监听指定对象上的值的变化
 * @public
 * @param {object} obj - 对象
 * @param {String|Array<String>} name - 要监听的属性名
 * @param {function} [setFunc=null] - 设置时的监听, 回调参数:  
 *                                    setFunc(oldValue, newValue, name, obj) 返回了值的话，就作为最终设置的值
 * @param {function} [getFunc=null] - 获取时的监听, 回调参数:  
 *                                    getFunc(value, name, obj) 返回了值的话，就作为最终获取的值
 * @param {boolean} [isCache=true] - 是否比较在值有变化时才回调setFunc函数
 * @returns {Object} 返回传入的obj
 */
function watch_value(obj, name, setFunc = null, getFunc = null, isCache = true){
    if(obj == null){
        return obj;
    }
    if(Array.isArray(name)){
        for(let i=0; i<name.length; i++){
            watch(obj, name[i], setFunc, getFunc, isCache);
        }
        return obj;
    }
    const innerName = '__watch__' + name;
    obj[innerName] = obj[name];
    Object.defineProperty(obj, name, {
        configurable: false,
        enumerable: false,
        // value: undefined,
        // enumerable: false,
        get: function(){
            let value = obj[innerName];
            if(typeof getFunc === 'function'){
                const result = getFunc(obj[innerName], name, obj);
                if(result !== undefined){
                   value = result;
                }
             }
            return value;
        }, 
        set: function(value){
            if( isCache && obj[innerName] === value ){
                return;
            }
            if(typeof setFunc === 'function'){
               const result = setFunc(obj[innerName], value, name, obj);
               if(result !== undefined){
                  value = result;
               }
            }
            obj[innerName] = value;
        }
    });
    return obj;
}
