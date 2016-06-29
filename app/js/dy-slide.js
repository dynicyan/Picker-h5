/**
 * Copyright (C), 2016, 上海2345网址导航
 * Author:   dynicyan   qq:2304506263
 * Date:     2016-03-23
 * Description: 图片轮播
 */
;(function($){
	var ie6 = !-[1,] && !window.XMLHttpRequest; 
	var userAgent = navigator.userAgent.toLowerCase();
	var browser = {
		ie8: /msie 8/.test(userAgent),
		ie7: /msie 7/.test(userAgent)
	};
 	//slide function
 	$.fn.slide = function(options){
 		var defaults,settings,el,count,$nav,isMove,timer,leftPos,imgNavlist;
 			defaults = {
 				imgContainer:$('.slideInner .ban_c'),
 				effect:'easeInQuint',//轮播图切换风格
 				imgEffectOut: 'easeInExpo', //里面元素动画离开风格
 				nav:true,//点点列表
 				auto:true,
 				ranTime:4000,
 				slideSpeed:1000,
 				imgSlideSpeed:800,
 				// action:'mouseover',
 				prevBtn:$('a.prevBtn'),
 				nextBtn:$('a.nextBtn')
 			};
 			settings = $.extend({},defaults,options);
 			el = $(this);
 			count = $(defaults.imgContainer).length;
 			$nav = '';
 			imgNavlist = '';
 			timer = null;
 			isMove = true;
 			leftPos = 0;
 		//slide 移动方法
 		$.fn.changeSlide = function(settings, pos) {
			$(this).animate({
				left: pos + "%"
			}, {
				duration: settings.slideSpeed,
				easing: settings.effect,
				complete: function() {
						isMove = true;
				}
			});
		};
 		//点击移动方法
 		$.fn.clickChangeSlide = function(settings, pos) {
			$(this).css({
				'left': pos + "%",
				opacity: .9
			}).delay(10).animate({
				opacity: '1'
			}, {
				duration: settings.slideSpeed,
				easing: settings.effect,
				complete: function() {
					isMove = true;
				}
			});
		};
 		//小元素动画
 		$.fn.imgAnimate = function(imgEffectIn, pos, where, settings){
 			var el = $(this);
 			switch(where){
 				case 'right':
 					el.stop(true).css({
						'left': '100%',
						'opacity': '0'
					}).animate({
						left: pos,
						opacity: '1'
					}, {
						duration: settings.imgSlideSpeed,
						easing: imgEffectIn,
						complete: function() {
							el.css('left', pos);
						}
					});
					el.parent().siblings().children().animate({
						left: '20%',
						opacity: '0'
					}, {
						duration: 500,
						easing: settings.imgEffectOut,
						complete: function() {
							el.css('left', pos);
						}
					});
					break;
 				case 'left':
					el.stop(true).css({
						'left': '0%'
					}).animate({
						left: pos
					}, {
						duration: settings.imgSlideSpeed,
						easing: imgEffectIn,
						complete: function() {
							el.css('left', pos);
						}
					});
					el.parent().siblings().children().animate({
						left: '50%'
					}, {
						duration: 500,
						easing: settings.imgEffectOut,
						complete: function() {
							el.css('left', pos);
						}
					});
					break;
 			};
 		};
 		//向左滑动
 		$.fn.moveLeft = function() {
			if (!isMove) {
				return;
			};
			isMove = false;
			var el = $(this);
			index = $(settings.imgContainer).parent().find('.active').attr("data-index");
			console.log(index <= count);
			if (index <= count && index > 1) {
				current = $(settings.imgContainer).eq(index - 1);
				next = $(settings.imgContainer).eq(index - 2);
				if (next) {
					current.removeClass("active");
					next.addClass("active");
					changeNavList();
					changeImgList();
				};
				pos = ((Number(index) - 2) * 100) * -1;
				el.changeSlide(settings, pos);
				el.find('.active').imgMoveSetting('left');
			} else {
				toLast('first');
			}
		};
		//向右滑动
		$.fn.moveRight = function() {
			if (!isMove) {
				return;
			};
			isMove = false;
			var el = $(this);
			index = $(settings.imgContainer).parent().find('.active').attr("data-index");
			console.log(index <= count);
			if (index >= 1 && index < count) {
				current = $(settings.imgContainer).eq(index - 1);
				next = $(settings.imgContainer).eq(index);
				if(next){
					current.removeClass("active");
					next.addClass("active");
					changeNavList();
					changeImgList();
				};
				pos = ((Number(next.attr("data-index")) - 1) * 100) * -1;
				el.changeSlide(settings, pos);
				el.find('.active').imgMoveSetting('right');
			} else {
				toLast('last');
			}
		};
 		//切换点列表
 		function changeNavList(){
 			if(settings.nav){
 				var index = el.find('.active').attr("data-index");
 				$('.navListBox li a').removeClass('active').eq(index - 1).addClass('active');
 			}
 		};
 		//切换小图列表
 		function changeImgList(){
 			var idx = el.find('.active').attr("data-index");
 			$('.frontCover li').removeClass('active').eq(idx - 1).addClass('active');
 		};
 		//自动切换
 		function autoplay() {
			if (settings.auto) {
				clearInterval(timer);
				timer = setInterval(function() {
					el.moveRight();
				}, settings.ranTime);
			}
		};
 		//根据索引值切换
 		$.fn.moveTo = function(index){
 			var el = $(this),
 				movewhere = '';
 			el.children().eq(index - 1).addClass('active').siblings().removeClass('active');
 			pos = ((index - 1)*100) * -1;
 			el.clickChangeSlide(settings,pos);
 			var curindex = $('.navListBox li a.active').attr("data-index");
 			if(index < curindex){
 				movewhere = "left";
 			}else{
 				movewhere = "right";
 			};
 			$('.navListBox li').eq(index - 1).children().addClass('active').parent().siblings().children().removeClass('active');
 			$('.frontCover li').eq(index - 1).addClass('active').siblings().removeClass('active');
 			// el.find('.active').imgMoveSetting(movewhere);
 		};
 		//根据小图索引滑动
 		$.fn.imgMoveTo = function(index){
 			var el = $(this);
 				movewhere = '';
 		};
 		//小图动画
 		$.fn.imgMoveSetting = function(moveW){
 			var el = $(this);
 			if(moveW){
 				$.each(el.children('moveElem'),function(i){
 					var arr = $(this).attr("rel").split(',');
 					var thisDelay = arr[0] - 0;
 					var imgEffectIn = arr[1];
 					var thisImgPos = $(this).attr("offsetLeft");
 					$(this).imgAnimate(imgEffectIn,thisImgPos,moveW,settings);
 				});
 			}
 		};
 		//移至最前或最后一帧
 		function toLast(move) {
			switch (move) {
				case 'last':
					el.find('.ban_c:first').css('margin-left', (el.children().length * 100) + "%");
					el.changeSlide(settings, -el.children().length * 100);
					el.find('.ban_c:first').imgMoveSetting('right');
					setTimeout(function() {
						el.css('left', '0%');
						el.find('.ban_c:first').css('margin-left', '0');
						el.find('.ban_c:first').addClass('active').siblings().removeClass('active');
						changeNavList();
						changeImgList();
					}, settings.slideSpeed + 50);
					break;
				case 'first':
					el.find('.ban_c:last').css('margin-left', -(el.children().length * 100) + "%");
					el.changeSlide(settings, 100);
					el.find('.ban_c:last').imgMoveSetting('left');
					setTimeout(function() {
						el.css('left', -((el.children().length - 1) * 100) + "%");
						el.find('.ban_c:last').css('margin-left', '0');
						el.find('.ban_c:last').addClass('active').siblings().removeClass('active');
						changeNavList();
						changeImgList();
					}, settings.slideSpeed + 50);
					break;
			}
		};
 		//左右按钮
 		settings.prevBtn.hover(function() {
			$(this).css('opacity', '.5');
		}, function() {
			$(this).css('opacity', '.2');
		});
		settings.nextBtn.hover(function() {
			$(this).css('opacity', '.5');
		}, function() {
			$(this).css('opacity', '.2');
		});
		settings.nextBtn.click(function() {
			el.moveRight();
		});
		settings.prevBtn.click(function() {
			el.moveLeft();
		});
		el.parent().hover(function() {
			clearInterval(timer);
			settings.prevBtn.parent().show();
		}, function() {
			autoplay();
			settings.prevBtn.parent().hide();
		});
		el.parent().siblings('.frontCover').hover(function(){
			clearInterval(timer);
			settings.prevBtn.parent().show();
		},function(){
			autoplay();
			settings.prevBtn.parent().hide();
		})
		//添加navlist和navimg以及leftrightbtn
		$.fn.init(autoplay());
		$.each($(settings.imgContainer),function(i) {
			$(this).css({
				width: $(window).width(),
				position: "absolute",
				left: leftPos + "%"
			}).attr("data-index", i + 1);
			leftPos = leftPos + 100;
			if(settings.nav){
				$nav += "<li style='cursor: pointer'><a data-index='"+(i+1)+"'></a></li>";
			};
			$.each($(this).children(),function(i){
				$(this).attr('offsetLeft', $(this).css('left'));
			});
			//背景小图索引
			 // style="'imgList'"
			$('.frontCover ul').append('<li data-index="'+(i+1)+'"><div class="smallimg"></div></li>');
			$('.frontCover ul').find('.smallimg').each(function(i){
				var imgList = $(settings.imgContainer).eq(i).find('.img').css("background-image");
				$(this).css('background',imgList);
			})
			console.log($('.frontCover ul').find('.smallimg'));
			// '+$(settings.imgContainer).eq(i).find('.img').attr("style")+'
			//小图索引
			// $('.frontCover ul').append('<li><div class="smallimg" data-index="'+(i+1)+'">'+$(this).eq(0).html()+'</div></li>');
			// alert($(settings.imgContainer).eq(i).find('.img').attr("style"));
		});
		$("<ul style='width:" + ($(settings.imgContainer).length * 17) + "px;margin-left:-" + ($(settings.imgContainer).length * 17) / 2 + "px' class='navListBox'>" + $nav + "</ul>").appendTo(el.parent());
 		
 		$(settings.imgContainer).eq(0).addClass("active");
 		if(settings.nav)
 			$(".navListBox li a" + "[data-index=1]").addClass("active");
 			$(".frontCover li" + "[data-index=1]").addClass("active");
 		$(".navListBox li a").bind({
			click: function() {
				if (!isMove) {
					return;
				};
				isMove = false;
				var index = $(this).attr('data-index');
				el.moveTo(index);
			},
			mouseover: function() {
				$(this).parent().css('box-shadow', '0 0 5px #fff');
			},
			mouseout: function() {
				$(this).parent().css('box-shadow', 'none');
			}
		});
		$(".frontCover li").on({
			click:function(){
				if(!isMove){
					return
				};
				isMove = false;
				var index = $(this).attr('data-index');
				alert(index);
				el.moveTo(index);
			}
		})
 	};
})(jQuery);
/*
 *
 * 扩展jquery 动画组件
 * */
