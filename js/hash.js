define(['underscore'],function(_){
	var count = 0,
		prefix = 'diu',
		generate = function(){
			return prefix+(++count);
		}
	return {
		generate:generate
	};
});
