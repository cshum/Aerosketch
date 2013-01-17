define(['knockout','jquery','underscore'],function(ko,$,_){
	ko.bindingHandlers.palette = {
		init: function(el,val) {
			var call = val(), drag = false;
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
					var data = ko.dataFor(document.elementFromPoint(
						e.originalEvent.touches[0].clientX, 
						e.originalEvent.touches[0].clientY
					));
					if(data) call(data);
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
