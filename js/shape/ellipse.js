define(['knockout','shape/factory'],function(ko,Shape){
	var bbox = {
		read: function(){
			return {
				x: this.cx() - this.rx(),
				y: this.cy() - this.ry(),
				width: this.rx() * 2,
				height: this.ry() * 2
			}
		},
		write: function(e){
			_(e).defaults(this.bbox());
			this.cx(e.x + e.width/2);
			this.cy(e.y + e.height/2);
			this.rx(e.width/2);
			this.ry(e.height/2);
		}
	};

	return Shape('ellipse',function(){
		this.cx = ko.observable(0);
		this.cy = ko.observable(0);
		this.rx = ko.observable();
		this.ry = ko.observable();
		this.bbox = ko.computed(bbox,this);
	},{ 
		attr:['cx','cy','rx','ry'] 
	});
});
