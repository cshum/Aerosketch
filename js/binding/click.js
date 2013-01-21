define(['knockout','jquery'],function(ko,$){
	ko.bindingHandlers.click = {
		init: function(el,valueAccessor,all,vm) {
			var func = valueAccessor(), 
				moused, touched;
			$(el)
				.on('mousedown',function(e){
					if(!touched) moused = true;
				})
				.on('touchstart',function(e){
					if(!moused) touched = true;
				})
				.on('mouseup touchend',function(e){
					if(moused || touched) func.call(null,vm,e);
					moused = false;
					touched = false;
				});
			ko.utils.domNodeDisposal.addDisposeCallback(el, function(){
				$(el).off();
			});
		}
	};
});
