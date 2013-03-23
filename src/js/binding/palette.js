define([
'knockout','underscore','jquery','hammer'
],function(ko,_,$,Hammer){
	ko.bindingHandlers.palette = {
		init: function(el,access,all,Draw) {
      var 
      call = access(),
      hammer = Hammer(el,{
        drag_min_distance:0,
        prevent_default:true
      }).on('touch drag release',function(e){
        if(e.type=='touch')
          Draw.debounce(true);
        var 
        g = e.gesture,
        x = g.center.pageX - $(el).offset().left,
        r = x/$(el).width();

        if(r>=0 && r<=1){
          call(Draw.palette()[Math.floor(
            r*Draw.palette().length)]);
        }

        if(e.type=='release')
          Draw.debounce(false);
      });
			ko.utils.domNodeDisposal.addDisposeCallback(el,function(){
				hammer.off('touch drag release');
			});
		}
	};
});
