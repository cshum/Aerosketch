define(['knockout','underscore'],function(ko,_){
	var div = document.createElement('div');
	var engine = _(new ko.templateEngine()).extend({
		allowTemplateRewriting: false,
		renderTemplateSource: function (source) {
			div.innerHTML = source;
			return _.toArray(div.childNodes);
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
	};
});
