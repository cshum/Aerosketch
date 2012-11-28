define(['knockout','underscore','draw'],function(ko,_,Draw){
	var map = {},
		sessionId = 167,
		undos = [], 
		redos = [],

		track = function(){
			_(arguments).map(function(obj){
				return obj.getOptions();
			});
		},
		commit = function(){
		},

		inverse = function(action){
		},
		undo = function(){
			if(undos.length==0) return;
			var actions = undos.pop();
			commit(actions);
			redos.push(_(actions).map(inverse));
		},
		redo = function(){
			if(redos.length==0) return;
			var actions = redos.pop();
			commit(actions);
			undos.push(_(actions).map(inverse));
		}

	_(Draw).extend({
		track:track,
		commit:commit,
		undo:undo,
		redo:redo
	});
});
