var animation = true;
if( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	$('svg').remove();
	$('.form').show(); 
	fixHeaderHeight();
	animation = false;
}

var s = Snap('#animation');


// for making sure the animation starts once the whole document is loaded and it looks nice... (the svg doesn't display untill everything's positioned and the animation is ready to start.) 

document.addEventListener("DOMContentLoaded", function(event) { 
	if(animation){
		loadStuff();
		s.attr('display','block');
		doTheAnimation();
		setTimeout(fixHeaderHeight,1);
		setTimeout(fixBlurp,1);
	}

});


function loadStuff(){
	s.selectAll('radialGradient').forEach(function(element,i){
		if(i!=5)element.selectAll('stop')[0].attr({
			stopOpacity:0															// makin em stars dissappear
		},0)
	})
	


	//adjusting the sky color: 

	changeFill('#theSky','#66B4F4',0)();

	$('header').height($('#animation').height());



	// makin em dissappear 
	changeViewBox("0 900 2978.84 1704.02",0)();
	s.selectAll('#newPoles_left use,#newPoles_right use').forEach(function(element){element.attr('display','none')});

	//  adjusting buildings and windows


	slide('#skyline',0,650,0)();

	draw('#wires_left path,#wires_right path',0,false,true)();
	draw('#wires_leftData path,#wires_rightData path',0,false,true)();

	// adjusting buildings colors


	//	adjusting constellations

	fadeStroke('#constellations path',0,0)();


	// 	adjusting constellations data

	changeOpacity('#dataConstellations path',0,0)();

	// adjusting the Road Data
	hide('#roadDataMask')();
	changeOpacity('#theCircuits polygon,#dataObject1_elements path,#dataObject2_elements path,#dataObject3_elements path',0,0)();
	// adjusting the colors: 
	changeFill('#dataObject1_elements path,#dataObject2_elements path,#dataObject3_elements path,#extraPiecesObjects polygon','#0B5F63',600)();

	s.selectAll('#roadDataBackground').attr({fill:"#cdddea"});

	// road Data colors: 

	s.selectAll('.extraPieces-3').animate({'fill':'#0b5f63'},0);


	hide('#theCircuits ellipse')();


	// adjusting the Road Data Colors


	// adjusting the poles Data 

	$('.blurpContainer').fadeOut(0);
}

// helper functions

function pwr(a, b) {
  var c = 1;
  for (i = 0; i < b; i++) {
    c *= a;
  }
  return c;
}

function rand(n){
	return Math.floor(Math.random()*n);
}

function randGen(digits) {
	var text='';
	for(var i=0;i<digits;i++){
		text = rand(10) + text;
		if((i+1)%3==0 && i!==digits-1){
			text = ',' + text;
		}
	}
	return text;
}
function randColorGen(){
	var txt ='';
	txt+='rgb(' + (100+rand(156)) + ',' + (100+rand(156) )+ ',' + (100+rand(156)) +')';
	return txt;
}


function Translate(x,y){
	return 'matrix(1,0,0,1,'+ x +',' + y + ')';
}

function hide(selector){
	return function(){
		s.selectAll(selector).attr({display:'none'});
	}
}
function show(selector){
	return function(){
		s.selectAll(selector).attr({display:'block'});
	}
}


function fadeFill(selector,alpha,duration){
	return function(){
		s.selectAll(selector).animate({
			fillOpacity:alpha,

		},duration);
	}
}

function changeOpacity(selector,alpha,duration,easing){
	easing = easing ? easing : mina.linear;
	return function(){
		s.selectAll(selector).animate({
			opacity: alpha
		},duration);
	}
}

function changeOpacityElement(element,alpha,duration,easing){
	easing = easing ? easing : mina.linear;
	return function(){
		element.animate({
			opacity: alpha
		},duration);
	}
}

function fadeStroke(selector,alpha,duration){
	return function(){
		s.selectAll(selector).animate({
			strokeOpacity:alpha,
		},duration);
	}
}
function slide(selector,x,y,duration,easing){
	if (easing === undefined){easing = mina.linear};
	return function(){
		s.selectAll(selector).animate({
			transform: Translate(x,y)
		},duration,easing);
	}
}
function changeViewBox(values,duration){
	return function() {
		s.animate({
			viewBox: values,
		},duration)
	}
}
function changeFill(selector,color,duration){
	return function() {
		s.selectAll(selector).animate({
			fill: color,
		},duration)
	}
}
function changeStroke(selector,color){
	return function() {
		s.selectAll(selector).attr({style:'stroke:'+color});
		// s.selectAll(selector).animate({
		// 	style: 'stroke : ' + color,
		// },duration);
	}
}

