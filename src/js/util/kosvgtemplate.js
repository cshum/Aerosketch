define(['knockout','underscore'],function(ko,_){
	var div = document.createElement('div');
	var svgEngine = _(new ko.templateEngine()).extend({
		allowTemplateRewriting: false,
		renderTemplateSource: function (templateSource, bindingContext, options) {
			var text = '<svg xmlns="http://www.w3.org/2000/svg">' 
				+ templateSource + '</svg>';
			div.innerHTML = text;
			return _.toArray(div.childNodes[0].childNodes);
		},
		makeTemplateSource:function(template){
			return template;
		}
	});
	return function(data,getTemplate){
		var template = {
			name: getTemplate,
			templateEngine: svgEngine
		};
		if(_(data.peek()).isArray())
			template.foreach = data;
		else 
			template.data = data;
		return template;
	};
});
