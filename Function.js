

/**
 * 按照参数的类型将其分配到指定的变量中
 * @public
 * @param {Array} args - 参数
 * @param {Object} params_outer - 配置 类似于： {'1': 'age', 'string': 'name' , 'boolean': 'loop', 'number': 'volume', 'function': 'callback'};
 *                                属性名为数字时，表示args数组中的索引； 属性名为字符串时，表示类型；值表示变量名
 *                                支持的类型有: 'boolean' 'number' 'string' 'function' 'Array' 'RegExp' 'object'
 * @returns {Object} 获取到的参数对象 如: {'age': 17, name: '小明', 'loop': true, volume: 0.73}
 * @example
 * 1. getTypeParams([true, '小明', 17], {'string': 'name', 'number': 'age', 'boolean': 'isStudent'});
 * // => {name: '小明', age: 17, isStudent: true}
 * 
 * 2. getTypeParams([98, true, '小明', 17], {'string': 'name', 'number': 'age', 'boolean': 'isStudent', '0': 'score'});
 * // => {score: 98, name: '小明', age: 17, isStudent: true}
 */
function getTypeParams(args, params_outer){
    let params = Object.assign({}, params_outer);
    for(let i=0, arg, propName; i<args.length; i++){
        arg = args[i];
        if(i in params){
            propName = params[i];
            delete params[i];
            params[propName] = arg;
            args.splice(i, 1);
            i --;
        }
    }

    for(let i=0, arg, propName; i<args.length; i++){
        arg = args[i];
        switch(typeof arg){
            case 'boolean': 
            case 'number': 
            case 'string': 
            case 'function': 
            delete params[ arg ];
                propName = params[ arg ]; 
                delete params[ arg ];
                params[propName] = arg; 
            break;
            case 'object': 
                if(Array.isArray(arg)){
                    if('Array' in params){
                        propName = params[ 'Array' ];
                        delete params[ 'Array' ] ;
                    }else{
                        break;
                    }
                }else if(arg instanceof RegExp){
                    if('RegExp' in params){
                        propName = params[ 'RegExp' ];
                        delete params[ 'RegExp' ] ;
                    }else{
                        break;
                    }
                }else{
                    if('object' in params){
                        propName = params[ 'object' ];
                        delete params[ 'object' ] ;
                    }else{
                        break;
                    }
                }
                params[propName] = arg;
            break;
        }
    }
    for(prop in params_outer){
        if(prop in params){
            delete params[prop];
        }
    }
    params_outer = null;
    return params;
}