function changeScale(selector,scaleValx,scaleValy,x,y,duration){
	return function(){
		s.selectAll(selector).animate({
			transform:scale(scaleValx,scaleValy,x,y),
		},duration)
	}
}

function setDasharray(selector,length,duration){
	return function(){
		s.selectAll(selector).animate({
			'stroke-dasharray': length,
		},duration);
	}
}

function setDashoffset(selector,length,duration){
	return function(){
		s.selectAll(selector).animate({
			'stroke-dashoffset': length,
		},duration);
	}
}

function setTimeoutFixed() {
	//first param = function
	var func = arguments[0];
	var params =[];
	for (var i = 1 ; i < arguments.length - 1; i++){
		params.push(arguments[i]);
	}
	var delay = arguments[arguments.length - 1];
	setTimeout(function(){func.apply(null,params)},delay);
}

function draw(selector,duration,reverse,out,color,easing){
	if (color == undefined) { color = '#00FFFF'};
	if (easing == undefined) { easing = mina.linear};
	return function(){
		var elements = s.selectAll(selector);
		elements.forEach(function(element){
			var length = element.getTotalLength();
			var offsetInit;
			var offsetFinal;
			if(reverse && !out ){
				offsetInit = -length;
				offsetFinal = 0;
			}else if(reverse && out){
				offsetInit = 0;
				offsetFinal = length;
			}else if(!reverse && out){
				offsetInit = 0;
				offsetFinal = -length;
			}else if (!reverse && !out){
				offsetInit = length;
				offsetFinal = 0;
			}
			element.attr({
				'stroke-dasharray':length,
				'stroke-dashoffset':offsetInit,
				'stroke': color 
			});
			element.animate({'stroke-dashoffset': offsetFinal }, duration,easing);
		})	
	}
}



function drawElement(element,duration,reverse,out,color,easing){
	if (color == undefined) { color = '#00FFFF'};
	if (easing == undefined) { easing = mina.linear};
	if (reverse == undefined) { reverse = false};
	if (out == undefined) { out = false};
	return function(){
		var length = element.getTotalLength();
		var offsetInit;
		var offsetFinal;
		if(reverse && !out ){
			offsetInit = -length;
			offsetFinal = 0;
		}else if(reverse && out){
			offsetInit = 0;
			offsetFinal = length;
		}else if(!reverse && out){
			offsetInit = 0;
			offsetFinal = -length;
		}else if (!reverse && !out){
			offsetInit = length;
			offsetFinal = 0;
		}
		element.attr({
			'stroke-dasharray':length,
			'stroke-dashoffset':offsetInit,
			'stroke': color 
		});
		element.animate({'stroke-dashoffset': offsetFinal }, duration,easing);
	}
}

function showHydroPoles(){
	var polesLeft = s.selectAll('#newPoles_left use');
	var nLeft = polesLeft.length;
	for (var i = 0  ; i < nLeft ; i++){setTimeoutFixed(function(j){polesLeft[nLeft-j-1].attr('display','block');},i,100*i);
	}
	var polesRight = s.selectAll('#newPoles_right use');
	var nRight = polesRight.length;
	for (var i = 0  ; i < nRight ; i++){setTimeoutFixed(function(j){polesRight[nRight-j-1].attr('display','block');},i,100*i);
	}
}

function window1(duration){
	var n = s.selectAll('#building_farLeft path').length;
	var interval = duration/n;
	for (var i = 1; i <=n; i++){
		setTimeout(changeFill('#building_farLeft path:nth-of-type('+i+')','#00FFFF',interval),interval*i);
	}
		for (var i = 1; i <=n; i++){
		setTimeout(changeFill('#building_farLeft path:nth-of-type('+i+')','black',interval),n*interval+interval*i/3);
	}
}

function window2(duration){
	var n = s.selectAll('#building04 line').length;
	var interval = duration/n;
	for (var i = 1; i < n+1 ; i++){
		setTimeout(changeStroke('#building04 line:nth-of-type('+(n+1-i)+')','#00FFFF'),i*interval);
	}
	for (var i = 1; i < n+1 ; i++){
		setTimeout(changeStroke('#building04 line:nth-of-type('+(n+1-i)+')','#000000'),n*interval+i*interval);
	}
}


