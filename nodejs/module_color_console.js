

//******************************* 在cmd控制台上有颜色的输出 *********************************************
/**
 * v1.0.0
 * 最后修改: 2019.7.17
 * 创建: 2019.7.6
 */
function initColorLog() {
    let { log, warn, error } = console;
    console.log = (...agrs) => { colorLog(null, ...agrs) };
    console.warn = (...agrs) => { colorLog('$yellow', ...agrs) };
    console.error = (...agrs) => { colorLog('$red', ...agrs) };

    let styles = {
        'bold': ['\x1B[1m', '\x1B[22m'],          // 粗体字
        'italic': ['\x1B[3m', '\x1B[23m'],        // 斜体字
        'underline': ['\x1B[4m', '\x1B[24m'],     // 下划线
        'inverse': ['\x1B[7m', '\x1B[27m'],       // 切换背景与前景色
        'strikethrough': ['\x1B[9m', '\x1B[29m'], //删除线

        'black': ['\x1B[30m', '\x1B[39m'], // 黑色
        'white': ['\x1B[37m', '\x1B[39m'], // 白色
        'grey': ['\x1B[90m', '\x1B[39m'],  // 灰色

        'red': ['\x1B[31m', '\x1B[39m'],   // 红色
        'green': ['\x1B[32m', '\x1B[39m'], // 绿色
        'blue': ['\x1B[34m', '\x1B[39m'],  // 蓝色

        'yellow': ['\x1B[33m', '\x1B[39m'],   // 黄色 =（红）+（绿）
        'magenta': ['\x1B[35m', '\x1B[39m'],  // 紫红色 洋红色 品红色 =（红）+（蓝）
        'cyan': ['\x1B[36m', '\x1B[39m'],     // 蓝绿色 青色  = （蓝）+（绿）

        'whiteBG': ['\x1B[47m', '\x1B[49m'],
        'greyBG': ['\x1B[49;5;8m', '\x1B[49m'],
        'blackBG': ['\x1B[40m', '\x1B[49m'],
        'blueBG': ['\x1B[44m', '\x1B[49m'],
        'cyanBG': ['\x1B[46m', '\x1B[49m'],
        'greenBG': ['\x1B[42m', '\x1B[49m'],
        'magentaBG': ['\x1B[45m', '\x1B[49m'],
        'redBG': ['\x1B[41m', '\x1B[49m'],
        'yellowBG': ['\x1B[43m', '\x1B[49m'],
    };
    function getStyleFlagReg() {
        let styleNames = [];
        for (let prop in styles) {
            styleNames.push(prop);
        };

        let str = '\\$(' + styleNames.join('|') + ')';
        return new RegExp(`^\\s*${str}(?:\\s*,\\s*${str})*\\s*$`);
    }

    let styleReg = getStyleFlagReg(); // 例如: /\$(red|green|blue)/

    /**
     * 插入
     * @param {Array<String>} regResultArr - 颜色数组 如 : ['red', 'greenBg']
     * @param {String} str - 要输出的字符串  
     * @returns {String} 添加颜色后的字符串
     * @example
     * 1. insertColorStr(['red', 'greenBg'], '小明');
     * // => '\x1B[31m \x1B[42m 小明 \x1B[49m \x1B[39m'
     */
    function insertColorStr(regResultArr, str) {
        if (!regResultArr) {
            return str;
        }
        let markStr = '__inner_20190704171233103__';
        let result = markStr;
        for (let i = 0, colorName; i < regResultArr.length; i++) {
            colorName = regResultArr[i];
            if (styles[colorName]) {
                result = result.replace(markStr, styles[colorName].join(markStr));
            }
        }
        return result.replace(markStr, str);
    }

    function colorLog(fixedColor, ...args) {
        let result = [];
        fixedColor = typeof fixedColor == 'string' ? fixedColor.match(styleReg) : null;
        for (let i = 0, val, regResultArr, lastRegResultArr = fixedColor; i < args.length; i++) {
            val = args[i];
            // regResultArr = ['red', 'greenBG']
            regResultArr = typeof val == 'string' ? val.match(styleReg) : null;
            if (regResultArr) {
                if (fixedColor) {
                    regResultArr.forEach(val => {
                        if (!fixedColor.includes(val)) {
                            regResultArr.unshift(val);
                        }
                    });
                }
                lastRegResultArr = regResultArr;
            } else {
                result.push(insertColorStr(lastRegResultArr, val));
            }
        }

        log(...result);
    }
};
//******************************* 在cmd控制台上有颜色的输出 *********************************************


