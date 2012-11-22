define(['knockout','jquery','underscore'],function(ko,$,_){
	ko.bindingHandlers.palette = {
		init: function(el,val) {
			var call = val(), drag = false;
			$(el)
				.on('mousedown',function(e){
					drag = true;
					call(ko.dataFor(e.target));
				})
				.on('mousemove',function(e){
					if(drag)
						call(ko.dataFor(e.target));
				})
				.on('touchstart touchmove',function(e){
					call(ko.dataFor(
						document.elementFromPoint(
							e.originalEvent.touches[0].clientX, 
							e.originalEvent.touches[0].clientY
						)
					));
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
