

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



/** 
 * 将中文的格式的数字每一位对应转换为阿拉伯数字。 是perNumToChinese(num)的逆操作。 
 * @public
 * @param {String} numStr 要操作的数字， 如: '三四'
 * @example
 * 1. perChineseToNum('三四');  // => 34
 * 2. perChineseToNum('四零四');  // => 404
 * 3. perChineseToNum('零零四');  // => 4
 * 4. perChineseToNum('  ');  // => NaN
 */
function perChineseToNum(numStr){
	return +numStr.replace(/[零一二三四五六七八九十\s]/g, (str, index)=>index);
}

/**
 * 按数字的位数将每一位数字转换为中文(注意，可以转换多位数字)
 * @public
 * @param {number|string} num - 要转换的数字
 * @example
 * 1. perNumToChinese(34);         // => '三四'
 * 2. perNumToChinese(3874);       // => '三八七四'
 * 3. perNumToChinese('3874');     // => '三八七四'
 * 4. perNumToChinese('404');      // => '四零四'
 * 5. perNumToChinese('0  04   '); // => '零零四'
 * 6. perNumToChinese('  ');       // => ''
*/
function perNumToChinese(num){
	return String(num).replace(/\s*/g, '').replace(/\d/g, (val)=>('零一二三四五六七八九')[val]);
}


/** 
 * 将中文的格式的数字转换为阿拉伯数字, 最多只能处理13位数(万亿)。 是 numToChinese(num) 函数的逆操作。
 * @public
 * @param {String} numStr 要操作的数字， 如: '十六'
 * @example
 * 1. chineseToNum('十六');             // => 16
 * 2. chineseToNum('一万九千九百零四');  // => 19904
 * 3. chineseToNum('十万零四百零四');    // => 100404
 * 4. chineseToNum('九十亿零二千零三万零四百零一');  // => 9020030401
 */
let chineseToNum = (function(){
	let perChineseToNum = function(numStr){
		return +numStr.replace(/[零一二三四五六七八九十\s]/g, (str, index)=>index);
	}
	let __SIZEPOW = {'十': 1, '百': 2, '千': 3, '万': 4, '亿': 8};
	let chineseToNum = function(numStr){   //目前只能处理万亿以下的数据
	    if(numStr.length === 1){
	        return perChineseToNum(numStr);
	    }
	    if(numStr.length === 2 && numStr[0] === '十'){
	        return perChineseToNum(numStr[1]) + 10;
	    }
	
	    let arr;
	    if(!/[亿万]/.test(numStr)){    //亿以下或万以下
	        arr = numStr.split('零'); 
	        let num = 0, val = 0;
	        for(let i=0, str=''; i<arr.length; i++){
	            str = arr[i];
	            for(let j=0; j<str.length; j++){
	                if(/[一二三四五六七八九]/.test(str[j])){
	                    num += val;
	                    val = 1;
	                    val *= perChineseToNum(str[j]);
	                }else{
	                    val *= Math.pow(10, __SIZEPOW[str[j]] )
	                }
	            }
	        }
	        num += val;
	        return num;
	    }else{
	        arr = numStr.split('亿');
	        if(arr.length > 1){  //亿以上
	            var arr1 = arr[1].split('万');
	            return chineseToNum(arr[0])*Math.pow(10, 8) + chineseToNum(arr1[0])*10000 + chineseToNum(arr1[1]);
	        }else{  //亿以下
	            return chineseToNum(arr[0])*Math.pow(10, 8) + chineseToNum(arr[1]);
	        }
	    }
	}
	return chineseToNum;
})();


/**
* 将阿拉伯数字转换为对应的汉字, 最多只能处理13位数(万亿)。
* @public
* @param {number} num - 要转换的数字
* @example
* 1. numToChinese(0);  // => '零'
* 2. numToChinese(5);  // => '五' 
* 3. numToChinese(16);  // => '十六'
* 4. numToChinese(34);  // => '三十四' 
* 5. numToChinese(106);  // => '一百零六' 
* 6. numToChinese(9020030401);  // => '九十亿零二千零三万零四百零一' 
* 7. numToChinese(9000000000000);  // => '九万亿' 
* 8. numToChinese(90000000000000);  // => 'undefined' 
*/
let numToChinese = (function(){
	let __CHINANUM =  '零一二三四五六七八九十'; 
	let __WEIARR =', 十, 百, 千, 万, 十万, 百万, 千万, 亿, 十亿, 百亿, 千亿, 万亿, 十万亿, 百万亿, 千万亿, 亿亿, 十亿亿, 百亿亿, 千亿亿, 万亿亿'.split(', ');
	
	let numToChinese = function (num){
	    let numStr = '' + num;
	    let len = numStr.length, result;
	    if(num <= 10){ //处理0~9
	        return __CHINANUM[num]; 
	    }else if(num < 20){ //处理10~20
	        return '十' + __CHINANUM[numStr[1]]; 
	    }else if(len < 6){ //处理5位数(万)及以下
	        let lastStr, resultStr = '', index;
	        for(let i=0; i<len; i++){
	            lastStr = __CHINANUM[numStr[i]];
	            if(numStr[i] === '0'){
	                index = null;
	                for(let j=i+1; j<len; j++){
	                    if( numStr[j] !== '0' ){
	                        index = j - 1;
	                        break;
	                    }
	                }
	                if(index === null){
	                    break;
	                }else{
	                    i = index;
	                    resultStr += '零';
	                }
	            }else{
	                resultStr += ( lastStr + __WEIARR[len - i - 1] );
	            }
	        }
	        return resultStr;
	    }else if(len < 9){ //处理8位数(千万)及以下
	        let low4Str = numStr.slice(-4), heigh4Str = numStr.slice(0, -4), isZero = '';
	        isZero = heigh4Str.slice(-1) === '0' ? '零' : ''; //必须用这个，如504000，应该是 五十万零四千 而不是 五十万四千
	        if(isZero){
	            low4Str = +low4Str;
	            if(low4Str === 0){
	                isZero = '';
	            }
	        }
	        if(+heigh4Str !== 0){
	            isZero = '万' + isZero;
	        }
	        result = numToChinese( +heigh4Str ) + isZero  + numToChinese( +low4Str );
	        return result.slice(-1) === '零' ? result.slice(0, -1) : result;
	
	    }else if(len < 14){ //处理13位数(万亿)及以下
	        let low8Str = numStr.slice(-8), heigh4Str = numStr.slice(0, -8),  isZero = '';
	        isZero = heigh4Str.slice(-1) === '0' ? '零' : ''; //必须用这个
	        if(isZero){
	            low8Str = +low8Str;
	            if(low8Str === 0){
	                isZero = '';
	            }
	        }
	        if(+heigh4Str !== 0){
	            isZero = '亿' + isZero;
	        }
	        result = numToChinese( +heigh4Str ) + isZero  + numToChinese( +low8Str );
	        return result.slice(-1) === '零' ? result.slice(0, -1) : result;
	    }
	}
	return numToChinese;
})();









