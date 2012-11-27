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
			var action = undos.pop();
			commit(action);
			redos.push(inverse(action));
		},
		redo = function(){
			if(redos.length==0) return;
			var action = redos.pop();
			commit(action);
			undos.push(inverse(action));
		}

	_(Draw).extend({
		track:track,
		commit:commit,
		undo:undo,
		redo:redo
	});
});
