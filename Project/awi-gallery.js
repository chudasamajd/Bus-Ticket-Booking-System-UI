/*!
 * AWI Image Gallery jQuery Plugin
 * http://www.aw-industries.com
 *
 * Copyright 2010, Alexander HL Wong
 * Licensed under the MIT license.
 * http://www.aw-industries.com/files/license.txt
 *
 * Date: Wednesday, May 5 2010
 */

/*!
 * USAGE
 * initialize: $(_container_).gallery(_options_);
 * , where _container_ is a CSS selector string
 * corresponding to the gallery container,
 * and _options_ is a hash of the setting below.
 *
 * options: left, right, remote, data, images, speed
 * , where left/right are HTML elements corresponding
 * to the button you wish to bind to navigate images,
 * and remote is the URL to a remote resource of
 * JSON encoded image objects,
 * and data is optional data sent on remote request,
 * and images is an array of gallery image objects of
 * the form { src: URL, alt: alt_text },
 * and speed is the interval for the slideshow in ms.
 *
 * NOTE if remote is specified images will be ignored!
 *
 * example of static image set
 * $(_container_).gallery({ images: [{ src: '/imgs/img1', alt: 'alt text'}, ... ] });
 *
 * example of remote image set
 * $(_container_).gallery({ remote: '/json_images', data: { key: value, ... } });
 *
 * example of changing gallery speed and left and right buttons
 * $(_container_).gallery({ left: $(_left_buttons_), right: $(_right_buttons_), speed: 5000 }); 
 */

(function($){
	$.fn.gallery = function(options){
		var defaults = { left : [], right : [], remote : false, data : {}, images : [], speed : 3000 }
		var options = $.extend(defaults, options);
		var currIndx = 0;
		var timeout = null;
		return this.each(function(){
			var t = $('<span />').css({ 'position' : 'absolute', 'white-space' : 'nowrap', 'left' : 0 }).appendTo($(this).css('overflow', 'hidden'));
			if(options.remote === false ) $(options.images).each(function(i,e){ $('<img />').attr({ src : e.src, alt : e.alt }).appendTo(t); });
			else{
				$.ajax({ type: 'GET',	url: options.remote,	data: options.data,	dataType: 'json',
					success: function(d, s, x){
						if(s == 'success')	$(d).each(function(i,e){ $('<img />').attr({ src : e.src, alt : e.alt }).appendTo(t); });
					}
				});
			}
			$(options.right).click(function(){
				view((currIndx+1) % t.children().length);
				return false;
			});
			$(options.left).click(function(){
				var l = t.children().length;
				var i = (currIndx-1) % l;
				while(i < 0){
					i += l;
				}
				view(i);
				return false;
			});
			$(options.right).add($(options.left)).hover(
				function(){ clearTimeout(timeout); },
				function(){ resume(); }
			);
			resume();
			function resume(){
				timeout = setInterval(function(){ view((currIndx+1) % t.children().length); }, options.speed );
			}
			function view(i){
				t.animate({ left : -1*t.children().eq(i).position().left }, 800, 'swing');
				currIndx = i;
			}
		});
	}
})(jQuery);