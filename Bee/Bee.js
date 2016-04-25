window.onload = function(){

	   var oBtn = document.getElementById('gameBtn');
	   	  oBtn.onclick = function(){
	   	  	this.style.display = 'none';
	   	    Game.init();
	   	   
	   	  };
	   };

	   var Game = {
	       air : {
	   	   	    speed:10,
	   	   		style:'air1',
	   	   		bulletStyle : 'bullet'
	   	   },
	   	   oEnemy :{
	   	   	 e1 :{ style: 'enemy1', blood:1, speed:5, score:1},
	   	   	  e2 :{ style: 'enemy2', blood:2, speed:7, score:2},
	   	   	   e3 :{ style: 'enemy3', blood:3, speed:10, score:3}
	   	   },
	   	   gk : [
	   	       {
	   	       	  eMap : [
	   	       	         'e2','e2','e2','e2','e2','e2','e2','e2','e2','e2',
			   	      	 'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1'
			   	      	 
	   	      	         ],
		   	      colNum : 10,
		   	      iSpeedX :10,
		   	      iSpeedY :10,
		   	      times : 2000
	   	      },
	   	      {
	   	       	  eMap : [
			   	      	 'e3','e3','e3','e3','e3','e3','e3','e3','e3','e3',
			   	      	 'e2','e2','e2','e2','e2','e2','e2','e2','e2','e2',
			   	      	 'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
			   	      	 'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
			   	      	 'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
			   	      	 'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
	   	      	         ],
		   	      colNum : 10,
		   	      iSpeedX :10,
		   	      iSpeedY :10,
		   	      times : 2000
	   	      }
	   	      
	   	   ],
	       init : function(){
	       	  
	       	 this.now_gk = 0;  // 关卡数
	       	 this.score = 0; // 初始分数
	       	 this.oParent = document.getElementById('body');
	       	 this.createScore();
	       	 this.createEnemy(0);
	       	 this.createAir();
	       	 this.bindAir();
	       },
	       createScore : function(n){
	       		var oS = document.createElement('div');
	         	oS.id = 'score';
	         	oS.innerHTML = '积分:<span>'+this.score+'</span>';
	        	this.oParent.appendChild(oS); 
	        	this.oSNum = oS.getElementsByTagName('span')[0];  // 获取oS下div值 并变为全局变量
	       },
	       createEnemy : function(iNow){

	       		var gk_now = this.gk[iNow];
	       		var oUl = document.createElement('ul');
	       		

	       		oUl.id = 'bee';
	       		oUl.style.width = gk_now.colNum *40 + 'px';
	       		this.oParent.appendChild(oUl);
       			oUl.style.left = (this.oParent.offsetWidth - oUl.offsetWidth)/2 + 'px';
       			oUl.style.top = 30 +'px';
       			//注意 未添加时 oUl.offsetWidth 值为0；
                 
       			for(var i=0,len=gk_now.eMap.length; i<len ; i++)
       			{
       				var oLi = document.createElement('li');
       				oLi.className = this.oEnemy[ gk_now.eMap[i] ].style;
       				oLi.innerHTML = '<span></span>';  //添加小蜜蜂的数据
       				oLi.blood = this.oEnemy[ gk_now.eMap[i] ].blood;
       				oLi.speed = this.oEnemy[ gk_now.eMap[i] ].speed;
       				oLi.score = this.oEnemy[ gk_now.eMap[i] ].score;
       				oUl.appendChild(oLi);
       			}
       			this.aLi = oUl.getElementsByTagName('li');
       			this.oUl = oUl;  // Ul变为对象的属性
       			
       			// 将小蜜蜂的float布局 转为绝对定位布局
       			//先获取到当前每个 li 的位置
             // var  a = [];
 			// a.push([1,2]);
 		   // alert(a[0][1]);
       			var arr = [];
       			for(var i=0; i < this.aLi.length; i++)
       			{   
       				var x = this.aLi[i].offsetLeft;
       				var y = this.aLi[i].offsetTop;
       			 
       				arr.push([x,y]);
       			}

 				for(var i =0; i < this.aLi.length; i++)
 				{
 					this.aLi[i].style.position = 'absolute';
 					this.aLi[i].style.left  = arr[i][0] + 'px';
 					this.aLi[i].style.top = arr[i][1] + 'px';
 

 				}
       			this.runEnemy(gk_now);
       			 
	       },
	       runEnemy : function(gk_now){

	       		var This = this;
	       		var L = 10;
	       		var R = this.oParent.offsetWidth - this.oUl.offsetWidth-10;
	       		//注意 定时器内部的this指向问题  指向window 
	       		setInterval(function(){ 
	       			if( This.oUl.offsetLeft > R)
	       			{
	       				gk_now.iSpeedX *= -1;
	       				This.oUl.style.top = This.oUl.offsetTop + gk_now.iSpeedY + 'px';
	       			}
	       			else if( This.oUl.offsetLeft < L)
	       			{
	       				gk_now.iSpeedX *= -1;
	       				This.oUl.style.top = This.oUl.offsetTop + gk_now.iSpeedY + 'px';
	       			}
	       			
	       			This.oUl.style.left  =  This.oUl.offsetLeft + gk_now.iSpeedX +'px';

	       			// 移动检测是否碰撞
	       			for(var i =0,len = This.aLi.length; i<len ;i++ )
	       			{    
	       				if( This.PZ(This.oA, This.aLi[i]) ) // 传入的参数 第二个是小蜜蜂的 加入了父级offsetleft
	       				{   

	       					alert("失败了！");
	       					This.refresh();
	       				}
	       				else if( This.aLi[i].offsetTop+This.oUl.offsetTop > 600) 
	       				{
	       					This.oUl.removeChild(This.aLi[i]);
	       				}
	       				 
	       			}
	       			 
	       			 
	       		},200);
	       			
	       			 

	       },
	       createAir : function(){
	       	 var oA = document.createElement('div');
   			 oA.className = this.air.style;
 			 this.oParent.appendChild(oA);
 			 oA.style.left = (this.oParent.offsetWidth - oA.offsetWidth)/2 + 'px';
 			 oA.style.top = (this.oParent.offsetHeight - oA.offsetHeight) + 'px';
 			 this.oA = oA;
	       },
	       bindAir : function(){ // 操作飞机
	       						//键盘按下 连续触发
	       		var Num=-1;
	       		var This = this;
	       		var speed = this.air.speed;
	       		var timer = null;
	       		document.onkeydown = function(ev)
	       		{        			
	       			var ev = ev || window.event;
	       			if(!timer)
	       			{   
                        timer = setInterval(show,30);
	       			}
	       			if( ev.keyCode == 37 )   // 按下左键
	       			{
	       				Num = 0;
	       			}
	       			else if( ev.keyCode == 39) //按下右键
	       			{
	       				Num = 1;
	       			}

	    
	       		}
	       		document.onkeyup = function(ev){
	       			 var ev = ev || window.event;
	       			
	       			 if( ev.keyCode == 32)    // 按下空格 抬起后
	       			 {
	       			 	This.createBullet();
	       		     }
	       		     else if( ev.keyCode == 37 || ev.keyCode == 39)
	       		     {
	       		     	 clearInterval(timer);     //清除后不是空 
	       			     timer = null; 
	       			     Num = -1;
	       		     }
	       		 
	       			 
	       		}
	       		function show()
	       		{ 
	       			 if(Num == 0)
	       			 {  
	       			 	if( This.oA.offsetLeft > 0)
	       			 	{
	       			 		This.oA.style.left = This.oA.offsetLeft - speed + 'px';
	       			 	}
	       			 }
	       			 else if(Num == 1)
	       			 {  
	       			 	if( This.oA.offsetLeft < (This.oParent.offsetWidth - This.oA.offsetWidth))
	       			 	{
	       			 		This.oA.style.left = This.oA.offsetLeft + speed + 'px';
	       			 	}
	       			 }
	       		}
	       },
	       createBullet : function(){
	       		var oB = document.createElement('div');
	       		
	       		oB.className = this.air.bulletStyle;
	       		this.oParent.appendChild(oB);
	       		oB.style.left = this.oA.offsetLeft + (this.oA.offsetWidth/2) + 'px';
	       		oB.style.top = this.oA.offsetTop - 10 + 'px';
	       		this.BulletRun(oB);

	       },
	       BulletRun : function(oB){
	       	    var This = this;
	       	    var timer = setInterval(function(){
	       	    	if( oB.offsetTop < -10)
	       	    	{
	       	    	  clearInterval(timer);
	       	    	  timer = null;
	       	    	  This.oParent.removeChild(oB);
	       	    	}
	       	    	else
	       	    	{
	       	    	 oB.style.top = oB.offsetTop - 10 + 'px';
	       	    	 for(var i=0,len = This.aLi.length; i<len ; i++)
	       	    	 {
	       	    	 	if( This.PZ( oB, This.aLi[i] ) )  // 如果碰撞到 击中了
	       	    	 	{      
	       	    	 		 This.oParent.removeChild(oB);
	       	    	 		 This.aLi[i].blood -= 1;
	       	    	 		 if (This.aLi[i].blood == 0) 
	       	    	 		 {
	    												//血量减少到0
	    												//怪被打死 加分并判断是否过关
	    						This.score += This.aLi[i].score ; // 加分
	    						This.oSNum.innerHTML =  This.score;
	       	    	 		 	This.oUl.removeChild(This.aLi[i]);
	       	    	 		 	    /// 是否过关
	       	    	 		 	if( This.aLi.length == 0)
	       	    	 		 	{    
	       	    	 		 		 //过关！
	       	    	 		 		 if( This.now_gk == This.gk.length )
	       	    	 		 		 {
	       	    	 		 		 	alert('通关了！');
	       	    	 		 		 }
	       	    	 		 		 else
	       	    	 		 		 {  
	       	    	 		 		 	alert('下一关!');
	       	    	 		 		 	This.now_gk++;
	       	    	 		 		 	This.refresh();
	       	    	 		 		 }

	       	    	 		 	}
	       	    	 		 };
	       	    	 	}
	       	    	 }
	       	    	}

	       	    	
	       	    },30)

	       },
	       PZ :function(obj1,obj2){ // 碰撞检测
	       		var L1 = obj1.offsetLeft;  // 第一个参数是子弹 其父级是window
	       		var R1 = obj1.offsetLeft + obj1.offsetWidth;
	       		var T1 = obj1.offsetTop
	       		var B1 = obj1.offsetTop + obj1.offsetHeight;

	       		var L2 = obj2.offsetLeft+this.oUl.offsetLeft;  // offset 相对于父级的距离 第二个参数是小蜜蜂 其父级是ul
	       		var R2 = obj2.offsetLeft + obj2.offsetWidth+this.oUl.offsetLeft;//若要同obj1相比 需要将父级的left top值也相加
	       		var T2 = obj2.offsetTop + this.oUl.offsetTop;
	       		var B2 = obj2.offsetTop + obj2.offsetHeight + this.oUl.offsetTop;

	       		if( R1<L2 || B1<T2 || L1>R2 || T1>B2){
	       			return false;
	       		}
	       		else{
	       			return true;
	       		}

	       },
	       Next : function(){
	       	 if( this.now_gk+1 == this.gk.length )
	       	 {
 				alert("通关了！");
	       	 }
	       	 else
	       	 {   
	       	 	 alert("下一关！");
	       	 	 this.createEnemy(++this.now_gk);
	       	 }
	       	
	       },
	       refresh : function(){
	       	//1 重置敌人
	       	   this.oUl.style.left = (this.oParent.offsetWidth - this.oUl.offsetWidth)/2 + 'px';
       		   this.oUl.style.top = 30 +'px';
	       	 for(var i=0 ,len = this.aLi.length; i<len; i++)
	       	 {
	       	 	this.oUl.removeChild(this.aLi[0]);   // 注意 如果我删除了第一个li a[0] 则第二个将其代替 则此时a[0]表示第二个li
	       	 	alert(len+""+i);					// js中数组不靠谱...
	       	 }
  
				// 重新添加li
                  var gk = this.gk[this.now_gk];
                  for(var i=0,len=gk.eMap.length; i<len ; i++)
       			{
       				var oLi = document.createElement('li');
       				oLi.className = this.oEnemy[ gk.eMap[i] ].style;
       				oLi.innerHTML = '<span></span>';  //添加小蜜蜂的数据
       				oLi.blood = this.oEnemy[ gk.eMap[i] ].blood;
       				oLi.speed = this.oEnemy[ gk.eMap[i] ].speed;
       				oLi.score = this.oEnemy[ gk.eMap[i] ].score;
       				this.oUl.appendChild(oLi);
       			}


       			var arr = [];
       			for(var i=0; i < this.aLi.length; i++)
       			{   
       				var x = this.aLi[i].offsetLeft;
       				var y = this.aLi[i].offsetTop;
       			 
       				arr.push([x,y]);
       			}

 				for(var i =0; i < this.aLi.length; i++)
 				{
 					this.aLi[i].style.position = 'absolute';
 					this.aLi[i].style.left  = arr[i][0] + 'px';
 					this.aLi[i].style.top = arr[i][1] + 'px';

 				}

	 		  //2 让当期页面所有子弹消逝
	 		  var b_arr = document.getElementsByClassName('bullet');
	 		  for(var i=0,len =b_arr.length ; i<len; i++)
	 		  {
	 		  	 this.oParent.removeChild(b_arr[0]);
	 	      }

	       }
	   	   

}