function window12(duration){
	var n = s.selectAll('#building07 rect').length;
	var interval = duration/n;
	for (var i = 1; i <=n; i++){
		setTimeout(changeFill('#building07 rect:nth-of-type('+i+')','#00FFFF',interval),interval*i);
	}
		for (var i = 1; i <=n; i++){
		setTimeout(changeFill('#building07 rect:nth-of-type('+i+')','black',interval),n*interval+interval*i/3);
	}
}



function window3(duration){
	var n = s.selectAll('#building06 rect').length;
	var interval = duration/n;
	for (var i = 1; i <=n; i++){
		setTimeout(changeFill('#building06 rect:nth-of-type('+i+')','#00FFFF',interval),interval*i);
	}
		for (var i = 1; i <=n; i++){
		setTimeout(changeFill('#building06 rect:nth-of-type('+i+')','black',interval),n*interval+interval*i);
	}
}

function window4(duration){
	var n = s.selectAll('#building03 line').length;
	var interval = duration/n;	
	for (var i = 1; i < n+1 ; i++){
		setTimeout(changeStroke('#building03 line:nth-of-type('+i+')','#00FFFF'),i*interval);
	}
	for (var i = 1; i < n+1 ; i++){
		setTimeout(changeStroke('#building03 line:nth-of-type('+i+')','#000000'),n*interval+i*interval/3);
	}
}

function window5(duration){
	var n = 8;
	var interval = duration/n;
	for (var i = 1; i < 9 ; i++){
		setTimeout(changeFill('#_'+i+'-2','#00FFFF',100),i*interval);
	}
	for (var i = 1; i < 9 ; i++){
		setTimeout(changeFill('#_'+i+'-2','black',100),interval*n+i*interval/3);
	}
}

function window6(){
	var numberRight = s.selectAll('#building02 .right line').length;
	for (var i = 1; i < numberRight+1 ; i++){
		setTimeout(changeStroke('#building02 .right line:nth-of-type('+i+')','#00FFFF'),i*1);
	}
	for (var i = 1; i < numberRight+1 ; i++){
		setTimeout(changeStroke('#building02 .right line:nth-of-type('+i+')','#000000'),numberRight*1+i*1);
	}
	var numberLeft = s.selectAll('#building02 .left line').length;
	for (var i = 1; i < numberLeft+1 ; i++){
		setTimeout(changeStroke('#building02 .left line:nth-of-type('+i+')','#00FFFF'),shift(numberRight*2*1,i*1));
	}
	for (var i = 1; i < numberLeft+1 ; i++){
		setTimeout(changeStroke('#building02 .left line:nth-of-type('+i+')','#000000'),shift(numberRight*2*1,numberLeft*1+i*1));
	}
}

function window7(duration){
	var n = 6;
	interval = duration/n;
	for (var i = 1; i < n+1 ; i++){
		setTimeout(changeFill('#vShape_0'+i+' rect','#00FFFF',100),interval*i);
	} 
	for (var i = 1; i < n+1 ; i++){
		setTimeout(changeFill('#vShape_0'+i+' rect','black',100),n*interval + interval*i);
	}
}

function window8(duration){
	var n = s.selectAll('#window8 rect').length;
	interval = duration/n;
	for (var i = 1; i < n+1 ; i++){
		setTimeout(changeFill('#window8 rect:nth-child('+i+')','#00FFFF',100),interval*i);
	} 
	for (var i = 1; i < n+1 ; i++){
		setTimeout(changeFill('#window8 rect:nth-child('+i+')','black',100),n*interval + interval*i);
	}
}


function CNLit(){
	var i = 0
	setInterval(function(){
		var colors = ['#ff6666','#0066ff','#00cc00','#ff33cc','#ffff00'];
		s.selectAll('#CN_tower-2').animate({fill:colors[i]},800);
		i++;
		if(i>4){i=0};
	},1000)
}


function drawCircuit(selector,duration,reverse,out,color,easing){
	if (color == undefined) { color = '#00FFFF'};
	if (easing == undefined) { easing = mina.linear};
	if (reverse == undefined) { reverse = false};
	if (out == undefined) { out = false};

	var elements = s.selectAll(selector + ' path');
	var n = elements.length;
	var interval = duration/n;
	elements.forEach(function(element,index){
		setTimeout(drawElement(element,interval,reverse,out),index*interval);
	})
}


function polesData(duration,out){
	if (out == undefined) out = false;
	var n = 6
	interval = duration/n;
	for (var i = 1; i < n+1 ; i++){
		setTimeout(draw('#poles_0'+i+' path',interval,false,out),i*interval-interval);
	}
}

