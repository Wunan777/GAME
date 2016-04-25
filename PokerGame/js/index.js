 window.onload = function()
 {      

        var button = document.getElementById('start');
        button.addEventListener('click',function(){
            this.style.width = 0;
            this.style.height = 0;
            init();
        });
  
        function init(){

          var div_img = document.getElementsByClassName("div_img");
          var img = document.getElementsByTagName('img');
          var  flag;
          var one = 0;  // 第一张牌
          var two = 1;  // 第二张牌
          var wait_div = new Array(); // 点击第二张牌时，将第一张存起来

             // 定义每块正反面.
             for (var i = 0; i < div_img.length; i++) {
                 div_img[i].back = true;
                 div_img[i].msg = "";
             };
            //  绑定每块的点击事件
             for (var i = 0; i < div_img.length; i++) {
                 div_img[i].addEventListener('click', click)
             };
            //  设置图片宽高
             for (var i = 0; i < img.length; i++) {
                 img[i].width = 150    ;
                 img[i].height = 150 ;
             };

             init_sort();
             allTurn();


              function init_sort(){ // 乱序设置图片位置

                   var temp = div_img.length/2;
                   var num1 = [];
                   for (var i = 0; i < temp ; i++) {
                        num1.push(i);
                   };
                   for (var i = 0; i < temp; i++) {
                        num1.push(i);
                   };
                   num1.sort(function(){
                     return 0.5  - Math.random();
                   });
                   console.log(temp);
                   console.log(num1);
                   for (var i = 0; i < div_img.length; i++) {
                       var img  = div_img[i].getElementsByTagName('img');
                       img[0].src = "img/"+(num1[i]+1)+".jpg";
                   };

              }
              function allTurn(){

                  setTimeout(function(){
                          for (var i = 0; i < div_img.length; i++) 
                      {
                              var img = div_img[i].getElementsByTagName("img");
                              img[0].style.transform = "rotateX(180deg)";
                              img[0].style.opacity = "0";
                              img[1].style.transform = "rotateX(0)";
                              img[1].style.opacity = "1";
                              div_img[i].back = false;
                              flag = -1;
                      }
                  },1000)
                  
             };


                        
              function click()
              {     
                    if( this.msg == 1)
                    {
                        return ;
                    }
                    var img = this.getElementsByTagName('img');
                    if( flag == -1)
                    {
                     turn.apply(this);
                     one = img[0].src;

                     wait_div.push(this);

                     flag = 1;
                    }
                    else if (flag == 1)
                    {
                       flag = 2;  // 防止连续点击 
                       turn.apply(this);
                       two = img[0].src;
                       if( one == two )
                       { 
                         this.msg = 1;
                         wait_div.pop().msg = 1;
                         setTimeout(function(){
                            flag = - 1;
                         },650);
                         
                       }
                       else if (one != two) {
                          that = this;
                          setTimeout(function(){
                            turn.apply(that);
                            turn.apply( wait_div.pop() );
                            flag = -1;
                          },650)
                         
                       };


                    };

              }
              
              function turn() // 旋转哪一块的图片
              {    
                  var img = this.getElementsByTagName("img");
                  var back = this.back;
                 
                  if(back == false){ 
                        img[0].style.transform = "rotateX(0)";
                        img[0].style.opacity = "1";
                        img[1].style.transform = "rotateX(180deg)";
                        img[1].style.opacity = "0";
                        this.back = true;
                  }
                  else if( back == true ){ 
                        img[0].style.transform = "rotateX(180deg)";
                        img[0].style.opacity = "0";
                        img[1].style.transform = "rotateX(0)";
                        img[1].style.opacity = "1";
                        this.back = false;
                  }
                 
              }



        };



        
        

 }


