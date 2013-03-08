define(function(){
	return function(n){
		var buffer = [], 
			triggered = false,
			call = function(){
				var count = 0;
				while((!n || count<n) && buffer.length>0){
					buffer.shift()();
					count++;
				}
				if(buffer.length>0) setTimeout(call,0);
				else triggered = false;
			};
		return function(func){
			buffer.push(func);
			if(!triggered){
				setTimeout(call,0);
				triggered = true;
			}
		};
	};
});
