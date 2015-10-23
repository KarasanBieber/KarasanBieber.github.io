function rotate(type){
	var t=[];
	var i,j;
	for(i=0;i<3;i++){
		for(j=0;j<3;j++){
			t[i*3+j]=type[(2-j)*3+i];
		}
	}
	for(i=0;i<3;i++){
		for(j=0;j<3;j++){
			type[i*3+j]=t[i*3+j];
		}
	}
}
function genPuyo(type){
	var one=Math.floor(Math.random()*4)+1;
	var two=Math.floor(Math.random()*4)+1;
	for(i=0;i<3;i++){
		for(j=0;j<3;j++){
			type[i*3+j]=0;
		}
	}
	type[1]=one;
	type[4]=two;
}
var stage,next,next2;
var fps=1000/60;
var SIZE_X=12;
var SIZE_Y=23;
var FONT_SIZE=20;
var KRSW=['　','<span style="color:#EE5555;">唐</span>','<span style="color:#55EE55;">澤</span>','<span style="color:#5555EE;">貴</span>','<span style="color:#EEEE55;">洋</span>','　'];
var map=[];
var puyo=[];
var i,j;
var co=1;
var x=4,y=1;
var gameover=false;
var rensa=0;
function overlap(){
	var z=false;
	for(i=0;i<Math.min(3,SIZE_Y-y);i++){
		for(j=0;j<3;j++){
			if(puyo[0][i*3+j]&&map[(y+i)*SIZE_X+j+x]){
				z=true;
				break;
			}
		}
		if(z){
			break;
		}
	}
	return z;
}
function fix(){
	var t;
	for(i=2;i>=0;i--){
		for(j=0;j<3;j++){
			if(puyo[0][i*3+j]){
				for(t=(y+i+1)*SIZE_X+j+x;map[t]==0;t+=SIZE_X);
				map[t-SIZE_X]=puyo[0][i*3+j];
			}
		}
	}
}
function tsumeru(){
	var t;
	var u;
	for(i=SIZE_Y-2;i>=0;i--){
		for(j=1;j<SIZE_X-1;j++){
			if(map[i*SIZE_X+j]){
				for(t=(i+1)*SIZE_X+j;map[t]==0;t+=SIZE_X);
				t-=SIZE_X;
				u=map[i*SIZE_X+j];
				map[i*SIZE_X+j]=0;
				map[t]=u;
			}
		}
	}
}
function del(){
	var g=false;
	var k;
	var l;
	for(i=SIZE_Y-2;i>=0;i--){
		for(j=1;j<SIZE_X-1;j++){
			if(map[i*SIZE_X+j]>=1){
				var p=[];
				for(k=0;k<SIZE_X*SIZE_Y;k++)
					p[k]=0;
				var u=(function(n,color){
					if(p[n]==0&&map[n]==color){
						var t=1;
						p[n]=1;
						t+=arguments.callee(n-1,color);
						t+=arguments.callee(n+1,color);
						t+=arguments.callee(n-SIZE_X,color);
						t+=arguments.callee(n+SIZE_X,color);
						return t;
					}else{
						return 0;
					}
				})(i*SIZE_X+j,map[i*SIZE_X+j]);
				if(u>=4){
					console.log(u);
					for(k=SIZE_Y-2;k>=0;k--){
						for(l=1;l<SIZE_X-1;l++){
							if(p[k*SIZE_X+l]==1){
								map[k*SIZE_X+l]=0;
							}
						}
					}
					g=true;
				}
			}
		}
	}
	if(g)
		rensa++;
	else
		rensa=0;
}
document.onkeydown=function(e){
	if(rensa==0){
		if(e.keyCode==37){
			x--;
			if(overlap()){
				x++;
			}
		}
		if(e.keyCode==38){
			rotate(puyo[0]);
			if(overlap()){
				rotate(puyo[0]);
				rotate(puyo[0]);
				rotate(puyo[0]);
			}
		}
		if(e.keyCode==39){
			x++;
			if(overlap()){
				x--;
			}
		}
		if(e.keyCode==40){
			y++;
			if(overlap()){
				y--;
			}
		}
	}
};
window.onload = function(){
	stage=document.getElementById("stage");
	next=document.getElementById("next");
	next2=document.getElementById("next2");
	for(i=0;i<SIZE_X*SIZE_Y;i++){
		map[i]=0;
		if(i%SIZE_X==0||i%SIZE_X==SIZE_X-1){
			map[i]=5;
		}
	}
	for(i=0;i<SIZE_X;i++){
		map[i+SIZE_X*(SIZE_Y-1)]=5;
	}
	puyo[0]=[];
	genPuyo(puyo[0]);
	puyo[1]=[];
	genPuyo(puyo[1]);
	puyo[2]=[];
	genPuyo(puyo[2]);
	(function(){
		if(co%30==0){
			if(rensa==0){
				y++;
				if(overlap()){
					y--;
					fix();
					del();
					tsumeru();
					for(i=0;i<3;i++){
						for(j=0;j<3;j++)
							puyo[0][i*3+j]=puyo[1][i*3+j];
					}
					for(i=0;i<3;i++){
						for(j=0;j<3;j++)
							puyo[1][i*3+j]=puyo[2][i*3+j];
					}
					genPuyo(puyo[2]);
					x=4;
					y=1;
					if(overlap()){
						x=-100;
						y=-100;
						for(i=0;i<SIZE_X*SIZE_Y;i++){
							map[i]=i%4+1;
						}
						gameover=true;
					}
				}
			}else{
				del();
				tsumeru();
			}
		}
		stage.innerHTML="";
		next.innerHTML="";
		next2.innerHTML="";
		for(i=2;i<SIZE_Y-1;i++){
			for(j=1;j<SIZE_X-1;j++){
				if(i>=y&&i<y+3&&j>=x&&j<x+3&&puyo[0][((i-y)*3+(j-x))]){
					stage.innerHTML+=KRSW[puyo[0][((i-y)*3+(j-x))]];
				}else{
					stage.innerHTML+=KRSW[map[i*SIZE_X+j]];
				}
			}
			stage.innerHTML+="<br>";
		}
		for(i=0;i<3;i++){
			for(j=0;j<3;j++){
				next.innerHTML+=KRSW[puyo[1][i*3+j]];
			}
			next.innerHTML+="<br>";
		}
		for(i=0;i<3;i++){
			for(j=0;j<3;j++){
				next2.innerHTML+=KRSW[puyo[2][i*3+j]];
			}
			next2.innerHTML+="<br>";
		}
		co++;
		if(gameover){
			return;
		}
		setTimeout(arguments.callee, fps);
	})();
};
