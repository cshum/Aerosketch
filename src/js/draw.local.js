define([
	'knockout','underscore','draw','layer','shape/factory',
	'util/requestanimationframe','util/deferbuffer','points',
],function(ko,_,Draw,Layer,ShapeFactory,aniFrame,deferBuffer,points){
	var
	user = ko.observable(),
	id = ko.observable(),
	title = ko.observable(),
	create = function(){
		/*`
		id(surfacesRef.push({
			'layers':{
				'default':{
					visible:true,
					name:'Default Layer',
					shapes:[{type:'path',visible:false}] //dummy
				}
			}
		}).name());
		 */
	},
	login = function(){
	},
	logout = function(){
	},
	load = _.once(function(callback){
		var
		layersMap = {},
		defer = deferBuffer(),
		bound = {};
		if('x1' in bound)
			callback({
				x:bound.x1,
				y:bound.y1,
				width:bound.x2 - bound.x1,
				height:bound.y2 - bound.y1
			});
		else callback();

		var id = 'Default Layer',
			layer = layersMap[id] || new Layer(),
			shapesMap = {};

		layersMap[id] = layer;

		Draw.layers.push(layer);
		shapesMap[id] = layer;
		Draw.layer(layer); //todo: only call at first run
	});
	_(Draw).extend({
		id:id,
		user:user,
		title:title,
		load:load,
		create:create,
		login:login,
		logout:logout
	});
});
