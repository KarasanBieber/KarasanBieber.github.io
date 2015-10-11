function rotate(type){
	var t=[];
	var i,j;
	for(i=0;i<5;i++){
		for(j=0;j<5;j++){
			t[i*5+j]=type[(4-j)*5+i];
		}
	}
	return t;
}
var stage,nextBox;
var fps=1000/60;
var SIZE_X=10;
var SIZE_Y=23;
var FONT_SIZE=20;
var KRSW=["　","唐","澤","貴","洋"];
var TET=[
	[
	0,0,0,0,0,
	0,0,0,0,0,
	0,1,2,3,4,
	0,0,0,0,0,
	0,0,0,0,0],
	[
	0,0,0,0,0,
	0,0,0,0,0,
	0,0,1,2,0,
	0,0,3,4,0,
	0,0,0,0,0],
	[
	0,0,0,0,0,
	0,0,0,0,0,
	0,0,1,2,0,
	0,3,4,0,0,
	0,0,0,0,0],
	[
	0,0,0,0,0,
	0,0,0,0,0,
	0,1,2,0,0,
	0,0,3,4,0,
	0,0,0,0,0],
	[
	0,0,0,0,0,
	0,0,0,0,0,
	0,1,2,3,0,
	0,0,0,4,0,
	0,0,0,0,0],
	[
	0,0,0,0,0,
	0,0,0,0,0,
	0,1,2,3,0,
	0,4,0,0,0,
	0,0,0,0,0],
	[
	0,0,0,0,0,
	0,0,0,0,0,
	0,1,2,3,0,
	0,0,4,0,0,
	0,0,0,0,0]];
var map=new Array(SIZE_X*SIZE_Y);
var ne=[Math.floor(Math.random()*7),Math.floor(Math.random()*7)];
var tet=TET[ne[0]];
var i,j;
var co=1;
var x=3,y=0;
var gameover=false;
function overlap(){
	var z=false;
	for(i=0;i<Math.min(5,SIZE_Y-y);i++){
		for(j=Math.max(0,-x);j<Math.min(5,SIZE_X-x);j++){
			if(tet[i*5+j]&&map[(y+i)*SIZE_X+j+x]){
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
	for(i=0;i<Math.min(5,SIZE_Y-y);i++){
		for(j=Math.max(0,-x);j<Math.min(5,SIZE_X-x);j++){
			if(tet[i*5+j]){
				map[(y+i)*SIZE_X+j+x]=tet[i*5+j];
			}
		}
	}
}
function del(){
	var k;
	for(i=0;i<SIZE_Y-1;i++){
		for(j=1;j<SIZE_X-1;j++){
			if(!map[i*SIZE_X+j]){
				break;
			}
		}
		if(j==SIZE_X-1){
			for(j=i;j>0;j--){
				for(k=0;k<SIZE_X;k++){
					map[j*SIZE_X+k]=map[(j-1)*SIZE_X+k];
				}
			}
			for(j=0;j<SIZE_X;j++){
				map[j]=0;
			}
			map[0]=1;
			map[SIZE_X-1]=1;
		}
	}
}
document.onkeydown=function(e){
	if(e.keyCode==37){
		x--;
		if(overlap()){
			x++;
		}
	}
	if(e.keyCode==38){
		tet=rotate(tet);
		if(overlap()){
			tet=rotate(rotate(rotate(tet)));
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
};
window.onload = function(){
	stage=document.getElementById("stage");
	nextBox=document.getElementById("next");
	for(i=0;i<SIZE_X*SIZE_Y;i++){
		map[i]=0;
		if(i%SIZE_X==0||i%SIZE_X==SIZE_X-1){
			map[i]=1;
		}
	}
	for(i=0;i<SIZE_X;i++){
		map[i+SIZE_X*(SIZE_Y-1)]=1;
	}
	(function(){
		stage.innerHTML="";
		nextBox.innerHTML="";
		if(co%30==0){
			y++;
			if(overlap()){
				y--;
				fix();
				del();
				ne[0]=ne[1];
				ne[1]=Math.floor(Math.random()*7);
				tet=TET[ne[0]];
				x=3;
				y=1;
				if(overlap()){
					x=-100;
					y=-100;
					for(i=0;i<SIZE_X*SIZE_Y;i++){
						map[i]=1;
					}
					gameover=true;
				}
			}
		}
		
		for(i=3;i<SIZE_Y;i++){
			for(j=0;j<SIZE_X;j++){
				if(i>=y&&i<y+5&&j>=x&&j<x+5&&tet[((i-y)*5+(j-x))]){
					stage.innerHTML+=KRSW[tet[((i-y)*5+(j-x))]];
				}else{
					stage.innerHTML+=KRSW[map[i*SIZE_X+j]];
				}
			}
			stage.innerHTML+="<br>";
		}
		for(i=0;i<5;i++){
			for(j=0;j<5;j++){
				nextBox.innerHTML+=KRSW[TET[ne[1]][i*5+j]];
			}
			nextBox.innerHTML+="<br>";
		}
		co++;
		if(gameover){
			return;
		}
		setTimeout(arguments.callee, fps);
	})();
};
