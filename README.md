# checkEventAdded.js
JavaScript code (< 300 bytes minifed) to check if an event has already been added to an element.

Add this script at the very top of your js file:

    !function(){function b(a,b){var c={},d=EventTarget.prototype[a+"EventListener"];return function(a,e,f,g,h){return c[a]==b||!b&&!c[a]?(h(),!1):(d.call(this,a,e,f),c[a]=b,g(),!0)}}EventTarget.prototype.addEventListener=b("add",!0),EventTarget.prototype.removeEventListener=b("remove",!1)}();

**[Live Demo](http://jsfiddle.net/y22a2rvh/)**
    
## How to use it?

You will not need to make any major changes to your existing JS code. Wherever in your code, you have, say, this:

    elm.addEventListener("onload", func, false);
    
change it to:

    elm.addEventListener("onload", func, false, callback1, callback2);
    
`callback1` will be called if event was not already present on the element. Otherwise, `callback2` will be called. In the former case, `callback1` is executed *after* executing `func`. Make sure to `.bind()` both the callbacks in case `this` value is required, because otherwise the context of this would change.

**Note:** in case element already had a listener for the said event, the new handler wil not be attached to the element.

## Unminified code

    // override add/removeEventListener method to
    // keep track of all added events to a element
    (function(window){
    	function makeListener(name, bool){
    		var list = {}, f = EventTarget.prototype[name + "EventListener"];
    		
    		return function(type, callback, capture, cb1, cb2){
    			// event has already been added
    			// do not attach listener
    			if(list[type] == bool || (!bool && !list[type])){
    				cb2(); return false;
    			}
    
    			f.call(this, type, callback, capture);				
    			list[type] = bool;
    			cb1();
    			
    			return true;
    		};
    	}
    	
    	EventTarget.prototype.addEventListener = makeListener("add", true);
    	EventTarget.prototype.removeEventListener = makeListener("remove", false);
    })();
