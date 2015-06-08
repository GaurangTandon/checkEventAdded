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
