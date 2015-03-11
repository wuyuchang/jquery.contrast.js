(function(factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		factory(require('jquery-1.11.1.js'));
	} else {
		factory(jQuery);
	}
}(function($) {
	var Plugin, defaults, pluginName;

	pluginName = 'contrast';

	defaults = {
		selfClass: false,
		dragButton: {
			position: 'absolute',
			left: '50%',
			bottom: '25px',
			width: '30px',
			height: '30px',
			background: '#FFF',
			color: '#757575',
			font: 'bold 14px "SimHei"',
			textAlign: 'center',
			zIndex: 2,
			cursor: 'ew-resize',
			borderRadius: '100%'
		},
		dragButtonInner: {
			margin: '0 2px',
			color: 'inherit',
			font: 'inherit'
		}
	}

	function Plugin(element, options) {
		this.element = element;
		this.options = $.extend(true, {}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;

		if (!Plugin.prototype.init) {
			Plugin.prototype.init = function() {
				var _this = this,
					$element = $(this.element),
					$imgs = $element.children();

				this.data = $.data(this);

				if ($imgs.length != 2) {
					return 'not 2 imamges, please put 2 images into the contain!';
				}

				$imgs.eq(0).wrap('<div class="before-img">');
				$imgs.eq(1).wrap('<div class="after-img">');

				$element.css({
					position: 'relative',
					width: $imgs.eq(1).width(),
					height: $imgs.eq(1).height()
				});

				// img底部3px bug
				$('img', $element).css('display', 'block');	

				$('.before-img', $element).css({
					overflow: 'hidden',
					position: 'absolute',
					top: 0,
					left: 0,
					width: '50%',
					zIndex: 1
				});

				$('.after-img', $element).css({
					position: 'absolute',
					top: 0,
					left: 0,
					zIndex: 0
				});



				$('<div class="dragButton"><span><</span><span>></span></div>').insertAfter('.after-img', $element);

				// 判断是否通过类名设置其样式，是的话输入类名即可
				if (this.options.selfClass !== false) {
					$('.dragButton', $element).addClass(this.options.selfClass.toString());
				} else {
					$('.dragButton', $element).css(_this.options.dragButton).css('marginLeft', - $('.dragButton', $element).outerWidth() / 2);
					$('.dragButton span', $element).css(_this.options.dragButtonInner).css('lineHeight', $('.dragButton', $element).height() + 'px');
				}

				// 绑定事件
				$('.dragButton', $element).on('mousedown', function(e) {
					_this._ButtonDown(e);
				})

				$('body').on('mouseup', function(e) {
					$('body').off('mousemove').css('cursor', 'default');
				});
			}

			Plugin.prototype._ButtonDown = function(e) {
				e.preventDefault();

				var _this = this,
					$element = $(this.element);

				$.data(this, 'offsetLeft', $(element).offset().left);

				$('body').on('mousemove', function(e) {

					_this._ButtonMove(e);
				}).css('cursor', _this.options.dragButton.cursor);
			}

			Plugin.prototype._ButtonMove = function(e) {
				var _this = this,
					$element = $(this.element);

				var moveX = e.pageX - $.data(this, 'offsetLeft');

				if (moveX < 0) {
					moveX = 0;
				} else if (moveX > $(element).width()) {
					moveX = $(element).width();
				}

				$('.dragButton', $element).css('left', moveX);
				$('.before-img', $element).css('width', moveX);
			}
		}

		this.init();
	}

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			$.data(this, 'plugin_' + pluginName) || $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
		})
	}

}));