

//*************************************** ajax模块 ********************************** */
/**
 * v1.0.0
 * 最后修改: 2019.7.19
 * 创建: 2019.7.19
 * 依赖: encodeUrlParam 函数
 */
function ajax({
    url = '',          // 请求地址
    method = 'POST',   // 请求方式 'POST' 'GET'
    data = null,       // 要发送的数据
    timeout = 0,       // 超时时间ms 如果等于0，表示没有时间限制
    addRandom = true,  // 是否在url后面添加 random=0.33389293739 这样的随机数
    async = true,      // 默认为异步
    username = '',     // 用户名 
    password = '',     // 密码
    header = {'Content-Type': 'application/x-www-form-urlencoded'},  // 请求头
    complete = null,            // 执行的结果的回调，回调这个函数就说明，要么成功了，要么就失败了。当不设置这个回调时，则返回一个promise对象。
    keyStepFunc = null,         // 关键步骤处的回调 返回 false 可以取消本次请求
    get_convertFunc = null,     // 要发送的数据的转换函数(转换后数据拼接到url中)，不设置时默认直接使用 encodeUrlParam 函数 转。
    post_convertFunc = null,    // 要发送的数据的转换函数(转换后数据放到请求体中)，不设置时默认直接使用 JSON.stringify 转。
    receive_convertFunc = null, // 收到数据时的转换函数，不设置时默认直接使用 JSON.parse 转。
} = {}){
    const ajaxFunc = ()=>{
        method = ('' + method).toUpperCase(); 

        const options = {
            addRandom, async, method, header, timeout, data, url, username, password, 
            complete, keyStepFunc, post_convertFunc, get_convertFunc, receive_convertFunc
        };

        if( ! ajax_createXmlHttp(options) ){ // 创建xmlHttp对象，失败就返回
            return;
        }

        if( ! keyStep(xmlHttp, options, {desc: '创建xmlHttp对象成功！', type: 'createXmlHttp suc'}) ) { // xmlHttp对象创建成功
            return;
        }

        ajax_setHeader(xmlHttp, options);  // 设置请求头
        ajax_setTimeout(xmlHttp, options);  // 设置请求的超时处理
        
        if(async){  //只有异步时，才需要注册接收的事件
            xmlHttp.onreadystatechange = ()=>{
                /*readyState的取值
                    值	 状态	               描述
                    0	UNSENT (未打开)	   未初始化。open()方法还未被调用.
                    1	OPENED  (未发送)   open()方法已经被调用，但尚未调用send()方法
            
                    2	HEADERS_RECEIVED (已获取响应头)	send()方法已经被调用, 响应头和响应状态已经返回.
                    3	LOADING (正在下载响应体)	    响应体下载中; responseText中已经获取了部分数据.
                    4	DONE (请求完成)	整个请求过程已经完毕.已经接收到全部响应数据，而且已经可以在客户端使用了.
                */
                if (xmlHttp.readyState == 4 ) {
                    ajax_finish(xmlHttp, options);
                }
            }
        }
        
        if( ! ajax_open(xmlHttp, options) ){ // 打开失败(xmlHttp.open)就返回
            return;
        }

        if( ! keyStep(xmlHttp, options, {desc: 'xmlHttp open 成功！', type: 'open suc'}) ) { // 打开成功
            return;
        }

        if( ! ajax_send(xmlHttp, options) ){ // 发送失败(xmlHttp.send)就返回
            return;
        }

        if( ! keyStep(xmlHttp, options, {desc: 'xmlHttp send 成功！', type: 'send suc'}) ) { // 发送成功
            xmlHttp.abort(); //因为数据已经发送出去了，所以要终止请求
            return;
        }
        
        if(!async){   //如果是同步，就直接完成
            ajax_finish(xmlHttp, options);
        }
    }

    return ajax_start(ajaxFunc, complete); // 开始执行代码
}

function ajax_start(ajaxFunc, complete){ // 开始执行代码
    if(typeof complete === 'function'){
        return ajaxFunc();
    }else{
        return new Promise((resolve, reject)=>{
            complete = (result)=>{
                result.err ? reject(result) : resolve(result);
            };
            ajaxFunc();
        }); 
    }
}

function ajax_getXmlHttp(){ // 获取ajax对象
    let xmlHttp = null;
    if(XMLHttpRequest){
        xmlHttp = new XMLHttpRequest();
    }else if(ActiveXObject){
        xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
    }
    return xmlHttp;
}

function ajax_createXmlHttp(options){ // 创建 xmlHttp 对象
    const {complete} = options;
    let xmlHttp;
    try{  // 可能不存在window对象，所以必须try
        xmlHttp = ajax_getXmlHttp();
        if(!xmlHttp){
            typeof complete === 'function' 
            && complete({desc: '获取xmlHttp对象失败！', err: {}, type: 'get xmlHttp fail', xmlHttp: xmlHttp, options: options}); 
            return xmlHttp;
        }
    }catch(e){
        typeof complete === 'function' 
        && complete({desc: '创建xmlHttp对象报错！', err: e, type: 'create xmlHttp fail', xmlHttp: xmlHttp, options: options}); 
        return xmlHttp;
    }
    return xmlHttp;
}

function ajax_setHeader(xmlHttp, options){ // 设置请求头
    const {header} = options;
    if(header && typeof header === 'object'){
        for(let prop in header){
            xmlHttp.setRequestHeader(prop, header[prop]);
        }
    }
}

