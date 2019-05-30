
"use strict";

/**
 * 与数组相关的常用函数
 */
// export default 
window.
arr = {

    /**
     * 生成一个随机数数组，数组的元素取值 [min, max)
     * 
     * @param {number} [length=0] - 数组的长度
     * @param {number} [min=0] - 随机数的最小值
     * @param {number} [max=1] - 随机数的最大值
     * @returns  Array  - 一个新的随机数组
     * @example
     * 
     * 1. generateRandom(4);   //生成 [0,1)的随机数组
     * // => [0.907440631863677, 0.9179344191798724, 0.6084427360446603, 0.4955541137302315]
     * 
     * 2. generateRandom(4, 3); //生成 [3, 1) 的随机数组
     * // => [2.8843671806078723, 1.576131569769967, 2.0709581783787474, 1.407648076583225]
     * 
     * 3. generateRandom(4, 3, 10); //生成 [3, 10) 的随机数组
     * // => [8.203333050028927, 5.46812783865793, 4.296903604936294, 6.737924681142783]
     * 
     */
    generateRandom(length = 0, min = 0, max = 1){  //生成一个随机数组
        const arr = [], space = max - min;
        for(let i=0; i<length; i++){
            arr[i] = Math.random()*space + min;
        }
        return arr;
    },

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
    normalize(arr){ //规范化一个数组，规范化之后，所有数组的值的和为1
        let result;
        if(arr instanceof Array){
            const sum = arr.reduce((total,val)=>{
                if(typeof val !== 'number'){
                    throw Error('数组元素: '+ val + '不是数值类型');
                }
                return total+val;
            }, 0); //数组的和
            result = arr.map(val=>val/sum);
        }else{
            result = [];
        }
        return result;
    },

    /**
     * 求数组的和
     * 如果参数是非数值，或元素不为数值，则直接忽略这个值。
     * 
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
    sum(...values){
        let allTotal = 0;
        values.forEach(val=>{
            if(val instanceof Array){
                allTotal += val.reduce((total,val)=>typeof val === 'number' ? total+val : total, 0);
            }else if(typeof val === 'number' ){
                allTotal += val;
            }
        });
        return allTotal;
    }

}
