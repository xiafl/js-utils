



/**
 * 生成一个指定长度的随机数数组，数组的元素取值 [min, max)
 * @public
 * @param {number} [length=0] - 数组的长度
 * @param {number} [min=0] - 随机数的最小值
 * @param {number} [max=1] - 随机数的最大值
 * @returns  Array  - 一个新的随机数组
 * @example
 * 
 * 1. generateRandomArr(4);   //生成 [0,1)的随机数组
 * // => [0.907440631863677, 0.9179344191798724, 0.6084427360446603, 0.4955541137302315]
 * 
 * 2. generateRandomArr(4, 3); //生成 [3, 1) 的随机数组
 * // => [2.8843671806078723, 1.576131569769967, 2.0709581783787474, 1.407648076583225]
 * 
 * 3. generateRandomArr(4, 3, 10); //生成 [3, 10) 的随机数组
 * // => [8.203333050028927, 5.46812783865793, 4.296903604936294, 6.737924681142783]
 * 
 */
function generateRandomArr(length = 0, min = 0, max = 1) {  //生成一个随机数组
    if (max < min) {
        [max, min] = [min, max];
    }
    const arr = [], space = max - min;
    for (let i = 0; i < length; i++) {
        arr[i] = Math.random() * space + min;
    }
    return arr;
}

/**
 * 将指定数组中的元素顺序打乱，注意，这个函数会改变原数组。
 * @public
 * @param {Array} arr - 要操作的数组。
 * @param {boolean} [isNew=true] - 是否新创建一个数组，而不改变原数组。
 * @returns {Array} 返回原数组或新的数组，并且已经打乱其顺序。
 * @example
 * 1. let arr = [3,8,7,9]; randomArr(arr); 
 * // => arr不变 反回一个新的数组 [9,3,7,8]
 * 
 * 2. let arr = [3,'c',7,{aa:7}]; randomArr(arr); 
 * // => arr不变 返回一个新的['c',3,{aa:7},7]
 * 
 * 3. let arr = [3,'c',7,{aa:7}]; randomArr(arr, false); 
 * // => arr 被改变成 ['c',3,{aa:7},7]
 */
function randomArr(arr, isNew = true){
    let result = isNew ? [...arr] : arr;
    for(let i=0, len = result.length,  pos, temp; i<len; i++){
        pos = Math.floor( len*Math.random() );     // 随机产生 [0, length-1] 的整数
        temp = result[i];  result[i] = result[pos]; result[pos] = temp; // 交换 i 与 pos 的位置
    }
    return result;
}

/**
 * 规范化一个数组
 * 只能是数字数组, 如果有非数值类型的元素，则抛出一个异常
 * 
 * @param {Array<number>} arr - 要规范化的数组
 * @returns  Array  - 一个新的数组，这个数组的和为1。也可能是一个空数组。
 * @example
 * 
 * 1. normalize([1, 3, 5, 9]);
 * // => [0.05555555555555555, 0.16666666666666666, 0.2777777777777778, 0.5]
 * 
 */
function normalize(arr) { //规范化一个数组，规范化之后，所有数组的值的和为1
    let result;
    if (Array.isArray(arr)) {
        const sum = arr.reduce((total, val) => +val + total, 0); //数组的和
        result = arr.map(val => val / sum);
    } else {
        result = [];
    }
    return result;
}

/**
 * 求数组的和
 * @param {...Array<number>|number} [values] 要求和的数组或单个的值
 * @returns  number  - 和
 * @example
 * 
 * 1. sum([1, 3, 5, 9]);
 * // => 18
 * 
 * 2. sum([1, 3, 5, 9], 7, [3, 2], 5);
 * // => 35
 * 
 */
function sum(...values) {
    let allTotal = 0;
    values.forEach(val => {
        if (Array.isArray(val)) {
            allTotal += val.reduce((total, val) => +val + total, 0);
        } else {
            allTotal += +val;
        }
    });
    return allTotal;
}

/**
* Checks if `value` is a valid array-like length.
*
* **Note:** This method is loosely based on
* [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
*
* @since 4.0.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
* @example
*
* isLength(3)
* // => true
*
* isLength(Number.MIN_VALUE)
* // => false
*
* isLength(Infinity)
* // => false
*
* isLength('3')
* // => false
*/
function isLength(value) {
    return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= 9007199254740991
}


/**
 * 检测是否是类数组或数组
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 * 1. isArrayLike([1, 2, 3]); // => true
 * 2. isArrayLike(document.body.children); // => true
 * 3. isArrayLike('abc'); // => true
 * 4. isArrayLike(Function); // => false
 */
function isArrayLike(obj, isIncludeArr = true) {
    if (obj == null || typeof obj === 'function') {
        return false;
    }
    if( Array.isArray ? Array.isArray(obj) : Object.prototype.toString.call(obj) === '[object Array]' ){
        return isIncludeArr;
    }
    const length = obj.length;
    const result = typeof length == 'number' && length > -1 && length % 1 == 0 && length <= 9007199254740991;
    return result;
}

/**
 * 检测是否是数组
 * @public
 * @param {any} obj - 要检测的对象
 * @returns {boolean} true为数组 false为非数组
 */
function isArray(obj) {
    return Array.isArray ? Array.isArray(obj) : Object.prototype.toString.call(obj) === '[object Array]';
}


