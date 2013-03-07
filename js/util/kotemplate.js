define(['knockout','underscore'],function(ko,_){
	if(!ko) return;
	var engine = _(new ko.templateEngine()).extend({
		allowTemplateRewriting: false,
		renderTemplateSource: function (source) {
			var div = document.createElement('div');
			div.innerHTML = source;
			return ko.utils.arrayPushAll([], div.childNodes);
		},
		makeTemplateSource:function(template){
			return template;
		}
	});
	return function(data,getTemplate){
		var template = {
			name: getTemplate,
			templateEngine: engine 
		};
		if(_(ko.utils.unwrapObservable(data)).isArray())
			template.foreach = data;
		else 
			template.data = data;
		return template;
	}
});
