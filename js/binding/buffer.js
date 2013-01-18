define(['knockout','jquery'],function(ko,$){
	ko.bindingHandlers.buffer = {
		init: function(el,value,all,Draw) {
			var ctx = el.getContext('2d');
			Draw.bufferContext = ctx;
			$(el).hide();
			Draw.debounce.subscribe(function(state){
				if(state){
					var $p = $(el).parent();
					el.width = $p.width();
					el.height = $p.height();
					$(el).show();
				}else{
					$(el).hide();
				}
			});
		}
	};
});
