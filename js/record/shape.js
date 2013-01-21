define([
	'underscore','draw','shape/factory'
],function(_,Draw,Factory){
	var shapeMap = {}, optionsMap = {},
		Record = function(data){
			var hash, type, options, original;
			if(data._shape){
				hash = data.getHash();
				type = data.getType();
				options = data.getOptions();
				shapeMap[hash] = data;
			}else{
				hash = data.hash;
				type = data.type;
				options = data.options;
				if(hash in shapeMap)
					shapeMap[hash].setOptions(options);
				else{
					var Shape = Factory(type);
					shapeMap[hash] = new Shape(options,hash);
					//todo: specific layer
					Draw.add(shapeMap[hash]);
				}
			}
			optionsMap[hash] = optionsMap[hash] || {visible:false};
			original = {};
			_(options).each(function(val,key){
				if(optionsMap[hash][key] != val){
					if(key in optionsMap[hash])
						original[key] = optionsMap[hash][key];
				}else delete options[key];
			});
			_(optionsMap[hash]).extend(options);
			
			this.revert = function(){
				return new Record({
					type:type, options:original, hash:hash
				});
			};
			this.serialize = function(){
				return {
					type:type, options:options, hash:hash
				};
			};
			this.destroy = function(){
				if(shapeMap[hash] && !shapeMap[hash].visible()){
					shapeMap[hash]._destroy(true);
					delete shapeMap[hash];
				}
			};
		};

	return Record;
});
