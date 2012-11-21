define(['knockout','underscore','shape/factory'],function(ko,_,Shape){
	var bbox = {
		read: function(){
			return {
				x: this.cx() - this.r(),
				y: this.cy() - this.r(),
				width: this.r() * 2,
				height: this.r() * 2
			}
		},
		write: function(e){
			_(e).defaults(this.bbox());
			this.cx(e.x + e.width/2);
			this.cy(e.y + e.height/2);
			this.r(Math.min(e.width,e.height)/2);
		}
	};

	return Shape('circle',function(){
		this.cx = ko.observable(0);
		this.cy = ko.observable(0);
		this.r = ko.observable(0);
		this.bbox = ko.computed(bbox,this);
	},{ 
		attr:['cx','cy','r'] 
	});
});