function addClass(selector,name){
	s.selectAll(selector).forEach(function(e){
		e.addClass(name);	
	})
}
function removeClass(selector,name){
	s.selectAll(selector).forEach(function(e){
		e.removeClass(name);	
	})
}


function roadCircuit(){

	setTimeout(function(){drawCircuit('#roadCircuit1Left',300,null,null,null,mina.easeinout)},0);
	setTimeout(function(){drawCircuit('#roadCircuit1Right',300,null,null,null,mina.easeinout)},0);
	setTimeout(function(){drawCircuit('#roadCircuit2Left',300,null,null,null,mina.easeinout)},300);
	setTimeout(function(){drawCircuit('#roadCircuit2Right',300,null,null,null,mina.easeinout)},300);

	setTimeout(changeOpacity('#dataObject1_base polygon',0.5,800),500);

	setTimeout(function(){drawCircuit('#roadCircuit2Right2',300,null,null,null,mina.easeinout)},600);
	setTimeout(function(){drawCircuit('#roadCircuit3Left',300,null,null,null,mina.easeinout)},600);
	setTimeout(function(){drawCircuit('#roadCircuit3Right',300,null,null,null,mina.easeinout)},600);
	setTimeout(function(){drawCircuit('#roadCircuit3Left2',300,null,null,null,mina.easeinout)},700);

	setTimeout(changeOpacity('#dataObject2_base polygon',0.5,800),1000);


	setTimeout(function(){drawCircuit('#roadCircuit4Right',300,null,null,null,mina.easeinout)},900);
	setTimeout(function(){drawCircuit('#roadCircuit4Left',300,null,null,null,mina.easeinout)},900);
	setTimeout(function(){drawCircuit('#roadCircuit5Right',300,null,null,null,mina.easeinout)},1200);

	setTimeout(changeOpacity('#dataObject3_base polygon',0.5,800),1300);

	setTimeout(changeOpacity('#dataObject1_elements path:nth-child(1)',1,300),1300);
	setTimeout(changeOpacity('#dataObject1_elements path:nth-child(2)',1,300),1400);
	setTimeout(changeOpacity('#dataObject1_elements path:nth-child(3)',1,300),1500);
	setTimeout(changeOpacity('#dataObject1_elements path:nth-child(4)',1,300),1600);

	setTimeout(changeOpacity('#dataObject3_elements path',1,300),1700);


	setTimeout(changeOpacity('#dataObject2_elements path:nth-child(1)',1,300),1800);
	setTimeout(changeOpacity('#dataObject2_elements path:nth-child(2)',1,300),1900);
	setTimeout(changeOpacity('#dataObject2_elements path:nth-child(3)',1,300),2000);

	setTimeout(function(){extraPieces(1,1000)},2000)

	setTimeout(draw('#roadCircuit1Left path,#roadCircuit1Right path,#roadCircuit2Left path,#roadCircuit2Right2 path,#roadCircuit2Right path,#roadCircuit3Right path,#roadCircuit3Left path,#roadCircuit3Left2 path,#roadCircuit4Left path,#roadCircuit4Right path,#roadCircuit5Right path',1000,false,true,null,mina.easeinout),2100);

	setTimeout(changeOpacity('#dataObject1_base polygon',0,800),2500);
	setTimeout(changeOpacity('#dataObject2_base polygon',0,800),2500);
	setTimeout(changeOpacity('#dataObject3_base',0,800),2500);

}
var hoverBool = true;
function hover(selector,bool){
	s.selectAll(selector).animate({transform:Translate(0,-30)},500,mina.easeinout);
	setTimeout(function(){s.selectAll(selector).animate({transform:Translate(0,0)},500,mina.easeinout,function(){
			if(bool){hover(selector,hoverBool)}})
		},500);
}

