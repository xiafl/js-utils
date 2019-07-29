

/**
 * 获取指定元素的样式
 * 注意:  
 * 1. 必须在使用这个函数的文件中 导入 import Vue from 'vue'  
 * 2. 自定义组件编译模式（默认模式）时, 必须传入component参数。(h5中测试时不管传不传都能正常获取，但wx中必须传入才行)
 * @public
 * @param {Object|string} options - 配置对象，如果传入一个字符串，则识别为selector
 *                         selector - dom元素的选择器，仅支持以下选择器: 
 * 							1. ID选择器：'#the-id'
                            2. class选择器（可以连续指定多个）：'.a-class.another-class'
                            3. 子元素选择器：'.the-parent > .the-child'
                            4. 后代选择器：'.the-ancestor .the-descendant'
                            5. 跨自定义组件的后代选择器：'.the-ancestor >>> .the-descendant'
                            6. 多选择器的并集：'#a-node, .some-other-nodes'
                            7. 传入 'viewport' 表示获取视口对象，有点类似于选中window。
* @param {function|component} [callback=null] - 如果传入一个函数，则识别为获取到样式后的回调，也可以传入一个组件, 
        回调的第一个参数如下:   
        // 获取信息成功时，是对象数组,  
        // 对象根据options的配置而有不同的字段  
        {  
            id: '',         // String 节点的 ID, 经测试，这个id并不一定正确(特别是选中多个节点时)  
            dataset: null,  // Object 节点的 dataset  
            left: 0,        // Number 节点的包围盒的左边界坐标(px)(page元素的左上角为坐标原点)  
            right: 0,       // Number 节点的包围盒的右边界坐标(px)  
            top: 0,         // Number 节点的包围盒的上边界坐标(px)  
            bottom: 0,      // Number 节点的包围盒的下边界坐标(px)  
            width: 0,       // Number 节点的宽度(px)  
            height: 0,      // Number 节点的高度(px)  
            scrollLeft: 0,  // Number 节点的水平滚动位置(px)  
            scrollTop: 0,   // Number 节点的竖直滚动位置(px)  
            context: {} || null,   // Object节点对应的Context对象(如VideoContext、CanvasContext、和MapContext)  
            ...        // properties 数组中指定的属性值和computedStyle数组中指定的样式值  
        }  
        // 当获取信息失败，则为null  
* @param {any} [thisObj=null] 回调中的this, 可能位于第三个参数或第四个参数。
* @return {undefined|promise} 当没有callback时，则返回promise，否则返回undefined  
* @example
* 1. 传入选择器，返回promise
* getNodeInfo('#aa').then((data)=>{ console.log(data);});
* 
* 2. 传入选择器和component, 返回promise
* getNodeInfo('#aa', this).then((data)=>{ console.log(data);});
* 
* 3. 传入选择器和callback, 返回undefined
* getNodeInfo('#aa', (data)=>{ console.log(data);});
* 
* 4. 传入配置对象和callback, 返回undefined
* getNodeInfo({selector: '#aa', component: this}, (data)=>{ console.log(data);});
*/
function getNodeInfo({
    selector = 'selector', // 选择器
    component = null, // 选择器所在的组件，不传入的话，相当于是在整个当前页面中选择
    attemptSpaceTime = 16,  // 尝试获取节点信息的时间间隔(ms): 16 24 36 54 81 122 183 275 413 
    attemptSpaceRate = 1.5, // 时间间隔的增长系数
    totalAttemptNum = 8,    // 如果获取信息失败，再次进行尝试获的最大次数
    // 以下为获取到的结果字段的配置
    id = true,        // Boolean	是否返回节点 id	
    dataset = true,   // Boolean	是否返回节点 dataset	
    rect = true,      // Boolean	是否返回节点布局位置（left right top bottom）	
    size = true,      // Boolean 是否返回节点尺寸（width height）	
    scrollOffset = true, //Boolean 是否返回节点的 scrollLeft scrollTop
    // 以下三个 仅 App 和微信小程序支持
    properties = [],  // Array＜string＞ 指定属性名列表，返回节点对应属性名的当前属性值   
                        // 只能获得组件文档中标注的常规属性值，
                        // id class style 和事件绑定的属性值不可获取
    computedStyle = [],  //Array＜string＞指定样式名列表，返回节点对应样式名的当前值
    context = true,  // Boolean 是否返回节点对应的 Context 对象	
} = {}, callback = null, thisObj = null){
    // arguments 始终会记录最原始的传进来的参数，而不管这些默认值会怎么转换
    // 因为传入一个对象或非字符串会报错，强制转换为字符串
    const args = arguments;
    selector = typeof args[0] === 'string' ? args[0] : String(selector);
    if(typeof args[1] !== 'function'){
        component = args[1]; callback = args[2]; thisObj = args[3];
    }
    !component instanceof Vue && (component = null);  //传入非组件对象，会报错
    
    // 不能把 component 字符添加到这个对象上，否则在wx中会报循环引用的错误
    const options = { selector, attemptSpaceTime, totalAttemptNum, attemptSpaceRate,
    id, dataset, rect, size, scrollOffset, properties, computedStyle, context };
    
    const selectorQuery = uni.createSelectorQuery();
    component && selectorQuery.in(component);
    const nodesRef = selector === 'viewport' ? selectorQuery.selectViewport() : selectorQuery.selectAll(selector);
    nodesRef.fields(options); // 注意，只注册了这一个命令

    let result; // 必须把创建promise的代码放在前面，否则在h5端会出现exec先执行完成的情况
    if(typeof callback !== 'function'){
        result =  new Promise(resolve=>callback = resolve);
    }
    stepRunFunc((next, currNum)=>{
        selectorQuery.exec( ([data]) => { // 开始查询页面中的节点
            data && data.length === 0 && (data = null);
            data || totalAttemptNum <= currNum ? typeof callback === 'function' && callback.call(thisObj, data) : next(attemptSpaceTime);
            attemptSpaceTime = Math.round( attemptSpaceTime * attemptSpaceRate );
        });
    })(); // 立即执行一次
    
    return result;
}

