

/**
 * 是否是web的移动端
 * @public
 * @returns {boolean} true表示当前环境是web，并且是移动端，false表示非web或是pc端
 */
function isMobile(){
    try{  // 可能不存在window对象
        const reg = /iPhone|iPad|iPod|iOS|Android|SymbianOS|Windows Phone|coolpad|mmp|smartphone|midp|wap|xoom|symbian|j2me|blackberry|wince/i;
        return reg.test(navigator.userAgent); 
    }catch(e){
        return false;
    }
}

/**
 * 是否是web的pc端
 * @public
 * @returns {boolean} true表示当前环境是web，并且是pc端，false表示非web或是移动端
 */
function isPC(){
    try{  // 可能不存在window对象
        const reg = /iPhone|iPad|iPod|iOS|Android|SymbianOS|Windows Phone|coolpad|mmp|smartphone|midp|wap|xoom|symbian|j2me|blackberry|wince/i;
        return !reg.test(navigator.userAgent); 
    }catch(e){
        return false;
    }
}

/**
 * 判断是否是微信环境
 * @public
 * @returns {boolean} true表示当前环境是web，并且是pc端，false表示非web或是移动端
 */
function isWX(){
    try{
        const reg = /MicroMessenger/i;
        return reg.test(navigator.userAgent);
    }catch(e){
        return false;
    }
}


