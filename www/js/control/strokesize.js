define([
	'knockout','text!view/strokesize.svg','draw','draw.options'
],function(ko,view,Draw){
	var init, y, 
		strokeSize = ko.computed({
			read: function(){
				return Math.min(30,Draw.options.strokeWidth()*Draw.zoom()/2);
			},
			write: function(size){
				Draw.options.strokeWidth(Math.min(30,Math.max(0.5,size))/Draw.zoom()*2);
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

		check:check,
		dragstart:dragstart,
		drag:drag,
		release:release,

		wheel:wheel
	};
});
