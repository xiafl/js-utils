
const fs = require('fs');

//*************************************** 模拟 web storage ************************************ */
/**
 * 模拟 web storage
 * 数据存储存在指定的文件中
 * v1.0.0
 * 最后修改: 2019.7.17
 * 创建: 2019.7.17
 */
class LocalStorage {
    /**
     * @param {*} fileName 
     * @param {string} storeType - 存储的类型 'file' 表示存储到本地文件中 'cache' 表示存储在内存中
     */
    constructor(storeType = 'file', fileName = '.localStorage') {
        this.fileName = fileName;
        this.storeType = storeType;
        this.store = this.getStoreObj(this.fileName) || { length: 0 };
    }
    get length() {
        return this.store.length;
    }
    setItem(name, val) {  //存储一个值
        if (!(name in this.store)) {
            this.store.length++;
        }
        const oldVal = this.store[name];
        this.store[name] = val;
        if (oldVal !== val) {
            this.addUpdateTime(this.store);
            this.setToStore(this.fileName, this.store);
        }
    }
    getItem(name) { // 取值
        return this.store[name];
    }
    removeItem(name) { //删除
        if (name in this.store) {
            this.store.length--;
        }
        delete this.store[name];
        this.addUpdateTime(this.store);
        this.setToStore(this.fileName, this.store);
    }
    clear() { // 清空
        this.store = { length: 0 };
        this.addUpdateTime(this.store);
        this.setToStore(this.fileName, this.store);
    }
    key(name) { //返回存储时的索引
        return 0;
    }

    addUpdateTime(obj) { // 添加更新时间
        obj.__lastUpdate = new Date().toLocaleString();
    }

    getStoreObj(fileName) { //从文件中读取
        if (this.storeType !== 'file') {
            return;
        }
        let obj;
        try {
            let data = fs.readFileSync(fileName); // 同步读取
            obj = JSON.parse(data.toString());
        } catch (e) {
            // console.error('读取文件错误！', e) 
        }
        return obj;
    }
    setToStore(fileName, obj = { length: 0 }) {
        if (this.storeType !== 'file') {
            return;
        }
        // 如果不存在文件，就会新建一个，如果已经存在，就会被覆盖
        fs.writeFile(fileName, JSON.stringify(obj), function (err) {// 异步写入
            if (err) {
                // console.log('写入文件错误！', err);
            }
        });
    }
}
//*************************************** 模拟 web storage ************************************ */

// let storage = new LocalStorage();
// console.log(storage.store);
// storage.setItem('aa', 334);

