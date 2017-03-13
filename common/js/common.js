/**
* 手机端尺寸调整
*/
var dpr = window.devicePixelRatio;//获取像素比
dpr = dpr ? dpr : 1;
if(dpr == 3){//dpr==3的按照2的处理
	dpr = 2;
	window.devicePixelRatio = 2;
}
if(dpr == 2){
	document.documentElement.style.fontSize = document.documentElement.clientWidth/640 * 32 + 'px';
}else{
	document.documentElement.style.fontSize = '16px';
}

document.body.style.minHeight = window.innerHeight + 'px';//body最小高度与窗口一样高



