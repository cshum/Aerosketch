define(function(){
	var count = 0,
		prefix = 'diu',
		setPrefix = function(val){
			prefix = val;
		},
		generate = function(){
			return prefix+'_'+(++count);
		};
	return {
		setPrefix:setPrefix,
		generate:generate
	};
});
