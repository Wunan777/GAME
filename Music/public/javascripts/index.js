var list = document.getElementById('list');
var volume = document.getElementById('volume');
var xhr = new XMLHttpRequest();
var ac = new (window.AudioContext||window.webkitAudioContext)();
var gainNode = ac[ac.createGain?"createGain":"createGainNode"]();
var source;
var count = 0;
var analyser = ac.createAnalyser();
var box = document.getElementById('box');
var height,width;
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
var size = 128;

box.appendChild(canvas);
analyser.fftSize = size * 2; // 所需数据量
analyser.connect(gainNode);
gainNode.connect(ac.destination);



resize();
visualAnalyser();

EventUtil.addHandler(list,"click",function(ev){

  var lis = list.getElementsByTagName('li');

  for (var i = 0; i < lis.length; i++) {
  	  if( lis[i] == EventUtil.getTarget(ev) )
  	  { 
        lis[i].className = "selected";
        load("/media/"+lis[i].title);
  	  }
  	  else
  	  {
        lis[i].className = "";
  	  }	
  };
})
EventUtil.addHandler(volume,"change",function(){
  changeVolume(this.value/this.max);
})
EventUtil.addHandler(window,"resize",resize);




function resize(){
	height = box.clientHeight;
	width = box.clientWidth;
	canvas.height = height;
	canvas.width = width;
	var line = ctx.createLinearGradient(0,0,0,height);
	line.addColorStop(0,"black"); 
	line.addColorStop(0.5,"grey");
	line.addColorStop(1,"white");
    ctx.fillStyle = line;
}

function load(url)
{   
	var n =  ++count;
    source && source[ source.stop ? "stop" : "noteOff" ]();
    xhr.abort();

	xhr.open("Get", url);
	xhr.responseType = "arraybuffer"; // 请求返回数据类型
	xhr.onload = function()
	{ 
	  if( n != count)return; 
	  ac.decodeAudioData(xhr.response,function(buffer){ // 解码音频 // 成功返buffer
            //  一个函数内,保证原子性.
            //  未播放前,连续点击.
            if( n != count)return; 
		   	var bufferSource = ac.createBufferSource(); // 播放对象
		   	bufferSource.buffer = buffer;         //    播放资源
		   	bufferSource.connect(analyser);       //    gainNode 链接destination 通过gainNode间接连到了
		   	                                      //    同时gainNode 起到中间件作用
		   	bufferSource[bufferSource.start?"start":"noteOn"](0);//开始播放
	        source = bufferSource;

	  },function(err){
        console.log(err);
	  });
	}
	xhr.send();
}

function visualAnalyser()
{  // analyser.frequencyBinCount为fftSize的一半.
   var arr = new Uint8Array(analyser.frequencyBinCount);
   requestAnimationFrame = window.requestAnimationFrame ||
                           window.webkitRequestAnimationFrame ||
                           window.mozRequestAnimationFrame;
    function v(){
        analyser.getByteFrequencyData(arr);
        draw(arr);
        requestAnimationFrame(v);
    }
    requestAnimationFrame(v);
}


function changeVolume(percent)
{
   gainNode.gain.value = percent ;
}

function draw(arr){
   var w = width/size;
   var h;
   ctx.clearRect(0,0,width,height);
   for (var i = 0; i < size; i++) {
     h = arr[i]/256 * height;
     ctx.fillRect( w*i , height-h , w * 0.8 ,h );

   }
}

//  几个问题 
//  解码速度太慢了
//  频繁切换点击会造成 歌曲延迟很久才播放
//