/**
 * 遍历数组或类数组或普通对象
 * 跟原生的forEach的差别是: 可以遍历普通对象，也可以中途可以退出。
 * 注意，类数组只会遍历其中的数字属性。
 * @public
 * @param {object|Array} obj - 要遍历的对象
 * @param {function} func - 回调  func.call(thisObj, value, prop, obj);
 * @param {any} [thisObj=null] - 回调中的this
 * @example
 * 1. forEach({a: 3, b: 4}, (val, prop, obj)=>{ // 遍历普通对象
 *     return false; //返回false 表示退出循环
 * });
 * 
 * 2. forEach([3, 4], (val, index, obj)=>{ // 遍历数组
 *     return false; //返回false 表示退出循环
 * });
 * 
 * 3. forEach({1: 3, 5: 10, a: 'aa', length: 20}, (val, index, obj)=>{ // 遍历类数组
 *     return false; //返回false 表示退出循环
 * });
 */
function forEach(obj, func, thisObj = null) {
    if (obj == null || typeof obj === 'function' || typeof func !== 'function') {
        return obj;
    }

    //对象自身的（不含继承的）所有可遍历（enumerable）属性
    let keys = Object.keys(obj);

    const length = obj.length;
    const isArrayLike = typeof length == 'number' && length > -1 && length % 1 == 0 && length <= 9007199254740991;

    //如果是类数组或数组，只遍历其中的数字属性
    if (isArrayLike) {
        const reg = /^(?:0|[1-9]\d*)$/,
            maxNum = 9007199254740991,
            numPropArr = [];
        for (let i = 0, val; i < keys.length; i++) {
            val = keys[i];
            if (reg.test(val) && +val <= maxNum) {
                numPropArr.push(val);
            }
        }
        keys = numPropArr;
    }

    // 开始遍历所有的数字属性
    for (let i = 0; i < keys.length; i++) {
        if ( func.call(thisObj, obj[keys[i]], keys[i], obj) === false ) { break; }
    }
    return obj;
}

/**
 * 从一个数组中进行搜索，返回一个索引, 主要特点是可以深层搜索
 * 依赖: forEach  props 这两个函数
 * @public
 * @param {Array} arr - 要搜索的数组或类数组或普通对象
 * @param {any} searchVal - 要搜索的值 
 * @param {string|Array} [propPath=''] - 要搜索的值的路径， 如 'aa.bb.cc' 或 ['aa', 'bb', 'cc']
 * @param {function} [compareFunc=null] - 比较函数 compareFunc(val, searchVal, index, arrVal)
 *                                        省略时，表示进行全等比较。
 * @example
 * 1. 简单的使用
 * searchIndex([1, 2, 3], 2); // => 1
 * 
 * 2. 使用自定义的比较函数
 * searchIndex([1, 2, 3], '2', '', (val, searchVal)=>val==searchVal); // => 1
 * 
 * 3. 指定用值的路径
 * searchIndex([1, {aa: 3}, {aa: {bb: 3}}, {aa: {bb: 4}], 3, 'aa.bb'); // => 1
 */
function searchIndex(arr, searchVal, propPath = '', compareFunc = null){
    let result_index= -1;
    if(propPath){
        if(typeof propPath === 'string'){	
            propPath = propPath.split(/\s*[\,\.]\s*/);
        }else if( !Array.isArray(propPath) ){
            propPath = '';
        }
    }
    forEach(arr, (val, index, arrVal)=>{
        if(propPath){
            val = props(val, propPath);
        }
        if(
            typeof compareFunc === 'function' 
            ? compareFunc(val, searchVal, index, arrVal)
            : val === searchVal
        ){
            result_index = index;
            return false;
        }
    });
    return result_index;
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
 */
function treeArr(arr, {
        leafCallback = null, leafThisObj = null, 
        nodeCallback = null, nodeThisObj = null, 
        deep = 0, propArr = [], parentObjsArr = [], cicleBreak = false, isLinkArr = true,
    } = {}
    ){
    if( !Array.isArray(arr) ){
        arr = [arr];
    }
    const treeCall = (arr)=>{
        let callResult;
        if(typeof nodeCallback === 'function'){  //判断是否应该提前结束本分支的遍历
            callResult = nodeCallback.call(nodeThisObj, propArr, arr, parentObjsArr);
            if(typeof callResult === 'number' || callResult === 'break'){
                return callResult;
            }
        }
        const isMathEnd = callResult === true;
        if(
            isMathEnd ||  //达到指定的条件时
            deep >0 && propArr.length >= deep ||  // 如果已经达到指定深度
            ! Array.isArray(arr)    // 如果不是数组
        ){ 
            if(typeof leafCallback === 'function'){
                callResult = leafCallback.call(leafThisObj, propArr, arr, parentObjsArr);
                return callResult;
            }else{
                return;
            }
        }
        if(parentObjsArr.includes(arr)){
            console.error('存在循环引用: ', ['root', ...propArr].join(' => '));
            return cicleBreak && 'break';
        }
        callResult = null;
        parentObjsArr.push(arr);
        for(let i=0; i<arr.length; i++){
            propArr.push(i);
            callResult = treeCall(arr[i]);
            propArr.pop();
            if(typeof callResult === 'number'){
                i = callResult;
            }else if(callResult === 'break'){
                break;
            }
        }
        parentObjsArr.pop();
        return callResult;
    }
    treeCall(arr);
    return arr;
}







