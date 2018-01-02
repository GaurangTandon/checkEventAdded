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
            if (!this.dataset) this.dataset = {};
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
