 window.onload = function(){
	  	var content = document.getElementById("content");
	    var img = document.getElementById("blur-img");
	  	var canvasWidth = window.innerWidth;
	  	var canvasHeight = window.innerHeight;
	  	var canvas = document.getElementById('canvas');
	  	var context  = canvas.getContext("2d");
	  	var radius = 50;
	  	var clip = {x:100,y:100,r:radius};
	  	var image = new Image();
	    var show = document.getElementById("show");
	  	var change = document.getElementById("change");
        var time_show;
        var time_change;

        // 视图 div 包裹了img 和 canvas 
        // 三者大小均为 window大小

         // div
	    content.style.height = window.innerHeight + "px";
	    content.style.width = window.innerWidth + "px" ;

        // img blur-img
	    img.style.height = window.innerHeight + "px";
	    img.style.width = window.innerWidth + "px" ;

        // canvas image为要画的图
	  	canvas.width = canvasWidth;
	  	canvas.height = canvasHeight;
	  	image.src = "1.jpg";
	  	image.width =  window.innerWidth ;
	  	image.height = window.innerHeight;
   

   
	  	function Rand(min,max){ 
	  		 if( max < min )
	  		 {
	  		 	var t = min;
	  		 	min = max;
	  		 	max = t;
	  		 }
	  		 return Math.round( (max-min)*Math.random() + min );
	  	}
 

	  	image.onload = function(e){
	  		initCanvas();
	  	}
	    function initCanvas(){
	       changePoint();
           draw(image);
	  	}

        function changePoint(){
           clip.x = Rand(radius,canvas.width - radius);
           clip.y = Rand(radius,canvas.height - radius);
        }
        
	  	function draw(image){
	  		context.clearRect(0,0,canvas.width,canvas.height);
	  		context.save();
	  		setClip(clip);
	  		context.drawImage(image,0,0,image.width,image.height);
	  		context.restore();
	  	}
           function setClip(clip){ // 剪切canvas
             context.beginPath();
             context.arc(clip.x,clip.y,clip.r,0,Math.PI*2);
             context.clip();
           }
   

        // 事件

	  	show.addEventListener('click',function(){
                if( time_show )
                {
                	clearInterval(time_show);
                }
                else if( time_change )
                {
                	 clearInterval(time_change);
                }
	  		    time_show = setInterval(function(){
	  			if( clip.r > Math.sqrt(canvas.width*canvas.width+canvas.height*canvas.height) )
	  			{
	  				clearInterval(time_show);
	  			}
		  		clip.r += 2;
		  		draw(image);
     		},3)
	     
	  	});

	    change.addEventListener('click',function(){
	    	 if(time_show )
	    	 {  
	    	 	clearInterval(time_show);
	    	 	
	    	 }
	    	 else if( time_change )
	    	 {   
	    	 	clearInterval(time_change);
	    	 }
	    	 
	    	 	changePoint();
	    	   	clip.r  = 0;
	    	   	time_change = setInterval(function(){
		    	   if( clip.r > radius)
		    	   {  
		    	   	  clearInterval(time_change);	    	      
		    	   }
		    	   else{
	                  clip.r++;
	                  draw(image);
	          	   }
	    	     },10);
	  
	    });
        
}// end
