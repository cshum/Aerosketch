define(['knockout','jquery','bootstrap'],function(ko,$){
	ko.bindingHandlers.dropdown = {
		init: function(el,value,all,vm) {
			$(el).dropdown();
		}
	};
});
