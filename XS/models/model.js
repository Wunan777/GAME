var mongoose = require('mongoose');
// 拿到模式
var Schema = require('../schemas/schema.js');
// 编译模式 生成模型
//                         模型名字 模式
var model = mongoose.model('model',Schema);

// 模型导出
module.exports = model; 
  