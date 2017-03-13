;(function($){
	function _scrollState(state){
		var tmp;
		if(state == false){
			tmp = function (event) {event.preventDefault()};
			document.body.addEventListener('touchmove', tmp, false);
		}else{
			document.body.removeEventListener('touchmove', tmp, false);
		}
	}
	function _createElement(){
		
		var _miao = $('<div id="miao">');
		var _bounced = $('<div class="bounced ">');
		_miao.append(_bounced);
		$(document.body).append(_miao);
	}
	function _handlerEvent(opts){
		_scrollState(false);
		var _miao = $('#miao');
		//点击遮罩层弹框消失
		_miao.click(function(event){
			if(event.srcElement.id == 'miao'){
				_scrollState(true);
				$(this).remove();
			}
		});
		
		//给确定与取消添加点击事件
		_miao.find('.ok').click(function(){
			opts.ok(_miao);
		});
		_miao.find('.cancel').click(function(){
			opts.cancel(_miao);
		});
	}

	function _renderDom(title){
		var _miao = $('#miao');
		_miao.css({
			position: 'fixed',
			width: '100%',
			height: '100%',
			backgroundColor: 'rgba(0,0,0,0.5)',
			top: 0,
			left: 0,
			right: 0,
			bottom:0
		});
		var _bounced = _miao.children('.bounced');
		_bounced.prop('id', 'confirm');
		var borderRadius = _bounced.css('borderRadius');
		//创建子元素
		var _header = $('<div class="bounced-header">');
		_header.css({
			backgroundColor : '#DCDCDC',
			borderTopLeftRadius : borderRadius,
			borderTopRightRadius : borderRadius
		});
		_header.html(title);

		var _content = $('<div class="bounced-content">'); 
		var _footer = $("<div class='bounced-footer'><div class='cancel'>取消</div><div class='ok'>确定</div></div>");
		_footer.css({
			position : 'absolute',
			borderTop : '2px solid #DCDCDC',
			bottom : '0'
		});

		_bounced.append(_header);
		_bounced.append(_content);
		_bounced.append(_footer);


		
	}


	function _getContentFrame(frame_type, data){
		var html;
		if( (data instanceof Array) === false){
			html = data;
		}else{
			if(frame_type === 1){//frame-fixed
				html = $('<div class="swiper-container "><div class="swiper-wrapper"></div></div>');
			}
			for(var i=0; i < data.length; i++){
				var subE = $('<div class="swiper-slide"></div>');
				subE.text(data[i][1]);
				subE.data('type', data[i][0]);
				html.children().append(subE);
			}

			$('#miao .bounced#confirm .bounced-content').append($('<div class="frame-fixed"></div>'));
		}
		$('#miao .bounced#confirm .bounced-content').append(html);
		
	}
	function _autoHeight(){
		//获取渲染过的元素
		var domHeader = $('#miao .bounced#confirm .bounced-header');
		var domContent = $('#miao .bounced#confirm .bounced-content');
		var domFooter = $('#miao .bounced#confirm .bounced-footer');
		var domBounced = $('#miao .bounced');
		var frameFixed = $('#miao .bounced#confirm .bounced-content .frame-fixed');
		var swiperWrapper = $('#miao .bounced#confirm .bounced-content .swiper-wrapper');
	
		var contentHeight = parseInt( domBounced.css('height') ) - ( parseInt( domHeader.css('height') ) + parseInt( domFooter.css('height') ) );
		

		domContent.css('height', contentHeight);
		var topHeight = parseInt( (contentHeight - parseInt(frameFixed.css('height')) ) / 2 );
		return topHeight;
	}
	$.extend({
		//普通弹框信息
		bounced: function(mes, type, callback){
			_createElement();
			var type = type == undefined || type == '' ? 'error' : type;//获取类型

			var _bounced = $('#miao').children('.bounced');
			_bounced.addClass('animated');
			_bounced.html(mes);			//弹框内容
			_bounced.prop('id', type);//弹框类型
			setTimeout(function(){
				$('#miao').remove();
				if(callback && typeof callback == 'function'){
					callback();
				}
			}, 2000);
		},
		confirm: function(title, content, opts){
			_createElement();//创建根元素
			_renderDom(title);//创建子元素
			_getContentFrame(1, content);//内容添加
			_handlerEvent(opts);//事件
			return _autoHeight();//自动调整高度
			
		}
	});
})(jQuery)