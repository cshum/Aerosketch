define([
   'knockout','underscore','jquery','util/requestanimationframe'
],function(ko,_,$,requestAnimationFrame){
	ko.bindingHandlers.aniattr = {
		init: function(el,valueAccessor,all) {
			console.log(all());
			var attr = valueAccessor(),
				changed = {},
				triggered = false,
				trigger = function(key,value){
					changed[key] = ko.utils.unwrapObservable(value) || '';
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
				ko.computed(_(trigger).bind(null,key,value));
			});
			update();
		}
	};
});
