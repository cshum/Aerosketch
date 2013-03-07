define(['knockout','hammer','underscore'],function(ko,Hammer,_){
	if(!ko) return;
	ko.bindingHandlers.hammer = {
		init: function(el,value,all,vm) {
			var hammer = Hammer(el,all().hammerOptions || {});
			_(value()).each(function(func,name){
				if(_.isFunction(func)){
					//hammer['on'+name] = _(func).bind(null,vm);
					hammer.on(name,_(func).bind(null,vm));
				}
				ko.utils.domNodeDisposal.addDisposeCallback(
					el, _(hammer.off).bind(hammer,name));
			});
		}
	};
});
