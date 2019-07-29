


/**
 * 产生一个指定范围的随机整数。
 * @public
 * @param {number} start - 开始的数，产生的随机数大于等于这个数向下取整的值。
 * @param {number} end - 结束的数，产生的随机数小于等于这个数向下取整的值。
 * @returns {number} 产生的随机整数。
 * @example
 *     1. randomInt(1, 3); //结果:  1<= result <=3
 *    2. randomInt(1.4, 3.8); //结果:  1<= result <=3
 *    3. randomInt(-1.4, 3.8); //结果:  -2<= result <=3
 *    4. randomInt(-11.4, -3.8); //结果:  -12<= result <=-4
 */
function randomInt(start, end){
    if(start > end){
        let temp = start; 
        start = end; end = temp;
    }
    start = Math.floor(start); end = Math.floor(end);
    return Math.floor( Math.random()*(end-start + 1) + start );
}

/**
 * 产生一个指定范围的随机小数。
 * @public
 * @param {number} start - 开始的数，产生的随机数大于等于这个数。
 * @param {number} end - 结束的数，产生的随机数小于这个数。
 * @param {number} precision - 指定结果的精度，这个精度必须大于 start 和 end 的精度。不指定则默认为16位。
 * @returns {number} 产生的随机小数。
 * @example
 *     //结果: 1.2<= result <3.5 并且result为16位小数
 *    1. randomInt(1.2, 3.5);
 *    //结果:  1.4<= result <3.8 并且result为16位小数
 *   2. randomInt(1.4, 3.8); 
 *    //结果:  -1.4<= result <3.8 并且result为16位小数
 *    3. randomInt(-1.4, 3.8); 
 *    //结果:  -11.4<= result <-3.8 并且result为16位小数
 *   4. randomInt(-11.4, -3.8); 
 *    //结果:  -11.4<= result <-3.8 并且result为4位小数
 *    5. randomInt(-11.4, -3.8, 4); 
 *    //结果:  -11<= result <=-4 并且result为整数，但是精度太小，这样的话，就有可能超出指定范围，会抛出异常
 *    6. randomInt(-11.4, -3.8, 0); 
 */
function   randomFloat(start, end, precision){
    if(start > end){
        let temp = start; 
        start = end; end = temp;
    }
    let result;
    for(let i=0; i<20; i++){ //最多尝试20次
        result = Math.random()*(end-start) + start;
        if(precision !== undefined){
            result = +result.toFixed( precision );
            if( result >= start && result < end){ //如果符合要求
                return result;
            }
        }else{
            return result;
        }
    }
    throw Error('randomFloat 出错了, 传入的precision的值太小 (' + start + ',' + end + ') :' + precision);
}

/**
 * 产生一个指定范围的随机小数或整数。
 * @public
 * @param {number} start - 开始的数，产生的随机数大于等于这个数。
 * @param {number} end - 结束的数，产生的随机数小于等于这个数。
 * @param {number} [precision] - 指定精度，会自动将precision与start、end的精度进行对比，最终取精度最大的那个。
 * @returns {string} 指定范围的随机小数或整数。
 * @example
    1. randomInt(1.2, 3.5); //结果：  '1.2'<= result <='3.5' 并且result为一位小数
    2. randomInt(1, 3.8); //结果：  '1.0<= result <='3.8' 并且result为一位小数
    3. randomInt(-1.4, 3.899); //结果： '-1.400'<= result <='3.899' 并且result为三位小数
    4. randomInt(-11.4, -3.8); //结果：  '-11.4'<= result <='-3.8' 并且result为一位小数
    5. randomInt(-5, 20); //结果：  '-5'<= result <='20' 并且result为整数
    6. randomInt(-5, 20, 5); //结果：  '-5.00000'<= result <='20.00000' 并且result为5位小数
    */
function random(start = 0, end = 1, precision = 0){
    if(start > end){
        let temp = start; 
        start = end; end = temp;
    }

    let result = Math.random()*(end-start) + start;

    let startArr = ('' + start).split('.')[1];
    let startL = startArr ? startArr.length : 0;

    let endArr = ('' + end).split('.')[1];
    let endL = endArr ? endArr.length : 0;

    let len = startL > endL ? startL : endL;

    if(precision !== undefined){
        return result.toFixed( len > precision ? len : precision );
    }else{
        return result.toFixed(len);
    }
}



/**
 * 全局唯一标识符（GUID，Globally Unique Identifier）也称作 UUID(Universally Unique IDentifier) 。
 * GUID是一种由算法生成的二进制长度为128位的数字标识符。GUID 的格式为“xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx”，
 * 其中的 x 是 0-9 或 a-f 范围内的一个32位十六进制数。在理想情况下，任何计算机和计算机集群都不会生成两个相同的GUID。
 * GUID 的总数达到了2^128（3.4×10^38）个，所以随机生成两个相同GUID的可能性非常小，但并不为0.
 * @public
 * @returns {string} 不同的随机字符串, 如 "07104187-5c1e-4495-8cfd-c15e2af3eafb"
 */
function generateUUID(linkSign = '-') {
	let d = new Date().getTime();
	const uuid = `xxxxxxxx${linkSign}xxxx${linkSign}4xxx${linkSign}yxxx${linkSign}xxxxxxxxxxxx`.replace(/[xy]/g, function(c) {
		const r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	});
	return uuid;
}
