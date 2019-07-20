


/**
 * 判断一个字符串或正则是否是匹配一个文件(不是文件的话就是目录)
 * 注意，结果不一定完全正确，因为'aa.mp3' 也可以是一个文件夹
 * @param {string|RegExp} val - 要判断的字符串或正则
 * @returns {boolean} 
 * @example
 * 1. isMathFile('.mp3');  // => true
 * 2. isMathFile(/\.mp3/ig);  // => true
 * 3. isMathFile(/mp3\/aa/ig);  // => false
 * 4. isMathFile('aaa/bb/cc');  // => false
 * 5. isMathFile(/[abc]{2}\.(mp3|js)/);  // => true
 */
function isMathFile(val) {
    let isFile = false, str = val;
    if (val instanceof RegExp) { // 因为使用正则来匹配文件的方式写法很多，这里只是简单的进行判断
        // /aa/ig.toString(); ==> "/aa/gi"
        str = val.toString().replace(/(^\/)|(\/[iIgGmM]{0,3}$)/g, ''); // 去掉头尾的斜杠   "/.*\.jpg/" ==> ".*\.jpg"
        // 注意，这种判断并不是特别准确
        isFile = /\\\.[^\n\\\/\.]+\$/.test(str);   // 以 \.xxx 这种结尾

    } else {
        isFile = /\.[^\n\\\/\.]*\s*$/.test(str);  // 以 .xxx 这种结尾
    }
    return isFile;
}


/**
 * 转换规则的格式, 返回新的规则数组，不改变原数组
 * @public
 * @param {Array} rulesArr - 规则的原始数组
 * @param {Object} obj.before - 转换之前 before(val) 
 *                              返回 false表示忽略本条规则， 返回字符串或正则 表示使用这个值替换原来的值
 * @param {Object} obj.after - 转换之后 after(newVal, val)
 *                              返回 false表示忽略本条规则， 返回非空值 表示使用这个值替换原来的值
 * @returns {Array} 转换后的规则数组
 * @example
 * 1. formatRules([/aaa\/bb.mp4/ig, 'aaa.mp3', '** /bb.js', '?c.js']);
 * // => [/aaa\/bb.mp4/ig, 'aaa.mp3', /^[^\n\\\/]*\/bb\.js$/ig, /^[^\n\\\/]c\.js$/ig ]
 */
function formatRules(rulesArr, { before = null, after = null }) {
    let arr = [];
    if (!Array.isArray(rulesArr)) {
        return arr;
    }
    rulesArr.forEach(val => {
        let newVal = val;

        if (typeof before === 'function') {
            let result = before(val);
            if (result === false) {
                return;
            } else if (typeof result === 'string' || result instanceof RegExp) {
                val = newVal;
                newVal = result;
            }
        }

        newVal = specialSignToReg(newVal, 'ig');

        if (typeof after === 'function') {
            let result = after(newVal, val);
            if (result === false) {
                return;
            } else if (result) {
                newVal = result;
            }
        }
        arr.push(newVal);
    });
    return arr;
}

/**
 * 如果字符串中有特殊字符 * ?，则将其转换为正则表达式
 * 转换的方式为: 
 * 1. 默认只处理其中的字符串，不会处理正则表达式
 * 2. 字符串中的两个\*号表示除了/\之外的其它任意个字符 一个\*号表示任意数量的字符
 * 3. 一个?号表示 除了/\之外的其它单个字符
 * 4. 只要含有星号或问题，则表示忽略大小写
 * @public
 * @param {any} value - 要转换的字符串
 * @param {boolean} isIgnore - 创建的正则表达式是否忽略大小写
 * @example
 * 1. specialSignToReg('*.mp3');
 * // => /[^\\n]*\.mp3/ig
 * 
 * 2. specialSignToReg('aa/bb?c/**.mp3');
 * // => /aa/bb[^\\n]c\/\.mp3/ig
 */
function specialSignToReg(value, mark = '') {
    if (typeof value === 'string') { //只处理字符串
        let isReg = false;
        if (value.includes('*')) {
            isReg = true;
            value = value.replace('**', '[^\\n\\\\\/]*').replace('*', '[^\\n]*')
        }
        if (value.includes('?')) {
            isReg = true;
            value = value.replace('?', '[^\\n\\\\\/]');
        }

        if (isReg) {
            value = value.replace('.', '\\.').replace('/', '\\/').replace('\\', '\\\\');
            value = new RegExp(`^${value}$`, mark ? mark : 'g');
        }
    }
    return value;
}


/**
 * 测试指定值否在某个规则集中
 * @public
 * @param {String} testVal  - 要测试的值
 * @param {Array} [rulesArr=null] - 规则数组 
 *                                  [
 *                                      {rule: 'aa.js'}, //如果是一个普通对象，则取其rule作为规则
 *                                      function(){retrun 'aa.js';}, //如果是一个函数，则取其返回值作为规则
 *                                      'aa.js',    //普通的字符串，使用全等进行比较
 *                                      /aa\.js/ig, //使用正则进行测试
 *                                      undefined, //如果是undefined，则表示没有规则，立即通过本项测试
 *                                  ]
 * @param {String} [type='some'] - 测试的类型 
 *  'some': 只要指定的值满足其中的一条规则就算满足, 一旦满足就不再检测其它规则了 
 *  'every':  指定的值必须满足其中所有规则才算满足
 * @returns {Boolean|null} 布尔值表示在或不在，null表示未知
 */
function isMatchRule(testVal, rulesArr = null, type = 'some') {
    if (!Array.isArray(rulesArr) || rulesArr.length === 0) {
        return null;
    }
    return rulesArr[type](
        val => {
            if (val === undefined) {
                return true;
            } else {
                if (typeof val === 'object' && !(val instanceof RegExp)) {
                    val = val.rule;
                } else if (typeof val === 'function') {
                    val = val();
                }
                if (val === undefined) {
                    return true;
                }
                return val instanceof RegExp ? val.test(testVal) : testVal === val;
            }
        }
    );
}



