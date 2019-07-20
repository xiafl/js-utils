


/**
 * 获取目录中的文件和文件夹列表
 * @param {string} folder - 完整的路径(如果是文件，则包含扩展名)
 */
function readdir_promise(folder) {
    return new Promise((resolve, reject) => {
        fs.readdir(folder, (err, files) => {
            err ? reject(err) : resolve(files);
        });
    });
}

/**
 * 获取文件或目录信息
 * @param {string} file  - 完整的路径(如果是文件，则包含扩展名)
 */
function stat_promise(file) {
    return new Promise((resolve, reject) => {
        fs.stat(file, (err, stats) => {
            err ? reject(err) : resolve(stats);
        });
    });
}