jQuery.easing['jswing'] = jQuery.easing['swing'];
jQuery.extend(jQuery.easing, {
	def: 'easeOutQuad',
	swing: function(x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInQuad: function(x, t, b, c, d) {
		return c * (t /= d) * t + b;
	},
	easeOutQuad: function(x, t, b, c, d) {
		return -c * (t /= d) * (t - 2) + b;
	},
	easeInOutQuad: function(x, t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t + b;
		return -c / 2 * ((--t) * (t - 2) - 1) + b;
	},
	easeInCubic: function(x, t, b, c, d) {
		return c * (t /= d) * t * t + b;
	},
	easeOutCubic: function(x, t, b, c, d) {
		return c * ((t = t / d - 1) * t * t + 1) + b;
	},
	easeInOutCubic: function(x, t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
		return c / 2 * ((t -= 2) * t * t + 2) + b;
	},
	easeInQuart: function(x, t, b, c, d) {
		return c * (t /= d) * t * t * t + b;
	},
	easeOutQuart: function(x, t, b, c, d) {
		return -c * ((t = t / d - 1) * t * t * t - 1) + b;
	},
	easeInOutQuart: function(x, t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
		return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
	},
	easeInQuint: function(x, t, b, c, d) {
		return c * (t /= d) * t * t * t * t + b;
	},
	easeOutQuint: function(x, t, b, c, d) {
		return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
	},
	easeInOutQuint: function(x, t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
		return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
	},
	easeInSine: function(x, t, b, c, d) {
		return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
	},
	easeOutSine: function(x, t, b, c, d) {
		return c * Math.sin(t / d * (Math.PI / 2)) + b;
	},
	easeInOutSine: function(x, t, b, c, d) {
		return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
	},
	easeInExpo: function(x, t, b, c, d) {
		return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
	},
	easeOutExpo: function(x, t, b, c, d) {
		return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
	},
	easeInOutExpo: function(x, t, b, c, d) {
		if (t == 0) return b;
		if (t == d) return b + c;
		if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
		return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function(x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
	},
	easeOutCirc: function(x, t, b, c, d) {
		return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
	},
	easeInOutCirc: function(x, t, b, c, d) {
		if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
		return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
	},
	easeInElastic: function(x, t, b, c, d) {
		var s = 1.70158;
		var p = 0;
		var a = c;
		if (t == 0) return b;
		if ((t /= d) == 1) return b + c;
		if (!p) p = d * .3;
		if (a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else var s = p / (2 * Math.PI) * Math.asin(c / a);
		return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
	},
	easeOutElastic: function(x, t, b, c, d) {
		var s = 1.70158;
		var p = 0;
		var a = c;
		if (t == 0) return b;
		if ((t /= d) == 1) return b + c;
		if (!p) p = d * .3;
		if (a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else var s = p / (2 * Math.PI) * Math.asin(c / a);
		return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
	},
	easeInOutElastic: function(x, t, b, c, d) {
		var s = 1.70158;
		var p = 0;
		var a = c;
		if (t == 0) return b;
		if ((t /= d / 2) == 2) return b + c;
		if (!p) p = d * (.3 * 1.5);
		if (a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else var s = p / (2 * Math.PI) * Math.asin(c / a);
		if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
		return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
	},
	easeInBack: function(x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c * (t /= d) * t * ((s + 1) * t - s) + b;
	},
	easeOutBack: function(x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
	},
	easeInOutBack: function(x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
		return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
	},
	easeInBounce: function(x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b;
	},
	easeOutBounce: function(x, t, b, c, d) {
		if ((t /= d) < (1 / 2.75)) {
			return c * (7.5625 * t * t) + b;
		} else if (t < (2 / 2.75)) {
			return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
		} else if (t < (2.5 / 2.75)) {
			return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
		} else {
			return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
		}
	},
	easeInOutBounce: function(x, t, b, c, d) {
		if (t < d / 2) return jQuery.easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
	}
});
