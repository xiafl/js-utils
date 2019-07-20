


/**
 * 向量加法, 返回一个新的向量，不会改变原向量
 * @public
 * @param {Array<number>} arr - 第一个加数
 * @param  {...Array<number>} arrs - 其它的加数
 * @returns {Array<number>} 加法的结果，以第一个加数为基准。
 */
function vec_add(arr, ...arrs){
    return arr.map((val,index)=>{
        arrs.forEach(a=>val = (+val) + (+a[index]) );
        return val;
    });
}


/**
 * 向量减法, 返回一个新的向量，不会改变原向量
 * @public
 * @param {Array<number>} arr - 第一个被减数
 * @param  {...Array<number>} arrs - 其它的减数
 * @returns {Array<number>} 减法的结果，以第一个减数为基准。
 */
function vec_sub(arr, ...arrs){
    return arr.map((val,index)=>{
        arrs.forEach(a=>val = (+val) - (+a[index]) );
        return val;
    });
}

/**
 * 向量数乘, 返回一个新的向量，不会改变原向量
 * @public
 * @param {Array<number>} arr - 被乘的向量
 * @param  {...number} nums - 其它的乘数
 * @returns {Array<number>} 数乘的结果
 */
function vec_mul(arr, ...nums){ //向量数乘
    const num = nums.reduce((total, val)=>total*=val, 1);
    return arr.map(val=>val*num);
}

/**
 * 向量数除, 返回一个新的向量，不会改变原向量
 * @public
 * @param {Array<number>} arr - 被除的向量
 * @param  {number} num - 除数
 * @returns {Array<number>} 结果
 */
function vec_div(arr, num){ //向量除
    const num = nums.reduce((total, val)=>total/=val, 1);
    return arr.map(val=>val*num);
}

/**
 * 向量取反, 返回一个新的向量，不会改变原向量
 * @public
 * @param {Array<number>} arr - 原向量
 * @returns {Array<number>} 结果
 */
function vec_neg(arr){ //向量取反
    return arr.map(val=>-val);
}

/**
 * 向量的模, 不会改变原向量
 * @public
 * @param {Array<number>} arr - 原向量
 * @returns {number} 模的大小
 */
function vec_mag(arr){ //向量的模
    return Math.sqrt( arr.reduce((total,val)=>total+=val*val, 0) );
}

/**
 * 向量的模的平方, 不会改变原向量
 * @public
 * @param {Array<number>} arr - 原向量
 * @returns {number} 向量的模的平方
 */
function vec_magSqr(arr){ //向量的模的平方
    return arr.reduce((total,val)=>total+=val*val, 0);
}

/*
叉乘是专门针对三维向量的
大小: |a|·|b|·sin<a,b>
方向: 右手定则：若坐标系是满足右手定则的，设z=x×y,|z|=|x||y|*sin<x,y>；则x,y,z构成右手系，  
伸开右手手掌，四个手指从x轴正方向方向转到y轴正方面，则大拇指方向即为z正轴方向。(iXj=k)  
a = [a1, a2, a3]
b = [b1, b2, b3]
a X b = 
i  j  k
a1 a2 a3
b1 b2 b3
*/
function vec_cross(arr1, arr2){ //向量的叉乘
    return arr1;
}

/**
 * 向量的归一化, 不会改变原向量
 * @public
 * @param {Array<number>} arr - 原向量
 * @returns {number} 归一化后的向量
 */
function vec_normalize(arr){ //向量的归一化，让这个向量的长度为 1。
    const mLen = Math.sqrt( arr.reduce((total,val)=>total+=val*val, 0) ); // 模
    return arr.map(val=>val/mLen);
}

function vec_angle(arr){ //夹角的弧度。
    return 0;
}

/**
 * 当前向量与指定向量进行点乘。 不会改变原向量
 * @public
 * @param {Array<number>} arr - 原向量
 * @returns {number} 归一化后的向量
 */
function vec_dot(arr, ...arrs){ //当前向量与指定向量进行点乘。
    return arr.reduce( (total, val, index)=>{
        let num = 1;
        for(let i=0; i<arrs.length; i++){
            num *= arrs[i];
        }
        total += +val*arr2[index]
        return total;
    } , 0);
}
