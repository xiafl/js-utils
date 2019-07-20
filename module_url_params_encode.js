




//******************************* 将参数对象编码到url中 ******************************* */
/**
 * v1.0.0
 * 最后修改: 2019.7.19
 * 创建: 2019.7.19
 */
/**
 * 模拟 application/x-www-form-urlencoded 的编码方式, 将参数拼接到Url中
 * @public
 * @param {any} params - 要编码的参数，一般是一个对象
 * @param {Object}  [{separator = '&', pair = '=', left = '[', right = ']'}] - 其它的参数
 * @returns {string} 编码好的字符串
 * @example
 * 1. encodeUrlParam({aa: 3, bb: {ee: 4, ff: 5, gg: {kk: 6}}, cc: [{aa: 3}, {ee: {bb: 4}}]});
 * // => "aa=3&bb[ee]=4&bb[ff]=5&bb[gg][kk]=6&cc[0][aa]=3&cc[1][ee][bb]=4"
 */
function encodeUrlParam(params, {separator = '&', pair = '=', left = '[', right = ']'} = {}){
    const paramArr = [];

    // 递归法遍历对象的所有属性
    treeObject(params, (propArr, val, parentObjsArr)=>{
        if(typeof val === 'function'){
            return;
        }
        const lastObj = parentObjsArr[parentObjsArr.length-1];
        if(Array.isArray(lastObj)){ // 如果最后一个是数组
            propArr = [...propArr];
            propArr.pop();
        }
        const prop = (propArr.join(right + left) + right ).replace(right, '');
        paramArr.push(
            encodeURIComponent( prop.replace(/[ ]/g, '+') ) 
            + pair + 
            encodeURIComponent( typeof val === 'string' ? val.replace(/[ ]/g, '+') : val )  // 空格转为加号
        ); 
    });
  
    if (paramArr.length > 0) {
      return paramArr.join(separator);
    }
    return '';
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
//******************************* 将参数对象编码到url中 ******************************* */



