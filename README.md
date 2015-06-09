# checkEventAdded.js
A nifty JavaScript snippet (= 685 chars minified) to check if an event has already been added to an element.

Add this script at the very top of your js file:

    var hasEvent,getEvents;!function(){function b(a,b,c){c?a.dataset.events+=","+b:a.dataset.events=a.dataset.events.replace(new RegExp(b),"")}function c(a,c){var d=EventTarget.prototype[a+"EventListener"];return function(a,e,f,g,h){this.dataset.events||(this.dataset.events="");var i=hasEvent(this,a);return c&&i||!c&&!i?(h&&h(),!1):(d.call(this,a,e,f),b(this,a,c),g&&g(),!0)}}hasEvent=function(a,b){var c=a.dataset.events;return c?new RegExp(b).test(c):!1},getEvents=function(a){return a.dataset.events.replace(/(^,+)|(,+$)/g,"").split(",").filter(function(a){return""!==a})},EventTarget.prototype.addEventListener=c("add",!0),EventTarget.prototype.removeEventListener=c("remove",!1)}();

**[Live Demo](http://jsfiddle.net/vo51y90y/8/)**
    
## How to use?

You will not need to make any major changes to your existing JS code. Wherever in your code, you have, say, this:

    elm.addEventListener("onload", func, false);
    
change it to:

    elm.addEventListener("onload", func, false, callback1, callback2);
    
`callback1` will be called if event was not already present on the element. Otherwise, `callback2` will be called. In the former case, `callback1` is executed *after* executing `func`. Make sure to `.bind()` both the callbacks in case `this` value is required, because otherwise the context of this would change.

**Note:** in case element already had a listener for the said event, the new handler wil not be attached to the element.

## Unminified code

    var hasEvent, getEvents;
    (function (window) {
        hasEvent = function (elm, type) {
            var ev = elm.dataset.events;
            if (!ev) return false;
    
            return (new RegExp(type)).test(ev);
        };
    
        getEvents = function (elm) {
            return elm.dataset.events.replace(/(^,+)|(,+$)/g, "").split(",").filter(function (elm) {
                return elm !== "";
            });;
        };
    
        function addRemoveEvent(elm, type, bool) {
            if (bool) elm.dataset.events += "," + type;
            else elm.dataset.events = elm.dataset.events.replace(new RegExp(type), "");
        }
    
        function makeListener(name, bool) {
            var f = EventTarget.prototype[name + "EventListener"];
    
            return function (type, callback, capture, cb1, cb2) {
                if (!this.dataset.events) this.dataset.events = "";
    
                var has = hasEvent(this, type);
    
                // event has already been added/removed
                // do not attach listener
                if ((bool && has) || (!bool && !has)) {
                    if (cb2) cb2();
                    return false;
                }
    
                f.call(this, type, callback, capture);
                addRemoveEvent(this, type, bool);
    
                if (cb1) cb1();
    
                return true;
            };
        }

        EventTarget.prototype.addEventListener = makeListener("add", true);
        EventTarget.prototype.removeEventListener = makeListener("remove", false);
    })();
