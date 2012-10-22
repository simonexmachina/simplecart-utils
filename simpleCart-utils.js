$.fn.simpleCartUtils = function( option ) {
	var args = arguments;
	return this.each(function() {
    	var $this, data, options;
			$this = $(this);
			options = typeof option === 'object' && option;
			data = $this.data('simpleCartUtils') || new SimpleCartUtils(this, options);
		if (typeof option === 'string') {
			args = Array.prototype.slice.call(args);
			args.shift();
			return data[option].apply(data, args);
	    }
    });
}
$.fn.simpleCartUtils.defaults = {
	toolTips: true,
	cartPopover: true,
	/**
	 * Requires jQuery.path plugin in vendor/jquery.path/jquery.path.js
	 * @type {Boolean}
	 */
	animation: true,
	images: true,
	info: '.cartInfo',
	popover: '#cartPopover',
	cartButton: '#cartButton',
};
var SimpleCartUtils = function( el, options ) {
	this.$el = $(el);
	this.$el.data('simpleCartUtils', this);
	this.options = $.extend({}, $.fn.simpleCartUtils.defaults, options);
	if( this.options.toolTips ) this.addToolTips();
	if( this.options.cartPopover ) this.addCartPopover();
	if( this.options.animation ) this.addAnimation();
	if( this.options.images ) this.images();
}
SimpleCartUtils.prototype = {
	find: function(selector) {
		return this.$el.find(selector);
	},
	addToolTips: function() {
		this.find(".simpleCart_shelfItem").live('mouseenter', function(event) {
			$(this).find('.tooltip').fadeIn(200);
		});
		this.find(".simpleCart_shelfItem").live('mouseleave', function(event) {
			$(this).find('.tooltip').fadeOut(200);
		});
	},
	addCartPopover: function() {
		var $info = $(this.options.info),
			$popover = $(this.options.popover);
		$info.toggle(function(){
				$popover.show();
				$info.addClass('open');
			},
			function(){
				$popover.hide();
				$info.removeClass('open');
			});
	},
	addAnimation: function() {
		var _this = this;
		this.find(".simpleCart_shelfItem")
			.addClass('animated')
			.find('.item_add')
			.live('click', function() {
				_this.animateIntoCart($(this).closest('.simpleCart_shelfItem'));
			});
	},
	animateIntoCart: function( el ) {
		var $clone = $(el).clone().css('position', 'absolute'),
			position = $(el).offset(),
			$button = $(this.options.cartButton),
			end = $button.offset(),
			bezierParams = {
				start: { 
					x: position.left, 
					y: position.top, 
					angle: -90
				},
				end: { 
					x: end.left + ($button.width() / 2),
					y: end.top + ($button.height() / 2), 
					angle: 180, 
					length: .2
				}};
		$clone.find('.tooltip').hide();
		$clone.appendTo(document.body);
		var oldZIndex = $button.css('zIndex');
		$button.css('zIndex', $clone.css('zIndex'));
		$clone.animate({path: new $.path.bezier(bezierParams)},{
			complete: function() {
				$button.css('zIndex', oldZIndex);
			},
			duration: 600});
		$clone.addClass('animation');
	},
	images: function() {
		this.find(".simpleCart_shelfItem img")
			.addClass('item_add item_image');
	}
}