function dataPiecesMove(interval){

	setTimeout(function(){changeShape('#dataObject1_elements path:nth-child(1)',"M2309.1 520.31 L2162.97 525.89 L2257.93 583.24 L2309.1 520.31Z",300)},0*interval);
	setTimeout(function(){changeShape('#dataObject1_elements path:nth-child(2)',"M2302.17 671.35 L2169.43 639.22 L2252.48 714.7 L2302.17 671.35Z",300)},1*interval);
	setTimeout(function(){changeShape('#dataObject1_elements path:nth-child(3)',"M2272.75 787.02 L2158.79 822.78 L2297.84 876.35 L2272.75 787.02Z",300)},2*interval);
	setTimeout(function(){changeShape('#dataObject1_elements path:nth-child(4)',"M2276.59 919.65 L2160.52 975.88 L2238.36 1039.42 L2276.59 919.65Z",300)},3*interval);

	setTimeout(function(){changeShape('#dataObject2_elements path:nth-child(1)',"M829.25 694.32 L907.09 757.87 L957.52 671.16 L829.25 694.32Z",300)},4*interval);

	setTimeout(function(){changeShape('#dataObject2_elements path:nth-child(2)',"M823.96 541.87 L901.8 605.42 L905 543.67 L823.96 541.87Z",300)},5*interval);

	setTimeout(function(){changeShape('#dataObject2_elements path:nth-child(3)',"M861.91 777.39 L871.47 892.8 L951.14 858.2 L861.91 777.39Z",300)},6*interval);


	setTimeout(function(){changeShape('#dataObject3_elements path:nth-child(1)',"M925.83 924.22 L839.81 1021.79 L917.65 1021.79 L925.83 924.22Z",300)},7*interval);

	setTimeout(draw('#dataObject1_elements path,#dataObject2_elements path,#dataObject3_elements path',300),7*interval+300);
}

function changeShape(selector,pts,duration){
	s.selectAll(selector).animate({d:pts},duration);
}
function changeShapeElement(element,pts,duration,easing){
	if (easing==undefined) easing = mina.linear; 
	element.animate({d:pts},duration,easing);
}

var finalPoints =[

	"M1423.57 922.0 L1423.49 816.82 L1476.13 869.45 L1423.57 922.0Z",
	"M1624.6 838.82 L1550.33 764.35 L1550.29 838.78 L1624.6 838.82Z",
	"M1624.57 839.03 L1550.37 913.58 L1550.25 839.14 L1624.57 839.03Z",
	"M1476.52 764.77 L1550.26 839.78 L1550.83 765.35 L1476.52 764.77Z",
	"M1550.73 838.96 L1476.63 913.62 L1551.07 913.28 L1550.73 838.96Z",
	"M1581.94 974.45 L1476.76 974.5 L1529.45 1027.06 L1581.94 974.45Z",
	"M1476.04 975.0 L1476.13 869.83 L1423.49 922.46 L1476.04 975.0Z",
	"M1476.04 763.95 L1476.13 869.13 L1423.49 816.5 L1476.04 763.95Z",
	"M1778.87 660.11 L1779.32 765.3 L1831.68 712.4 L1778.87 660.11Z",
	"M1779.41 765.99 L1779.85 871.17 L1832.22 818.27 L1779.41 765.99Z",
	"M1779.65 838.07 L1705.12 763.85 L1779.55 763.76 L1779.65 838.07Z",
	"M1706.39 976.38 L1779.9 901.15 L1780.7 975.58 L1706.39 976.38Z",
	"M1704.55 763.25 L1705.16 868.43 L1652.27 816.07 L1704.55 763.25Z",
	"M1653.27 817.73 L1653.72 922.91 L1706.09 870.02 L1653.27 817.73Z",
	"M1706.01 870.3 L1706.62 975.48 L1653.72 923.11 L1706.01 870.3Z",
	"M1831.07 606.85 L1831.68 712.03 L1778.79 659.67 L1831.07 606.85Z",
	"M1832.14 817.9 L1831.69 712.72 L1779.32 765.62 L1832.14 817.9Z",
	"M1779.94 871.82 L1780.39 977.0 L1832.75 924.11 L1779.94 871.82Z",
	"M1832.67 923.74 L1832.22 818.56 L1779.85 871.45 L1832.67 923.74Z",
	"M1310.5 974.5 L1310.42 869.31 L1363.05 921.94 L1310.5 974.5Z",
	"M1310.38 902.4 L1236.23 977.0 L1310.67 976.72 L1310.38 902.4Z",
	"M1236.42 764.46 L1310.31 839.33 L1310.74 764.9 L1236.42 764.46Z",
	"M1235.67 977.6 L1235.75 872.42 L1183.11 925.05 L1235.67 977.6Z",
	"M1184.11 923.39 L1184.03 818.2 L1236.66 870.84 L1184.11 923.39Z",
	"M1236.58 870.55 L1236.66 765.37 L1184.03 818.0 L1236.58 870.55Z",
	"M1310.5 868.65 L1310.42 763.47 L1363.05 816.1 L1310.5 868.65Z",
	"M1362.97 816.48 L1363.05 921.66 L1310.42 869.02 L1362.97 816.48Z",
	"M1310.5 1080.36 L1310.42 975.18 L1363.05 1027.82 L1310.5 1080.36Z",
	"M1468.88 1132.81 L1363.69 1132.86 L1416.39 1185.42 L1468.88 1132.81Z",
	"M1362.97 1133.37 L1363.05 1028.18 L1310.42 1080.82 L1362.97 1133.37Z",
	"M1362.97 922.31 L1363.05 1027.5 L1310.42 974.86 L1362.97 922.31Z"

]

