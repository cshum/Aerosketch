define([
   'knockout','underscore','jquery','util/requestanimationframe'
],function(ko,_,$,requestAnimationFrame){
	ko.bindingHandlers.aniattr = {
		init: function(el,valueAccessor) {
			var attr = valueAccessor(),
				changed = {},
				triggered = false,
				trigger = function(key,val){
					changed[key] = val;
					if(!triggered){
						requestAnimationFrame(update);
						triggered = true;
					}
				},
				update = function(){
					$(el).attr(changed);
					triggered = false;
					changed = {};
				};
			_(attr).each(function(value,key){
				changed[key] = ko.utils.unwrapObservable(value);
				if(ko.isObservable(value) || ko.isComputed(value))
					value.subscribe(_(trigger).bind(null,key));
			});
			update();
		}
	};
});
