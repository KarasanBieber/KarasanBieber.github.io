var canv;
var img;
var ctx;
var fps=1000/60;
var i,j;
var y,vy;
var run;
var safe;
var filetype;
function click(){
	if(run!=1){
		for(i=0;i<4;i++){
			safe[i]={};
			safe[i]["x"]=i*400+1000;
			safe[i]["safe"]=Math.floor(Math.random()*300);
		}
		score=0;
		y=200.0;
		run=1;
	}
	if(y>-50){
		var audio=new Audio("syugyou."+filetype);
		audio.play();
		vy=-15.0;
	}
}
function kowagatte(){
	var audio=new Audio("kowagatte."+filetype);
	audio.play();
}
window.onmousedown=click;
window.onload=function(){
	canv=document.getElementById("screen");
	canv.width=1024;
	canv.height=576;
	ctx=canv.getContext("2d");
	img=new Image();
	img.src="sonshi.png";
	var audiotype=new Audio();
	if(audiotype.canPlayType("audio/mp3"))
		filetype="mp3";
	else
		filetype="wav";
	y=200.0;
	vy=1.0;
	score=0;
	run=0;
	safe=[];
	for(i=0;i<4;i++){
		safe[i]={};
		safe[i]["x"]=i*500+1000;
		safe[i]["safe"]=Math.floor(Math.random()*300);
	}
	(function(){
			ctx.clearRect(0,0,canv.width,canv.height);
			ctx.beginPath();
			ctx.stroke();
			ctx.drawImage(img,300,y);
			ctx.strokeRect(335,y+40,40,50);
			ctx.fillStyle="rgb(93,41,23)";
			ctx.fillRect(0,560,1024,576);
			for(i=0;i<4;i++){
				ctx.fillStyle="rgb(100,100,100)";
				ctx.fillRect(safe[i]["x"],0,50,safe[i]["safe"]);
				ctx.fillRect(safe[i]["x"],safe[i]["safe"]+210,50,560);
			}
			ctx.font="30px sans-serif";
			ctx.fillStyle="rgb(0,0,0)";
			ctx.fillText("スコア："+score,0,30);
		if(run==1){
			for(i=0;i<4;i++){
				if((safe[i]["x"]>285&&safe[i]["x"]<375)&&(y+40<safe[i]["safe"]||y+90>safe[i]["safe"]+210))
					run=2;
			}
			if(y+90>560){
				run=2;
			}
			if(run==2)
				kowagatte();
			if(safe[0]["x"]<=-50){
				safe.shift();
				safe[3]={};
				safe[3]["x"]=safe[2]["x"]+500;
				safe[3]["safe"]=Math.floor(Math.random()*300);
			}
			for(i=0;i<4;i++){
				safe[i]["x"]-=4;
			}
			score++;
			y+=vy;
			vy+=0.8;
		}else if(run==2){
		}else{
			ctx.font="40px sans-serif";
			ctx.fillText("クリックでスタート",300,100);
		}
		setTimeout(arguments.callee,fps);
	})();
}
