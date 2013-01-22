define([
   'underscore','util/lzw',
   'layer','shape/factory','record/shape',
   'draw','draw.history','draw.options'
],function(_,lzw,Layer,Factory,ShapeRecord,Draw){
	var load = function(){
			if(!window.localStorage) return;
			var data = localStorage['draw'];
			if(!data) return;

			data = JSON.parse(lzw.decode(data));
			data = _(data).defaults({
				zoom:1,
				position:{x:0,y:0},
				background:'white',
				options:{
					stroke:'black',
					fill:'red',
					strokeWidth:2
				}
			});

			var records = [];

			Draw.zoom(data.zoom);
			Draw.position(data.position);
			Draw.background(data.background);

			Draw.options.stroke(data.options.stroke);
			Draw.options.fill(data.options.fill);
			Draw.options.strokeWidth(data.options.strokeWidth);

			Draw.layers(_(data.layers).map(function(e){
				e.shapes = _(e.shapes).map(function(e){
					var Shape = Factory(e.type),
						shape = new Shape(e.options);
						records.push(new ShapeRecord(shape));
					return shape;
				})
				return new Layer(e);
			}));
			Draw.layer(_.last(Draw.layers()));
			Draw.log.apply(null,records);
		},
		save = function(){
			if('localStorage' in window){
				var data = {
					layers: _(layers()).invoke('serialize'),
					zoom: Draw.zoom(),
					position: Draw.position(),
					background: Draw.background(),
					options:{
						stroke:Draw.options.stroke(),
						strokeWidth:Draw.options.strokeWidth(),
						fill:Draw.options.fill()
					}
				};
				localStorage['draw'] = lzw.encode(JSON.stringify(data));
				alert('Saved');
			}
		};

	var l = new Layer();
	Draw.layers([l]);
	Draw.layer(l);
	load();

	_(Draw).extend({
		load:load,
		save:save,
	});

});
