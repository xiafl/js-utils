



/**
 * 生成一个指定长度的随机数数组，数组的元素取值 [min, max)
 * @public
 * @param {number} [length=0] - 数组的长度
 * @param {number} [min=0] - 随机数的最小值
 * @param {number} [max=1] - 随机数的最大值
 * @returns  Array  - 一个新的随机数组
 * @example
 * 
 * 1. randomArr(4);   //生成 [0,1)的随机数组
 * // => [0.907440631863677, 0.9179344191798724, 0.6084427360446603, 0.4955541137302315]
 * 
 * 2. randomArr(4, 3); //生成 [3, 1) 的随机数组
 * // => [2.8843671806078723, 1.576131569769967, 2.0709581783787474, 1.407648076583225]
 * 
 * 3. randomArr(4, 3, 10); //生成 [3, 10) 的随机数组
 * // => [8.203333050028927, 5.46812783865793, 4.296903604936294, 6.737924681142783]
 * 
 */
function randomArr(length = 0, min = 0, max = 1) {  //生成一个随机数组
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
 * 遍历数组或对象
 * @public
 * @param {object|Array} obj - 要遍历的对象
 * @param {function} func - 回调  func.call(thisObj, value, prop, obj);
 * @param {any} [thisObj=null] - 回调中的this
 * @example
 * 1. forEach({a: 3, b: 4}, ()=>{
 * });
 */
function forEach(obj, func, thisObj = null) {
    if (obj == null || typeof func !== 'function') {
        return obj;
    }

    //对象自身的（不含继承的）所有可遍历（enumerable）属性
    let keys = Object.keys(obj);

    let isArrayLike = false;
    if (typeof obj !== 'function') {
        const length = obj.length;
        isArrayLike = typeof length == 'number' && length > -1 && length % 1 == 0 && length <= 9007199254740991;
    }

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