function ajax_setTimeout(xmlHttp, options){  // 超时设置
    const {timeout, complete} = options;
    //XHR对象的timeout属性等于一个整数，表示多少毫秒后，如果请求仍然没有得到结果，就会自动终止。该属性默认等于0，表示没有时间限制
    //如果请求超时，将触发ontimeout事件
    xmlHttp.timeout = timeout;
    xmlHttp.ontimeout = ()=> {
        typeof complete === 'function' 
        && complete({desc: '请求超时！', err: {}, type: 'timeout fail', xmlHttp: xmlHttp, options: options}); 
    }
}

function ajax_addDataToUrl(xmlHttp, options){ // 将数据拼接到url中
    const dataStrArr = [], {url, method, data, addRandom, get_convertFunc} = options;
    addRandom && dataStrArr.push('rand=' + Math.random());  // 添加随机数
    if (method === 'GET') { // 添加要传送的数
        dataStrArr = typeof get_convertFunc === 'function' ? get_convertFunc(xmlHttp, options) : encodeUrlParam(data); 
        dataStrArr && dataStrArr.push(dataStrArr); 
    }
    const urlDataStr = dataStrArr.join('&');
    const dataUrl = url + (urlDataStr ? '?' + urlDataStr : '');
    return encodeURI(dataUrl);
}

function keyStep(xmlHttp, options, descObj){ // 请求过程中的关键步骤处的回调
    const {keyStepFunc} = options;
    if(typeof keyStepFunc === 'function' ){
        descObj.xmlHttp = xmlHttp;
        descObj.options = options;
        const result = keyStepFunc(descObj);
        if(result === false){
            return false;  // 返回 false 表示取消本次请求
        }
    }
    return true;
}

function ajax_open(xmlHttp, options){ // 打开连接
    const url_data = ajax_addDataToUrl(xmlHttp, options); // 将相关数据拼接到url中

    //如果请求一个受密码保护的URL，把用于认证的用户名和密码作为第4和第5个参数传递给open()方法。默认参数为空string.
    //注意，如果传入open方法的url的格式不正确，会报错
    const {complete, method, async, username, password} = options;
    try{
        xmlHttp.open(method, url_data, async, username, password);
    }catch(e){
        typeof complete === 'function' 
        && complete({desc: 'xmlHttp打开报错！', err: e, type: 'open fail', xmlHttp: xmlHttp, options: options}); 
        return false;
    }
    return true;
}

function ajax_send(xmlHttp, options){ // 发送请求体
    const {data, complete, post_convertFunc, method} = options;
    let dataStr = null;
    if(method === 'POST'){
        try{
            // json 转换有可能报错，比如 data 中有循环引用
            dataStr = typeof post_convertFunc === 'function' ? post_convertFunc(data) : JSON.stringify(data)
        }catch(e){
            typeof complete === 'function' 
            && complete({desc: '转换发送的数据报错！', err: e, type: 'sendData convert fail', xmlHttp: xmlHttp, options: options}); 
            return false;
        }
    }
    
    //发送请求. 如果该请求是异步模式(默认),该方法会立刻返回. 相反,如果请求是同步模式,则直到请求的响应完全接受以后,该方法才会返回.
    //注意: 所有相关的事件绑定必须在调用send()方法之前进行.
    xmlHttp.send(dataStr);
    return true;
}

function ajax_finish(xmlHttp, options){ // 收到数据
    //状态码为304表示请求的资源并没有被修改，可以直接使用浏览器中缓存的版本
    if (xmlHttp.status >= 200 && xmlHttp.status < 300 || xmlHttp.status == 304) {
        /*
            responseText: 作为响应主体被返回的文本(文本形式)。无论内容类型是什么，
                        响应主体的内容都会保存到responseText属性中，而对于非XML数据而言，responseXML属性的值将为null
            responseXML: 如果响应的内容类型是'text/xml'或'application/xml'，这个属性中将保存着响应数据的XML DOM文档(document形式)
            status: HTTP状态码(数字形式)
            statusText: HTTP状态说明(文本形式)
        */
        // cc.log("http res("+ xmlHttp.responseText.length + "):" + xmlHttp.responseText);
        // let grc=xmlHttp.getResponseHeader("Content-Type");
        //application/json;charset=UTF-8 -- json数据
        //application/javascript;charset=UTF-8 -- javascript代码
        //image/png -- png图片
        
        const dataStr = xmlHttp.responseText, {receive_convertFunc} = options;;
        let data;
        try{
            data = typeof receive_convertFunc === 'function' ? receive_convertFunc(xmlHttp, options) : JSON.parse(dataStr);
        }catch(e){
            typeof complete === 'function' 
            && complete({desc: '收到的数据转换错误！', err: e, type: 'receive convert fail', xmlHttp: xmlHttp, options: options}); 
            return;
        }
        typeof complete === 'function' 
        && complete({desc: '成功收到数据！', err: null, type: 'suc', data: data, xmlHttp: xmlHttp, options: options}); 
    } else {
        typeof complete === 'function' 
        && complete({desc: '网络或服务器错误！', err: {status: xmlHttp.status, statusText: xmlHttp.statusText}, 
        type: 'receive status fail', xmlHttp: xmlHttp, options: options}); 
    }
}
//*************************************** ajax模块 ********************************** */


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
    treeObject(params, {leafCallback: (propArr, val, parentObjsArr)=>{
        if(typeof val === 'function'){
            return;
        }
        console.log(propArr);
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
    }});
  
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