define([
   'knockout','underscore','lib/knockout/svgtemplate',
],function(ko,_,svgTemplate,Factory){
	return function(data){
		data = _(data || {}).defaults({
			name:'',
			visible:true,
			shapes:[]
		});

		var self = this;
		self.name = ko.observable(data.name);
		self.visible = ko.observable(data.visible);
		self.shapes = ko.observableArray(data.shapes);

		self.shapesTemplate = svgTemplate(self.shapes,function(shape){
			if(shape.visible())
			return '<'+shape.getType()+' data-bind="aniattr:attr" />';
			else return '<!-- -->';
		});
		self.serialize = function(){
			return {
				name: self.name(),
				visible: self.visible(),
				shapes: _.chain(self.shapes())
					.filter(function(shape){ return shape.visible(); })
					.invoke('serialize').value()
			};
		}
	}
});
