define(['knockout','jquery'],function(ko,$){
	ko.bindingHandlers.click = {
		init: function(el,valueAccessor,all,vm) {
			var func = valueAccessor(), touched = false;
			$(el)
				.on('mousedown touchstart',function(e){
					touched = true;
				})
				.on('mouseup touchend',function(e){
					if(touched) func.call(null,vm,e);
					touched = false;
				});
			ko.utils.domNodeDisposal.addDisposeCallback(el, function(){
				$(el).off();
			});
		}
	};
});
