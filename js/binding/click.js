define(['knockout','jquery'],function(ko,$){
	ko.bindingHandlers.click = {
		init: function(el,valueAccessor,all,vm) {
			var func = valueAccessor(), 
				moused, touched;
			$(el)
				.on('mousedown',function(e){
					console.log('mousedown');
					if(!touched) moused = true;
				})
				.on('touchstart',function(e){
					console.log('touchstart');
					if(!moused) touched = true;
				})
				.on('touchend',function(e){
					console.log('touchend');
					if(touched) func.call(null,vm,e);
					touched = false;
				})
				.on('mouseup',function(e){
					console.log('mouseup');
					if(moused) func.call(null,vm,e);
					moused = false;
				});
			ko.utils.domNodeDisposal.addDisposeCallback(el, function(){
				$(el).off();
			});
		}
	};
});
