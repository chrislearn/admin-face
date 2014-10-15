(function(name, definition) {
    if (typeof define === 'function') {
        define(definition);
    }
    /* jshint ignore:start */
    else if (typeof module !== 'undefined' && module.exports) {
        module.exports = definition();
    }
    /* jshint ignore:end */
    else {
        this[name] = definition();
    }
})('hance', function() {
    "use strict";
    var class2type = {},toString = class2type.toString;
    var scheme = {
        getType: function(obj) {
            if (obj == null) {
                return obj + "";
            }
            // Support: Android < 4.0, iOS < 6 (functionish RegExp)
            return typeof obj === "object" || typeof obj === "function" ?
                {}[toString.call(obj)] || "object" :
                typeof obj;
        },
        isFunction: function(obj) {
            return scheme.getType(obj) === "function";
        },
        isArray: Array.isArray,
        isWindow: function(obj) {
            return obj != null && obj === obj.window;
        },

        isNumeric: function(obj) {
            // parseFloat NaNs numeric-cast false positives (null|true|false|"")
            // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
            // subtraction forces infinities to NaN
            return obj - parseFloat(obj) >= 0;
        },
        isPlainObject: function(obj) {
            // Not plain objects:
            // - Any object or value whose internal [[Class]] property is not "[object Object]"
            // - DOM nodes
            // - window
            if (scheme.type(obj) !== "object" || obj.nodeType || scheme.isWindow(obj)) {
                return false;
            }

            // Support: Firefox <20
            // The try/catch suppresses exceptions thrown when attempting to access
            // the "constructor" property of certain host objects, ie. |window.location|
            // https://bugzilla.mozilla.org/show_bug.cgi?id=814622
            try {
                if (obj.constructor && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                    return false;
                }
            } catch (e) {
                return false;
            }

            // If the function hasn't returned already, we're confident that
            // |obj| is a plain object, created by {} or constructed with new Object
            return true;
        },

        isEmptyObject: function(obj) {
            var name;
            for (name in obj) {
                return false;
            }
            return true;
        }
    }, objs = {};
    scheme.version = "0.4";
    scheme.fetch = function(sign) {
        return objs[sign];
    };
    scheme.register = function(sign, obj) {
        objs[sign] = obj;
    };

    scheme.extend = function(a, b) {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // Handle a deep copy situation
        if (typeof target === "boolean") {
            deep = target;

            // skip the boolean and the target
            target = arguments[i] || {};
            i++;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if (typeof target !== "object" && !scheme.isFunction(target)) {
            target = {};
        }

        if (i === length) {
            target = this;
            i--;
        }

        for (; i < length; i++) {
            // Only deal with non-null/undefined values
            if ((options = arguments[i]) != null) {
                // Extend the base object
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (scheme.isPlainObject(copy) || (copyIsArray = scheme.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && jQuery.isArray(src) ? src : [];

                        } else {
                            clone = src && scheme.isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[name] = scheme.extend(deep, clone, copy);

                        // Don't bring in undefined values
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        return target;
    };
    scheme.inherit = function(sign, ascent) {
        if (typeof sign !== "string") {
            ascent = sign;
            sign = null;
        }
        var process = function(descent) {
            var ascent = descent.ascent;
            if (ascent) {
                if (!ascent.processed) {
                    process(ascent);
                }
                scheme.extend(descent, ascent);
                for (var i in descent) {
                    if (typeof descent[i] === 'function') {
                        descent[i]._scheme = descent;
                        descent[i]._name = i;
                    }
                }
                if (descent.prototype) {
                    for (var j in descent.prototype) {
                        if (typeof descent.prototype[j] === 'function') {
                            descent.prototype[j]._scheme = descent;
                            descent.prototype[j]._name = j;
                        }
                    }
                }
            }
            if (descent.init && typeof descent.init === 'function') {
                descent.init.apply(descent);
            }
            descent.processed = true;
        };

        var descent = null;
        if (typeof ascent === 'function') {
            descent = function() {
                if (!descent.processed) {
                    process(descent);
                }
                if (descent.prototype.init) {
                    descent.prototype.init.apply(this, arguments);
                }
            };
            var Proto = function() {};
            Proto.prototype = ascent.prototype;
            descent.prototype = scheme.extend(new Proto(), descent.prototype);
            descent.prototype.constructor = descent;
            descent.prototype.sign = sign;
            descent.prototype.ascent = ascent;
            descent.uber = ascent.prototype;
        } else {
            descent = {};
            scheme.extend(descent, ascent);
        }

        if (sign !== null && sign !== "") {
            objs[sign] = descent;
        }

        descent.processed = false;
        descent.sign = sign;
        descent.ascent = ascent;
        return descent;
    };

    scheme.properties = function(obj, props) {
        for (var i = 0, il = props.length; i < il; i++) {
            scheme.property(obj, props[i]);
        }
        return obj;
    };
    scheme.property = function(obj, prop) {
        if (typeof prop === 'string') {
            prop = {
                name: prop,
                getter: true,
                setter: true
            };
        }
        prop.getter = (prop.getter === undefined ? true : prop.getter);
        prop.setter = (prop.setter === undefined ? true : prop.setter);

        var propName = prop.name,
            n = prop.name.charAt(0).toUpperCase() + prop.name.substr(1),
            field = "_" + propName;
        obj[field] = prop.value;

        if (prop.getter) {
            var getfun = "get" + n;
            if (obj[getfun] === undefined) {
                obj[getfun] = function() {
                    return this[field];
                };
            }
            prop['get'] = function() {
                return this[getfun]();
            };
        }
        if (prop.setter) {
            var setfun = "set" + n;
            if (obj[setfun] === undefined) {
                obj[setfun] = function(value) {
                    this[field] = value;
                };
            }
            prop['set'] = function(value) {
                if (this[setfun] !== value) {
                    this[setfun](value);
                }
            };
        }
        delete prop.name;
        delete prop.getter;
        delete prop.setter;
        delete prop.value;
        try {
            Object.defineProperty(obj, propName, prop);
        } catch (e) {
            if (window.console && window.console.warn) {
                window.console.warn("can not create property[name:" + propName + '], please use get set function instead!');
            }
        }
        return obj;
    };

    //http://www.alloyteam.com/2012/12/4304/
    // scheme.curry = function (fn) {
    //     var __args = [];
    //     return function () {
    //         if (arguments.length === 0) {
    //             fn.apply(this, __args);
    //             __args.length = 0;
    //         }
    //         [].push.apply(__args, arguments);
    //         return arguments.callee;
    //     };
    // };
    //http://www.alloyteam.com/2012/11/javascript-throttle/#prettyPhoto
    // scheme.throttle = function (fn, delay, mustRunDelay) {
    //     var timer = null;
    //     var t_start;
    //     return function () {
    //         var context = this, args = arguments, t_curr = +new Date();
    //         clearTimeout(timer);
    //         if (!t_start) {
    //             t_start = t_curr;
    //         }
    //         if (t_curr - t_start >= mustRunDelay) {
    //             fn.apply(context, args);
    //             t_start = t_curr;
    //         }
    //         else {
    //             timer = setTimeout(function () {
    //                 fn.apply(context, args);
    //             }, delay);
    //         }
    //     };
    // };

    return scheme;
});
