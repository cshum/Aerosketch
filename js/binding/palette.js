define(["knockout","underscore","jquery","hammer"],function(e,t,n,a){e.bindingHandlers.palette={init:function(t,o,r,d){var i=o(),l=a(t,{drag_min_distance:0,prevent_default:!0}).on("touch drag release",function(e){"touch"==e.type&&d.debounce(!0);var a=e.gesture,o=a.center.pageX-n(t).offset().left,r=o/n(t).width();r>=0&&r<=1&&i(d.palette()[Math.floor(r*d.palette().length)]),"release"==e.type&&d.debounce(!1)});e.utils.domNodeDisposal.addDisposeCallback(t,function(){l.off("touch drag release")})}}});