function shapingTheLogo(){
	var selector = '#dataConstellations path,#dataObject1_elements path,#dataObject2_elements path,#dataObject3_elements path';
	var elements = s.selectAll(selector);


	elements.forEach(function(element,index){
		setTimeoutFixed(changeShapeElement,element,finalPoints[index],300,mina.easeinout,40*index);
	})
	setTimeout(draw(selector,1000),1500);
}

function logoDisappear(argument){
	var selector = '#dataConstellations path,#dataObject1_elements path,#dataObject2_elements path,#dataObject3_elements path';
	var elements = s.selectAll(selector);
	elements.animate({'opacity': argument},1000);
}

function move(selector,x,y,duration,easing){
	if(easing==undefined) easing = mina.linear;
	s.selectAll(selector).animate({transform:Translate(x,y)},duration,easing);
}

function shift(number,tobeAdded){
	return number+tobeAdded;
}

function scale(scalex,scaley,x,y){
	return "matrix("+scalex+", 0, 0,"+scaley+", "+ (x-scalex*x) +"," + (y-scaley*y) +")";
}


function blurp(content,length){
	var element = $('.blurpContainer .blurp');
	element.text(content).removeClass('left').addClass('right');
	$('.blurpContainer').fadeIn(200);
	element.removeClass('right').addClass('center');
	setTimeout(function(){element.removeClass('center').addClass('left');},length-300);
	setTimeout(function(){$('.blurpContainer').fadeOut(200);},length-200);

}

function extraPieces(alpha,duration){

	var bases = s.selectAll('#extraPiecesBase polygon');
	var objects = s.selectAll('#extraPiecesObjects polygon');
	var interval = duration/bases.length/2;	
	for (var i = 0 ; i < bases.length;i++){
		setTimeout(changeOpacityElement(bases[i],alpha,300),(i+1)*interval);
	}
	for (var i = 0 ; i < objects.length;i++){
		setTimeout(changeOpacityElement(objects[i],alpha,300),(i+1)*interval);
	}

}


function dataPiecesColorChange(){

	changeFill('#dataObject1_elements path,#dataObject2_elements path,#dataObject3_elements path,#extraPiecesObjects polygon','cyan',600)();
	setTimeout(changeFill('#dataObject1_elements path,#dataObject2_elements path,#dataObject3_elements path,#extraPiecesObjects polygon','#0B5F63',600),600);

}





// The animation itself: 

