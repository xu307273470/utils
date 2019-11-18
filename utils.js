(function() {
    "use strict";
    var fs = require('fs');
    var path = require("path");

//查找文件夹和文件
    exports.scanFolder = function(dir, filesName, skip_suffixes, skip_fixed_strings, searchSubfolder){
        var fileList = [],
            otherFileList = [],
            folderList = [],
            _filesName = filesName || "ExportJson",
            walk = function(dir, fileList, otherFileList, folderList){
                var files = fs.readdirSync(dir);
                files.forEach(function(item) {
                    var tmpPath = dir + '/' + item,
                        stats = fs.statSync(tmpPath);
                    var skip = false;
                    if (skip_fixed_strings) {
                        for(var i = 0; i < skip_fixed_strings.length; i++) {
                            if (tmpPath.indexOf(skip_fixed_strings[i]) >= 0) {
                                skip = true;
                                break;
                            }
                        }
                    }
                    if (!skip) {
                        if (stats.isDirectory()) {
                            if ((typeof(searchSubfolder) == "undefined" || searchSubfolder)) {
                                walk(tmpPath, fileList, otherFileList, folderList);
                            }
                            folderList.push(tmpPath);
                        } else {

                            var extend = tmpPath.substring(tmpPath.lastIndexOf(".") + 1);
                            if (extend == _filesName) {
                                fileList.push(tmpPath);
                            } else {
                                if (skip_suffixes && skip_suffixes.indexOf(extend) >= 0) {

                                } else {
                                    otherFileList.push(tmpPath);
                                }
                            }

                        }
                    }
                });
            };
        walk(dir, fileList, otherFileList, folderList);
        return {
            'files': fileList,
            'otherFileList':otherFileList,
            'folders': folderList
        }
    };
    exports.existsSync = function (filePath) {
        return fs.existsSync(filePath);
    }
    exports.deleteall = function(dir) {
        var files = [];
        if(fs.existsSync(dir)) {
            files = fs.readdirSync(dir);
            var self = this;
            files.forEach(function(file, index) {
                var curPath = dir + "/" + file;
                if(fs.statSync(curPath).isDirectory()) { // recurse
                    self.deleteall(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(dir);
        }
    };
    exports.createDirsSync = function (dir, split) {
        if (!fs.existsSync(dir)) {
            var dirArr = dir.split(split|| "/");
            var pathtmp;
            for (var i = 0; i < dirArr.length; i++) {
                var item = dirArr[i];
                if (pathtmp) {
                    pathtmp = path.join(pathtmp, item);
                }
                else {
                    pathtmp = item;
                }
                if (!fs.existsSync(pathtmp)) {
                    fs.mkdirSync(pathtmp)
                }
            }
        }
    };
    exports.writeFileSync = function (dir, name, data) {
        this.createDirsSync(dir, "/");
        if (data) {
            fs.writeFileSync(dir + "/" + name, data);
        }
    };
    exports.urlencode = function (str) {
        str = (str + '').toString();
        return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
        replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
    };
}).call(this);