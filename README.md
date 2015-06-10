# checkEventAdded.js
A nifty JavaScript snippet (= 685 chars minified) that gives you two functions: i) `hasEvent(Node elm, String event)` ii) `getEvents(Node elm)`, along with a callback functionality for `add/RemoveEventListener`, modifying the prototype obviously.

To get started, just stick this code at the top of your script. **No library required**. Only pure vanilla JS is used.

    var hasEvent,getEvents;!function(){function b(a,b,c){c?a.dataset.events+=","+b:a.dataset.events=a.dataset.events.replace(new RegExp(b),"")}function c(a,c){var d=EventTarget.prototype[a+"EventListener"];return function(a,e,f,g,h){this.dataset.events||(this.dataset.events="");var i=hasEvent(this,a);return c&&i||!c&&!i?(h&&h(),!1):(d.call(this,a,e,f),b(this,a,c),g&&g(),!0)}}hasEvent=function(a,b){var c=a.dataset.events;return c?new RegExp(b).test(c):!1},getEvents=function(a){return a.dataset.events.replace(/(^,+)|(,+$)/g,"").split(",").filter(function(a){return""!==a})},EventTarget.prototype.addEventListener=c("add",!0),EventTarget.prototype.removeEventListener=c("remove",!1)}();

#### [Live Demo](http://jsfiddle.net/vo51y90y/8/)

This script provides two global functions:

### `hasEvent(Node elm, String event)`

Returns `true` if `elm` has a listener for `event` attached to itself. Note that it does not work for events added in HTML markup and through the `elm.on_event = ` syntax.

### `getEvents(Nodet elm)`

Returns an array of strings containing all the names of the events which are attached to the element. Note that it does not work for events added in HTML markup and through the `elm.on_event = ` syntax.

### Callback functionality for `add/RemoveEventListener`

Callbacks can be specified in the following manner:

    elm.addEventListener(event_name, handler, use_capture, callback1, callback2) // or removeEventListener
    
`callback1` will be called if listener was added (or removed). Otherwise, `callback2` will be called. Make sure to `.bind()` both the callbacks in case `this` value is required, because otherwise the context of `this` would change.

**Note:** In case the element already had a listener for the said event, the new handler wil not be attached to the element. You need to remove the previous handler before attaching the new one.

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
