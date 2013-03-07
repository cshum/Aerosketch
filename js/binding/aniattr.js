define([
   'knockout','underscore','jquery','util/requestanimationframe'
],function(ko,_,$,aniFrame){
	if(!ko) return;
	ko.bindingHandlers.aniattr = {
		init: function(el,valueAccessor,all) {
			var attr = valueAccessor(),
				changed = {},
				triggered = false,
				trigger = function(key,value){
					var val = ko.utils.unwrapObservable(value);
					if(!val) return;
					changed[key] = val;
					if(!triggered){
						aniFrame(update);
						triggered = true;
					}
				},
				update = function(){
					$(el).attr(changed);
					triggered = false;
					changed = {};
				};
			_(attr).each(function(value,key){
				ko.computed(_(trigger).bind(null,key,value));
			});
			update();
		}
	};
});
