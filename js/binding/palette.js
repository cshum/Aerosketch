define(['knockout','jquery','underscore'],function(ko,$,_){
	ko.bindingHandlers.palette = {
		init: function(el,val) {
			var call = val(), touch = false;
			$(el)
				.on('touchstart mousedown',function(e){
					touch = true;
					call(ko.dataFor(e.target));
				})
				.on('touchmove mousemove',function(e){
					if(touch)
						call(ko.dataFor(e.target));
				});
			$(window)
				.on('touchend mouseup',function(){
					touch = false;
				});
			ko.utils.domNodeDisposal.addDisposeCallback(el,function(){
				$(el).off();
			});
		}
	};
});
