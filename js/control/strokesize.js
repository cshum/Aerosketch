define([
	'knockout','text!view/strokesize.svg','draw','draw.options'
],function(ko,view,Draw){
	if(!ko) return;
	var init, y, 
		strokeWidth = Draw.options.strokeWidth, 
		stroke = Draw.options.stroke,
		strokeSize = ko.computed({
			read: function(){
				return Math.min(30,strokeWidth()*Draw.zoom()/2);
			},
			write: function(size){
				strokeWidth(Math.min(30,Math.max(0.5,size))/Draw.zoom()*2);
			}
		}),

		check = function(target){
			return target._strokeSize;
		},
		dragstart = function(e){
			init = strokeSize();
			y = Draw.fromView(e.position).y;
		},
		drag = function(e){
			if(init)
				strokeSize(
					init + (Draw.fromView(e.position).y - y)* Draw.zoom()/20);
		},
		release = function(e){
			init = null;
		},
		
		wheel = function(e){
			strokeSize(strokeSize() + e.delta*10);
		};
	return {
		_strokeSize:true,
		view:view,
		strokeSize:strokeSize,
		stroke:stroke,

		check:check,
		dragstart:dragstart,
		drag:drag,
		release:release,

		wheel:wheel
	};
});
