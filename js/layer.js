define([
   'knockout','underscore','util/kosvgtemplate',
   'shape/factory'
],function(ko,_,svgTemplate,Factory){
	var Layer = function(options){
			options = _(options || {}).defaults({
				name:'',
				visible:true,
				shapes:[]
			});
			this.name = ko.observable(options.name);
			this.visible = ko.observable(options.visible);
			this._destroy = ko.observable(false);
			this.shapes = ko.observableArray(options.shapes);

			this.shapesTemplate = svgTemplate(this.shapes,function(shape){
				return '<'+shape.type+' data-bind="visible:visible,aniattr:attr" />';
			});
		},
		newShape = function(type){
			var shape = Factory(type);
			this.shapes.push(shape);
			return shape;
		},
		get = function(){
			return {
				name: this.name(),
				visible: this.visible(),
				shapes: _.chain(this.shapes())
					.filter(function(shape){ return shape.visible(); })
					.invoke('get').value()
			};
		};
	_(Layer.prototype).extend({
		newShape:newShape,
		get:get
	});
	return Layer;
});
