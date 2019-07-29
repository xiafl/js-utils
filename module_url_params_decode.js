




//******************************* 解码url中的参数 ******************************* */
/**
 * v1.0.0
 * 最后修改: 2019.7.29
 * 创建: 2019.7.17
 */
/**
 * 根据对象的属性名，将对象进行展开
 * @public
 * @param {Object|string} obj - 要转换的对象 如: {qq: "88", dd[a]: "3", dd[cc][u]: "888", dd[b]: "4"}
 * @returns {Object} 转换的结果
 * @example
 * 1. 传入一个对象
 * decodeUrlParam( {qq: "88", 'dd[a]': "3", 'dd[cc][u]': "888", 'dd[b]': "4"} );
 * // => {qq: "88", dd: {a: "3", cc: {u: "888"}, b: "4"}}
 * 
 * 2. 传入一个字符串
 * decodeUrlParam(  'qq=88&dd[a]=3&dd[cc][u]=888&dd[b]=4' );
 * // => {qq: "88", dd: {a: "3", cc: {u: "888"}, b: "4"}}
 */
function decodeUrlParam(obj, left = '[', right = ']'){
    if(typeof obj === 'string'){
        obj = querystring_parse(obj);
    }
    const result = {};
    for(let prop in obj){
        const propArr = splitSign(prop, left, right);
        props(result, propArr, obj[prop], true);
    }
    allNumPropObjToArr(result, true);
    return result;
}

/**
 * 递归遍历对象，将其中的属性名全是数字的对象转换为一个数组。
 * 注意，会修改原对象。
 * @public
 * @param {any} obj - 要遍历的对象，如果是数组或非对象，则不会进行遍历
 * @param {boolean} [isAddArrLike=false] - 如果遍历到的对象含有数字属性名和非数字属性名，是否转换为类数组
 * @example
 * 1. // 将属性名全是数字的对象转换为数组
 * let obj = {aa: "3", bb: {ee: '4', ff: '5', gg: {kk: "6"}}, cc: {'0': {aa: '3'}, '1': {ee: {bb: 4}}}};
 * allNumPropObjToArr(obj);
 * // => {aa: "3", bb: {ee: '4', ff: '5', gg: {kk: "6"}}, cc: [{aa: '3'}, {ee: {bb: 4}}] }
 */
function allNumPropObjToArr(obj, isAddArrLike = false){

    // 判断一个对象中的属性名是否全是数字
    const reg = /^(?:0|[1-9]\d*)$/, maxNum = 9007199254740991;
    const getNumIndexInfo = (obj)=>{ 
        let isAllNum = null, hasNum = false, maxLen = 0;
        for(let prop in obj){
            const propNum = +prop;
            if ( reg.test(prop) && propNum <= maxNum ) { // 如果是数字
                maxLen = propNum > maxLen ? propNum : maxLen;
                if(isAllNum === null){
                    isAllNum = true;
                }
                hasNum = true;
            }else{
                isAllNum = false;
            }
        }
        isAllNum = !!isAllNum;
        return {isAllNum, hasNum, maxLen};
    }

    const objForEach = (obj, parent, prop)=>{
        if( obj && typeof obj === 'object' && !Array.isArray(obj) ){
            const {isAllNum, hasNum, maxLen} = getNumIndexInfo(obj);
            if(isAllNum){  // 如果全部是数字属性名
                const arr = Object.values(obj);
                if(!parent){ // 如果最开始的 obj 是一个数组，就不存在 parent 
                    return arr;
                }
                parent[prop] = arr;
                obj = arr;
            }else if(isAddArrLike && hasNum && !('length' in obj)){  //如果有数字属性名，但还有非数字属性名
                obj.length = maxLen; // 添加一个length 属性而成为类数组
            }
            for(let prop in obj){
                objForEach(obj[prop], obj, prop);
            }
        }
    }
    objForEach(obj);
}

// nodejs 中 querystring.parse 函数的源码
function querystring_parse(qs, sep, eq, options){
    sep = sep || '&';
    eq = eq || '=';
    var obj = {};
    if (typeof qs !== 'string' || qs.length === 0) {
      return obj;
    }
    var regexp = /\+/g;
    qs = qs.split(sep);
    var maxKeys = 1000;
    if (options && typeof options.maxKeys === 'number') {
      maxKeys = options.maxKeys;
    }
    var len = qs.length;
    // maxKeys <= 0 means that we should not limit keys count
    if (maxKeys > 0 && len > maxKeys) {
      len = maxKeys;
    }
    for (var i = 0; i < len; ++i) {
      var x = qs[i].replace(regexp, '%20'), // 注意，将+号转换为空格了
          idx = x.indexOf(eq),
          kstr, vstr, k, v;
      if (idx >= 0) {
        kstr = x.substr(0, idx);
        vstr = x.substr(idx + 1);
      } else {
        kstr = x;
        vstr = '';
      }
      try {
        k = decodeURIComponent(kstr);
        v = decodeURIComponent(vstr);
      } catch (e) {
        k = unescape(kstr, true);
        v = unescape(vstr, true);
      }
      if (!Object.prototype.hasOwnProperty.call(obj, k)) {
        obj[k] = v;
      } else if (Array.isArray(obj[k])) {
        obj[k].push(v);
      } else {
        obj[k] = [obj[k], v];
      }
    }
    return obj;
}

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
 * 使用成对的(如括号)符号进行字符串分割
 * @public
 * @param {String} str - 要分割的字符串
 * @param {String} [left='['] - 左边的字符
 * @param {String} [right=']'] - 右边的字符
 * @returns {Array} 
 * @example
 * 1. splitSign('dd[cc][u]'); // => ['dd', 'cc', 'u']
 * 2. splitSign(''); // => []
 * 3. splitSign('dd(cc](u]', '('); // => ['dd', 'cc', 'u']
 */
function splitSign(str, left = '[', right = ']'){
    if(!str){
        return [];
    }
    let reg;
    if(right === left){
        reg = new RegExp(`\\s*\\${left}\\s*`, 'g');  //  '\\.'
    }else{
        reg = new RegExp(`\\s*\\${left}\\s*|\\s*\\${right}\\s*\\${left}\\s*|\\s*\\${right}\\s*`, 'g');  //  '\\]|\\]\\[|\\]'
    }
    return str.split(reg).filter(val=>val);
}

//******************************* 解码url中的参数 ******************************* */



