define(['underscore','draw','draw.edit'],function(_,Draw){
	return {
		load: function(params, require, callback){
			require(
				_(params.split(/[,| ]/)).map(function(tool){
					return 'tool/'+tool;
				}),
				function(){
					Draw.tools(_(arguments).tail());
					Draw.tool(_(arguments).head());
					callback();
				}
			);
		}
	};
});