function doTheAnimation(){		

	var step1 = 0;
	var off1 = 0; 
	// road starting time: 0-600 

	setTimeout(fadeFill('#road-3',1,200),shift(100,step1));
	// setTimeout(slide('#road-3',485.22,74.02,200),shift(100,step1));
	// setTimeout(slide('#newRoads',-2869,1211,200),shift(100,step1));

	var step2 = 700 ;
	var off2 = 0;

	//lane paint: 700-1000
	//diff: 900

	setTimeout(fadeFill('#lane_paint_path',1,300),shift(0,step2));
	setTimeout(fadeFill('#newRoads path',1,300),shift(0,step2));

	var step3 = 1000 + off2;
	// Tdott : 1000-2400
	//diff : 1400
	setTimeout(slide('#extra_buildings',0,-660,300),shift(0,step3));

	setTimeout(show('#skyline'),shift(0,step3));
	for (var i=1;i<13;i++){
		if(i<10){
			setTimeout(slide('#skyline #group0'+i,0,-640,200),shift(i*100,step3));
		} else{
			setTimeout(slide('#skyline #group'+i,0,-640,200),shift(i*100 ,step3));
		}
	}
	for (var i = 1 ; i < 6 ; i++){
		setTimeout(slide('#skyline #window'+i,0,-650,200),shift(500+i*100,step3));
	}
	setTimeout(slide('#skyline #CN_tower',0,-650,200),shift(12*100,step3));
	setTimeout(slide('#windows',0,-640,200),shift(12*100,step3));

	var step4 = 2400 + off2 ;
	var off4 = 0;

	// Hydro Poles and their wires : 2200-2500
	//diff : 300

	setTimeout(showHydroPoles,shift(step4,0));
	setTimeout(changeOpacity('.hydroShadows',1,300),shift(step4,500));
	setTimeout(draw('#new_wires path',1000,false,false,'black'),shift(step4,0));

	setTimeout(function(){blurp('Customized Predictive Solutions',1800)},shift(3600,0));



	var off5=2500;
	var step5 = 5400 + off2 ;
	//sunset : 2500-3100
	// diff: 600


	setTimeout(changeFill('#theSky','#F55320',700),shift(0,step5));
	setTimeout(slide('#cloud_pattern',3100,3100,4400,mina.easeout),shift(-2300,step5));
	setTimeout(fadeFill('#cloud_pattern',0.8,1400),shift(-910,step5));
	setTimeout(changeFill('#theSky','#000D29',900),shift(1200,step5));
	setTimeout(changeFill('#roadDataBackground','#02223C',900),shift(1000,step5));
	// change of the colors : 

	setTimeout(function(){ addClass('.newRoad','newRoadNight') ; removeClass('.newRoadNight','newRoadMask')},shift(1000,step5));
	setTimeout(function(){ addClass('.secondRoad','secondRoadNight') ; removeClass('.secondRoadNight','secondRoad')},shift(1000,step5));
	setTimeout(function(){ addClass('.buildingsBehind','buildingsBehindNight') ; removeClass('.buildingsBehindNight','buildingsBehind')},shift(1000,step5));
	setTimeout(function(){ addClass('.buildingsFront','buildingsFrontNight') ; removeClass('.buildingsFrontNight','buildingsFront')},shift(1000,step5));
	setTimeout(function(){ addClass('.roadBackground','roadBackgroundNight') ; removeClass('.roadBackgroundNight','roadBackground')},shift(1000,step5));
	setTimeout(function(){ addClass('.buildingsPrimary','buildingsPrimaryNight') ; removeClass('.buildingsPrimaryNight','buildingsPrimary')},shift(1000,step5));
	setTimeout(function(){ addClass('.buildingsSecondary','buildingsSecondaryNight') ; removeClass('.buildingsSecondaryNight','buildingsSecondary')},shift(1000,step5));
	setTimeout(function(){ addClass('.buildingsThird','buildingsThirdNight') ; removeClass('.buildingsThirdNight','buildingsThird')},shift(1000,step5));
	setTimeout(function(){ addClass('.windows','windowsNight') ; removeClass('.windowsNight','windows')},shift(1000,step5));
	setTimeout(function(){ addClass('.demWindows','demWindowsNight') ; removeClass('.demWindowsNight','demWindows')},shift(1000,step5));

	setTimeout(function(){removeClass('.windowsNight','windowsNight')},shift(1600,step5));
	setTimeout(function(){removeClass('.demWindowsNight','demWindowsNight')},shift(1600,step5));


	setTimeout(function(){s.selectAll('#backgroundGradient stop')[0].animate({'stopOpacity':0},400)},shift(700,step5));
	setTimeout(function(){s.selectAll('#backgroundGradient stop').attr({'stop-color':'#3fa9f5'})},shift(1100,step5));
	setTimeout(function(){s.selectAll('#backgroundGradient stop')[0].animate({'stopOpacity':1},400)},shift(1200,step5));

	setTimeout(fadeFill('#cloud_pattern',0.0,800),shift(1000,step5)); 

	setTimeout(show('#roadDataMask'),shift(1900,step5));	




	setTimeout(function(){blurp('Models in 8-10 weeks',1900)},shift(8500,0));



	// appearance of the stars

	var step6 =  5300  + off5;
	var off6 = 0 ; 


	setTimeout(function(){s.selectAll('radialGradient stop')[2].animate({stopOpacity:1},1000)},shift(-1000,step6));
	setTimeout(function(){s.selectAll('radialGradient stop')[4].animate({stopOpacity:1},500)},shift(-500,step6));
	setTimeout(function(){s.selectAll('radialGradient stop')[6].animate({stopOpacity:1},500)},shift(1300,step6));
	setTimeout(function(){setInterval(function(){s.selectAll('radialGradient stop')[0].animate({stopOpacity:1},500)},1000)},shift(1000,step6));
	setTimeout(function(){setInterval(function(){s.selectAll('radialGradient stop')[0].animate({stopOpacity:0},500)},1000)},shift(1500,step6));




	// windows
	setTimeoutFixed(window8,300,shift(500,step6));
	setTimeoutFixed(window1,300,shift(500,step6));
	setTimeoutFixed(window2,500,shift(700,step6));
	setTimeoutFixed(window3,500,shift(800,step6));
	setTimeoutFixed(window4,500,shift(1200,step6));
	setTimeoutFixed(window5,350,shift(1400,step6));
	setTimeout(window6,shift(1800,step6));
	setTimeoutFixed(window7,500,shift(2100,step6));
	// setTimeout(CNLit,shift(1800,step6));

	// road and poles 

	setTimeout(draw('#wires_leftData-2 path,#wiresData_02 path',2000,false,false,'#40bfd5',mina.easeinout),shift(step6,2300));
	setTimeout(function(){polesData(1500)},shift(step6,2300));
	setTimeout(draw('#wires_leftData-3 path,#wiresData_01 path',2000,false,false,'#40bfd5',mina.easeinout),shift(step6,3300));
	setTimeout(function(){roadCircuit()},shift(step6,2900));
	setTimeout(draw('#wires_leftData-2 path,#wiresData_02 path',1000,false,true,'#40bfd5',mina.easeinout),shift(step6,7600));
	setTimeout(draw('#wires_leftData-3 path,#wiresData_01 path',1000,false,true,'#40bfd5',mina.easeinout),shift(step6,7600));
	setTimeout(function(){polesData(1000,true)},shift(step6,7600));


	setTimeout(function(){blurp('Rich Visual Storytelling.',2800)},shift(0,15600));


	setTimeout(changeFill('#roadDataBackground','#0A8888',1000),shift(3900,step6));
	setTimeout(changeFill('#roadDataBackground','#02223C',500),shift(4500,step6));





	var off7 = 0;
	var step7 = 13000 + off2  + off5;

	setTimeout(dataPiecesColorChange,shift(step7,1300));




	var off8 = 0;
	var step8 = 17000 + off5;
	// change point of view : 3100-3600
	// diff : 500
	setTimeout(function(){extraPieces(0,1000)},shift(step8,-2000));

	setTimeout(changeViewBox("0 300 2978.84 1704.02",500),shift(-1500,step8));
	setTimeout(function(){dataPiecesMove(250)},shift(-1500,step8));

	// setTimeout(function(){blurp('Be an Expert in 10 Minutes!',2600)},shift(20500,0));


	var step9 = 16000 + off5 + off8;
	//appearance of dem constellations : 7000-
	//diff : who cares? it's looking awesome! 

	setTimeout(function(){s.selectAll('radialGradient stop')[2].animate({stopOpacity:0.2},500)},shift(0,step9));
	setTimeout(function(){s.selectAll('radialGradient stop')[4].animate({stopOpacity:0.2},500)},shift(0,step9));
	setTimeout(function(){s.selectAll('radialGradient stop')[6].animate({stopOpacity:0.2},500)},shift(0,step9));
	setTimeout(function(){s.selectAll('radialGradient stop')[8].animate({stopOpacity:1},500)},shift(500,step9));
	setTimeout(fadeStroke('#constellations path',1,0),shift(-1200,step9));
	setTimeout(draw('#constellations path',0,false,true),shift(-1200,step9));
	setTimeout(draw('#constellations path',700,false,false),shift(1200,step9));
	setTimeout(changeOpacity('#dataConstellations path',1,300),shift(1400,step9));
	setTimeout(draw('#dataConstellations path',400,false,false),shift(1800,step9));

	setTimeout(shapingTheLogo,shift(2100,step9));

	setTimeout(function(){
		s.addClass('blur');
		$('.form').show();
		fixHeaderHeight();
		$('.form').fadeOut(0);
		logoDisappear(0);
		$('.form').fadeIn(1500)
	},shift(5000,step9));

}


// fixing the sizing problem : 


function max(a,b){
	return a>b ? a : b ; 
}

window.onresize = function(){
	fixHeaderHeight();
	fixBlurp();
}
$(window).scroll(function(){
	fixBlurp();
});

function fixHeaderHeight(){
	if($('.form').css('display')!='none') {
		$('header').height(max($('.form').height(),$('#animation').height()));
	} else { $('header').height($('#animation').height())}
}

function fixBlurp(){
	var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
	if($('svg').height()-scrollTop>$(window).height()){
		$('.blurpContainer').addClass('blurpFixed');
	}else{
		$('.blurpContainer').removeClass('blurpFixed');
	}
}


