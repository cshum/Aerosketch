define([
   'knockout','underscore','jquery','util/requestanimationframe'
],function(ko,_,$,requestAnimationFrame){
	ko.bindingHandlers.aniattr = {
		init: function(el,valueAccessor) {
			var attr = valueAccessor(),
				changed = {},
				triggered = false,
				trigger = function(key,value){
					if(key){
						changed[key] = ko.utils.unwrapObservable(value) || '';
					}else{
						//trigger all
						changed = ko.toJS(attr);
					}
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
			if(ko.isObservable(attr) || ko.isComputed(attr)){
				ko.computed(trigger);
			}else{
				_(attr).each(function(value,key){
					ko.computed(_(trigger).bind(key,value));
				});
			}
			update();
		}
	};
});
