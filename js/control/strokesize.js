define([
	'knockout','draw','text!view/control/strokesize.svg'
],function(ko,Draw,view){
	var init, y, 
		strokeWidth = Draw.options.strokeWidth, 
		stroke = Draw.options.stroke,
		strokeSize = ko.computed({
			read: function(){
				return Math.min(30,strokeWidth()*Draw.zoom()/2);
			},
			write: function(size){
				strokeWidth(
					Math.min(30,Math.max(0.5,size))/Draw.zoom()*2
				);
			}
		}),

		check = function(target){
			return target._strokeSize;
		},
		touch = function(e){
			if(e.no>1) return;

			init = strokeSize();
			y = e.position.y;
		},
		move = function(e){
			if(init)
				strokeSize(
					init + (e.position.y - y)* Draw.zoom()/20
				);
		},
		release = function(e){
			init = null;
		},
		
		wheel = function(e){
			strokeSize(
				strokeSize() + e.delta*10
			);
		};
	return {
		_strokeSize:true,
		view:view,
		strokeSize:strokeSize,
		stroke:stroke,

		check:check,
		touch:touch,
		move:move,
		release:release,

		wheel:wheel
	}
});
