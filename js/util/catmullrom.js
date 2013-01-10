define(function(){
	return function( ps ) {
		var path = [ 
			['M',[ps[0][0], ps[0][1]] ]
		];
		for (var i=0, l=ps.length; i<l-1; i++) {
			var p = [
				ps[Math.max(i-1,0)], 
				ps[i], ps[i+1], 
				ps[Math.min(i+2,l-1)] 
			];
			// Catmull-Rom 2 Cubic Bezier
			path.push(['C',
				[(-p[0][0] + 6*p[1][0] + p[2][0]) / 6, 
				 (-p[0][1] + 6*p[1][1] + p[2][1]) / 6 ],
				[(p[1][0] + 6*p[2][0] - p[3][0]) / 6,  
				 (p[1][1] + 6*p[2][1] - p[3][1]) / 6 ],
				[ p[2][0], p[2][1] ]
			]);
		}
		return path;
	};
});
