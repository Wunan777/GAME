var express = require('express');
var router = express.Router();

// 数据库
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/nodeDb');
// var mongoose = require('mongoose');
// var model = require('../models/model.js')
// mongoose.connect('mongodb://localhost/db');// 连接数据库

/* GET home page. */
router.get('/',function(req,res,next){
	console.log("跳转到主页！");
	res.render('index', { title: "WuMing!" });

});

router.get('/home', function(req, res, next) {
    console.log("跳转到HOME");
    res.render('home',{ title : 'home' } );
});

router.get("/list",function(req,res,next){
       console.log("list页面!");
   	   var collection = db.get('nodeTable');
   	   collection.find({},function(err,docs){//异步
          res.render('list', { title: "list" , data: docs });
   	   });
});
// router.list = function(db){

//    return function(req,res)
//    {
//    	   console.log("list页面!");
//    	   var collection = db.get('nodeTable');
//    	   collection.find({},{},function(err,docs){//异步
//           res.render('list', { title: "list" , data: docs });
//    	   });
   	   
//    }
// }

// router.get('/', function(req, res, next) {
  
//   console.log("跳转到主页！");
//   res.render('index', { title: "express" });
   
// });



// 请求数据库
router.post('/getDatas',function(req,res,next){
	 console.log("请求数据库");
   var collection = db.get('nodeTable');
   collection.find({},function(err,docs){
         res.send(docs);
   });
});


//存储到数据库
router.post('/add',function(req,res,next){
   
   var collection = db.get('nodeTable');
   var data = req.body; // 获得前台传入数据
   var obj = {};

   obj.name= data.name || "None" ;
   obj.row = data.row;
   obj.col = data.col;
   obj.arr = data.arr.split(",");
   console.log("数据库请求");
    collection.insert( obj ,function(err,doc){
    	  if(err)
    	  {  
    	  	 res.send("数据插入过程中出错了.");
    	  }
    	  else
    	  {  
           res.send("数据插入成功.");
    	  }
    });
 
  
});



module.exports = router;

