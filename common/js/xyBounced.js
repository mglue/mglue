var xy = (function(){

	/**
	 * 创建弹框元素
	 * @param opts 设置
	 * @param content 弹框内容
	 * {
	 * 	logo: {width: *, height:*, src:*},---------------------------------logo图片样式
	 * 	header: {height: *, backgroundColor:*},----------------------------标题框样式
	 * 	delayTime: * 		-----------------------------------------------弹框持续时间
	 * 	bounced: {backgroundImg:[背景图片路径], width: *, height: *}-------弹框样式
	 * 	showshade: true/false--------------------------------------------- 是否显示遮罩层
	 * 	close: function(){} ---------------------------------------------- 关闭事件，对象class取名必须包含bounced-close
	 * 	ok :  function(){} ----------------------------------------------- 确定事件，对象class取名必须包含bounced-ok
	 * }
	 * @private
     */
	function _createElement(content, opts){

		var shade = document.createElement('div'),
			bounced = document.createElement('div'),
			bouncedHeader = document.createElement('div'),
			bouncedContent = document.createElement('div'),
			bouncedLogo = document.createElement('img');

		var borderRadius = '5px',
			headerCss = '',
			logoCss = '',
			bouncedCss = '',
			touchState = true;//页面是否可滑动状态

		//样式
		if(  opts.showshade == undefined || opts.showshade)  shade.style.cssText = 'position:fixed; top:0; left:0; right:0; bottom:0; background-color:rgba(0,0,0,0.5); z-index:999;';
		if(opts.bounced) {
			bouncedCss += 'background: url(' + opts.bounced.backgroundImg + ') no-repeat;background-size: 100% 100%;';
			bouncedCss += 'width:' + (opts.bounced.width || '270px') + ';';
			bouncedCss += 'height:' + (opts.bounced.height || '225px') + ';';
		}
		bounced.style.cssText = 'position:absolute; z-index: 999; top:0; left:0; right:0; bottom:0; margin:auto;  background-color: white; border-radius:' + borderRadius + ';' + bouncedCss;
		opts.logo && (bouncedLogo.style.cssText = 'left:0; right:0; position:absolute; ;margin:5px auto; top:-' + opts.logo.height + ';width:' +opts.logo.width+ ';height:' + opts.logo.height);
		opts.logo && (bouncedLogo.src = opts.logo.src);
		if(opts.header) {
			headerCss += ';height: ' + opts.header.height;
			headerCss += ';background-color: ' + opts.header.backgroundColor;
		}
		bouncedHeader.style.cssText = 'border-top-left-radius: '+borderRadius + ';border-top-right-radius: ' + borderRadius + headerCss ;
		bouncedContent.style.cssText = 'text-align: center;box-sizing: border-box;';

		//属性
		shade.setAttribute('class', 'bounced-shade');//遮罩层
		bounced.setAttribute('class', 'bounced');
		if(opts.logo) {
			bouncedLogo.setAttribute('class', 'bounced-logo');
			bouncedLogo.setAttribute('src', opts.logo.src);
		}
		bouncedHeader.setAttribute('class', 'bounced-header');
		bouncedContent.setAttribute('class', 'bounced-content');
		bouncedContent.innerHTML = content;//弹框内容

		bounced.appendChild(bouncedHeader);
		opts.logo && bounced.appendChild(bouncedLogo);
		bounced.appendChild(bouncedContent);
		shade.appendChild(bounced);
		document.body.appendChild(shade);
	}

	function  _renderEvent(opts) {
		var bouncedShade = document.querySelector('div.bounced-shade');
		if(opts.delayTime) {
			setTimeout(function () {
				document.body.removeChild(bouncedShade);
			},opts.delayTime)
		}

		//遮罩层点击消失并禁用滑动事件
		if(!opts.delayTime && opts.showshade == undefined || opts.showshade){
			_toggleTouchState(false);
			bouncedShade.onclick = function (event) {
				_toggleTouchState(true);
				if(event.target.className == 'bounced-shade') {
					document.body.removeChild(bouncedShade);
				}
			}
		}

		//调用关闭事件
		if(opts.close){
			bouncedShade.querySelector('div.bounced-close').onclick = function(event){
				_toggleTouchState(true);
				opts.close(bouncedShade);//传递回遮罩层对象
				event.preventDefault();
			}
		}
		//调用确定事件
		if(opts.ok){
			bouncedShade.querySelector('div.bounced-ok').onclick = function(event){
				_toggleTouchState(true);
				opts.ok(bouncedShade);//传递回遮罩层对象
				event.preventDefault();
			}
		}
	}

	/**
	 * 是否启用滑动事件
	 * @returns {*}
     */
	function _toggleTouchState(state) {
		state == undefined && (state = true);
		document.ontouchmove = function () {
			return state;
		}
	}
	return {
		bounced: function(content, opts){
			_createElement(content, opts);
			_renderEvent(opts);
		}
	};
})();