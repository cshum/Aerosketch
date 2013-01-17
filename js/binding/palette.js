define(['knockout','jquery','underscore'],function(ko,$,_){
	ko.bindingHandlers.palette = {
		init: function(el,val,all,Draw) {
			var call = val(), drag = false,
				baseX = $(el).offset().left;
			$(el)
				.on('mousedown',function(e){
					drag = true;
					var data = ko.dataFor(e.target);
					if(data) call(data);
				})
				.on('mousemove',function(e){
					var data = ko.dataFor(e.target);
					if(drag && data) call(data);
				})
				.on('touchstart touchmove',function(e){
					var touch = e.originalEvent.touches[0],
						x = touch.clientX - baseX,
						r = x/$(el).width();

					if(r>=0 && r<=1) 
						call(Draw.palette[Math.floor(
							r*Draw.palette.length)]);
				});
			$(window).on('mouseup',function(){
				drag = false;
			});
			ko.utils.domNodeDisposal.addDisposeCallback(el,function(){
				$(el).off();
			});
		}
	};
});
