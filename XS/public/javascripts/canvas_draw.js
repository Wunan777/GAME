window.onload=main;

function main()
{
    var num=10;
    var maxrectlist=undefined;
    var draglist={};
    var canvasEl = document.getElementById('canvas');
    var ctx = canvasEl.getContext('2d');
    var mousePos = [0, 0];
    var canwidth=parseInt(getComputedStyle(canvasEl).width);
    var canheight=parseInt(getComputedStyle(canvasEl).height);
    canvasEl.height=canheight;
    canvasEl.width=canwidth;
    var rows=num;
    var cols=num;
    var brushsize=1;
    var block_w=Math.floor(canwidth / cols);
    var block_h=Math.floor(canheight/rows);
    var divcolor=document.getElementById("mycolor");
    var mcols=divcolor.getElementsByClassName("colors");
    var brushElement=undefined;
    var canvasclicked=true;
    var mousdown=false;
    var gridbutton=document.getElementById("ifgrid");
    var ifgrid=true;
    var gridstyle=0;
    var ifmousein=false;
    var mysize;
    var oldsize;
    var maxsiz=320;
    var minsize=10;
    var changenumbtn=document.getElementById("change_grid");
    var lastpos=[0,0];
    var movecolor=document.getElementById("mycolor");
    var datestart=new Date().getTime();
    var brushsizelist=document.getElementById("brushsize");  
    var button = document.getElementById('btn-download');
    var cansizelist=document.getElementById("cansize");
    
    
    init();

    function init(){
         for(var i=0;i<mcols.length;i++)
         {
             mcols[i].onclick=function (ele) {
                 for(var n=0;n<mcols.length;n++){
                     mcols[n].className="colors";
                 }
                 if(ele.srcElement)
                 {
                     ele.srcElement.className="colors active";
                     brushElement=ele.srcElement;
                 }else
                 {
                     ele.target.className="colors active";
                     brushElement=ele.target;
                 }
             }
         }

         init_rectlist();
         draw_allRects();
         update();
    }

    $("#list").on("click",function(ev){
        var target = ev.target;
        var lis = $(this).find('li');
        for(var i = 0 ,len = lis.length; i < len; i++ )
        { 
          if( lis[i] === target )
          {
             $(lis[i]).attr({"class":"active"});
             rectlist =  rectlist_arr[i];
             draw_allRects();
          }
          else
          {
             $(lis[i]).attr({"class":""});
          } 
        }
    });
    movecolor.onmousedown=function (e1) {
        var yt=e1.clientY-movecolor.offsetTop;
        var xt=e1.clientX-movecolor.offsetLeft;
        movecolor.onmousemove=function (e2) {
           // alert(e1.clientX);
          //  alert(e2.clientX);
            //alert(e2.clientY-e1.clientY);
            movecolor.style.top=e2.clientY-yt+"px";
            movecolor.style.left=e2.clientX-xt+"px";
        }
    }
    movecolor.onmouseup=function () {
        movecolor.onmousemove=function () {
        }
    }
    changenumbtn.onclick=function () {
        num=num*2;
        if(num>maxsiz)
        {
            num=minsize;
        }
        renum();
    }
    gridbutton.onclick=function () {
        ifgrid=!ifgrid;
        draw_allRects();
    }
    brushsizelist.onchange=function (ele) {
        if(ele.srcElement)
        {
           brushsize=parseInt( ele.srcElement.options[ ele.srcElement.selectedIndex].value);
        }else
        {
            brushsize=parseInt( ele.target.options[ ele.target.selectedIndex].value);
        }
    }
    button.onclick=function (e) {
        var dataURL = canvasEl.toDataURL('image/png');
        window.open(dataURL);
    }
    cansizelist.onchange=function (ele) {
        if(ele.srcElement)
        {
            oldsize=mysize;
            mysize=ele.srcElement.options[ ele.srcElement.selectedIndex].value;
            myresize(mysize);
        }else
        {
            oldsize=mysize;
            mysize=ele.target.options[ ele.target.selectedIndex].value;
            myresize(mysize);
        }
    }
    document.addEventListener("keydown",function (e) {
       var num=e.keyCode-49;
       if(num>=0&&num<mcols.length)
       {
           for (var n = 0; n < mcols.length; n++) {
               mcols[n].className = "colors";
           }
           mcols[num].className = "colors active";
           brushElement = mcols[num];
       }
    });
    canvasEl.onmousemove=function (e) {

        var cx=e.clientX+document.body.scrollLeft;
        var cy=e.clientY+document.body.scrollTop;
        if(navigator.userAgent.indexOf("Firefox")>-1)
        {
            cx=e.clientX+document.documentElement.scrollLeft;
            cy=e.clientY+document.documentElement.scrollTop;
        }
        if(cx<canvasEl.width && cy<canvasEl.height)
        {
            lastpos[0]=mousePos[0];
            lastpos[1]=mousePos[1];
            mousePos[0]= Math.floor(cx/block_w);
            mousePos[1]= Math.floor(cy/block_h);
        }

        if(mousdown)
        {
            var k=Math.round((brushsize-1)/2);
            for(var r=mousePos[1]-k;r<=mousePos[1]+k;r++) {
                for(var c=mousePos[0]-k;c<=mousePos[0]+k;c++) {
                    if(draglist[c+","+r])
                    {}
                    else{
                        draglist[c+","+r]= {
                            isexist:true,
                            drawed:false
                        };
                    }
                }
            }

        }
    }
    canvasEl.onmouseover=function () {
        ifmousein=true;
    }
    canvasEl.onmouseout=function () {
        ifmousein=false;
    }
    canvasEl.onclick=function () {
        canvasclicked=true;
        var k=Math.round((brushsize-1)/2);
        for(var r=mousePos[1]-k;r<=mousePos[1]+k;r++) {
            for(var c=mousePos[0]-k;c<=mousePos[0]+k;c++) {
                changeRect(c, r);
                draw_at(c, r);
            }
        }
    }
    canvasEl.onmousedown=function (e){
        //alert(parseInt(brushElement.value),16);
        mousdown=true;
    }
    canvasEl.onmouseup=function (e){

        mousdown=false;
        for(var i in draglist)
        {
            var arr=i.split(",");
            var x=parseInt(arr[0]);
            var y=parseInt(arr[1]);
            if(x<cols&&y<rows) {
                changeRect(x, y);
                draw_at(x, y);
            }
        }
        draglist={};
    }


    function myresize(thesize) {

        canvasEl.style.width=thesize+"px";
        canvasEl.style.height=thesize+"px";
        canwidth=parseInt(getComputedStyle(canvasEl).width);
        canheight=parseInt(getComputedStyle(canvasEl).height);
        canvasEl.height=canheight;
        canvasEl.width=canwidth;
        block_w=Math.floor(canwidth / cols);
        block_h=Math.floor(canheight/rows);
        draw_allRects();
    }
    function renum() {

        var templist =rectlist;
        rectlist={};
        cols=num;
        rows=num;
        init_rectlist();
        if(num==minsize)
        {
            maxrectlist=templist;
        }
        for(var i in rectlist)
        {
            if(templist[i]){
                rectlist[i]=templist[i];
            }else{
                if(maxrectlist){
                    rectlist[i]=maxrectlist[i];
                }
            }
        }

        myresize();
    }
    function init_rectlist(){
       for(var m=0;m<rows;m++)
       {
           for(var n=0;n<cols;n++)
           { 
             rectlist[m+","+n]={mycol:"#000" , click:"false"};
           }
       }
    }
    function changeRect(ex,ey){
       if(!rectlist[ex + "," + ey]){
           return;
       }
       if(brushElement) {
           rectlist[ex + "," + ey].mycol = brushElement.value;
       }
    }
    function draw_grid() {
    // ctx.strokeStyle=getRgb(15,15,15);
     if(!ifgrid)
     {
         return;
     }
     var k=Math.round((brushsize-1)/2);
        for(var i=0;i<=rows;i++)
        {
            ctx.beginPath();
            ctx.lineWidth=1;
            ctx.strokeStyle=getRgb(25,25,25);
            if(i>=mousePos[1]-k&&i<=mousePos[1]+k+1){
                ctx.strokeStyle=getRgb(25,25,25);;
                if(brushElement&&ifmousein) {
                    if(gridstyle==0)ctx.strokeStyle = "#FFF";
                    if(gridstyle==1||gridstyle==2)ctx.strokeStyle = brushElement.value;
                    if(gridstyle==3)ctx.strokeStyle = "#000";
                }
                ctx.moveTo(0+0.5,Math.floor(i*block_h)+0.5);
                ctx.lineTo(Math.floor(canwidth)+0.5,Math.floor(i*block_h)+0.5);
                ctx.stroke();
            }else {
                    ctx.moveTo(0+0.5,Math.floor(i*block_h)+0.5);
                    ctx.lineTo(Math.floor(canwidth)+0.5,Math.floor(i*block_h)+0.5);
                    ctx.stroke();
            }

        }
        for(var i=0;i<=cols;i++)
        {
            ctx.beginPath();
            ctx.lineWidth=1;
            ctx.strokeStyle=getRgb(25,25,25);
            if(i>=mousePos[0]-k&&i<=mousePos[0]+k+1){
                ctx.strokeStyle=getRgb(25,25,25);;
                if(brushElement&&ifmousein) {
                    if(gridstyle==0)ctx.strokeStyle = "#FFF";
                    if(gridstyle==1||gridstyle==2)ctx.strokeStyle = brushElement.value;
                    if(gridstyle==3)ctx.strokeStyle = "#000";
                }
                ctx.moveTo(Math.floor(i * block_w)+0.5, 0+0.5);
                ctx.lineTo(Math.floor(i * block_w)+0.5,Math.floor(canheight)+0.5);
                ctx.stroke();
            }else {
                    ctx.moveTo(Math.floor(i * block_w) + 0.5, 0 + 0.5);
                    ctx.lineTo(Math.floor(i * block_w) + 0.5, Math.floor(canheight) + 0.5);
                    ctx.stroke();
            }

        }
    }
    function  draw_at(x,y) {

        ctx.fillStyle="#000";
        if(brushElement) {
            ctx.fillStyle = brushElement.value;
        }

        ctx.fillRect(x*block_w,y*block_h,block_w,block_h);
    }
    function draw_dragline(){
          ctx.strokeStyle="#000";
          if(brushElement){
              ctx.strokeStyle=brushElement.value;
          }
          for(var i in draglist)
          {
              if(!draglist[i].drawed) {
                  draglist[i].drawed=true;
                  var arr = i.split(",");
                  var x = parseInt(arr[0]);
                  var y = parseInt(arr[1]);
                  ctx.beginPath();
                  ctx.arc(Math.floor(x * block_w + block_w / 2), Math.floor(y * block_h + block_h / 2), block_h/4, 0, 2 * Math.PI);
                  ctx.stroke();
              }else {
                  //alert("drawedalready");
              }
          }
    }
    function update() 
    {
        var datenow=new Date().getTime();
        if(datenow-datestart>150)
        {
            datestart=datenow;
            gridstyle=gridstyle+1;
            if(gridstyle>3)
            {
                gridstyle=0;
            }
        }
        render();
        window.requestAnimationFrame(update);
    }
    function  render() 
    {
        draw_dragline();
        draw_grid();
    }
    function draw_allRects() {
        console.log( rectlist );
        var num = 0;
        for(var m=0;m<rows;m++){
            for(var n=0;n<cols;n++)
            {   
                ctx.fillStyle= rectlist[m+","+n].mycol ;
                ctx.fillRect(m*block_h,n*block_w,block_h,block_w);
            }
        }
    }
    function getRectlist()
    {
      return rectlist;
    }
}



function getRgb(r,g,b)
{
  return "rgb("+ r+","+g+","+b+")";
}