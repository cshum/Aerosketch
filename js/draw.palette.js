define([
	'knockout','underscore',
	'draw','draw.edit'
],function(ko,_,Draw){
	var colorMode = ko.observable('fill'),
		toggleColorMode = function(){
			colorMode(colorMode()=='fill'?'stroke':'fill');
		},
		color = ko.computed({
			read: function(){
				return Draw.options[colorMode()]();
			},
			write: function(color){
				return Draw.options[colorMode()](color);
			}
		}),
		swapColor = function(){
			var o = Draw.options,
				fill = o.fill();
			o.fill(o.stroke());
			o.stroke(fill);
		},
		palette = [
			"none", "#000000", "#3f3f3f", "#7f7f7f", "#bfbfbf", 
			"#ffffff", "#ff0000", "#ff7f00", "#ffff00", "#7fff00", 
			"#00ff00", "#00ff7f", "#00ffff", "#007fff", "#0000ff", 
			"#7f00ff", "#ff00ff", "#ff007f", "#7f0000", "#7f3f00", 
			"#7f7f00", "#3f7f00", "#007f00", "#007f3f", "#007f7f", 
			"#003f7f", "#00007f", "#3f007f", "#7f007f", "#7f003f", 
			"#ffaaaa", "#ffd4aa", "#ffffaa", "#d4ffaa", "#aaffaa", 
			"#aaffd4", "#aaffff", "#aad4ff", "#aaaaff", "#d4aaff", 
			"#ffaaff", "#ffaad4"
		];

	_(Draw).extend({
		color: color,
		colorMode: colorMode,
		toggleColorMode: toggleColorMode,
		swapColor: swapColor,
		palette: palette
	});
});
