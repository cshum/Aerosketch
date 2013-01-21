define(['underscore','draw','draw.history','draw.options'
],function(_,Draw){
	return {
		load: function(params, require, callback){
			require(
				_(params.split(/[,| ]/)).map(function(control){
					return 'control/'+control;
				}),
				function(){
					Draw.controls(_(arguments).tail());
					Draw.baseControl(_(arguments).head());
					callback();
				}
			);
		}
	};
});
