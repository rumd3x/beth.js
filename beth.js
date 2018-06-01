$(document, window, undefined).ready(function() {
	Beth._refreshInterval = 70;
	Beth._init();
});	

class Beth {

	constructor() {
		this._init();
	}

	static _init() {
		Beth._initialized = false;		
		Beth._initDynamicHtml();
		Beth._initInputValues();
		Beth._bindDirectives();
		Beth._bindVariables();
		Beth._initialized = true;
	}

	static _initDynamicHtml() {
		Beth.binds = [];
		var oldHtml = document.documentElement.innerHTML;
		var newHtml = oldHtml;
		var matches = oldHtml.match(/\{\{.*\}\}/g);
		if (matches == null) {
			matches = [];
		}
		for(var i = 0, length1 = matches.length; i < length1; i++) {			
			var varvalue;
			var current_matched_var = matches[i];
			var varname = $.trim(Beth._extractTextBetween(current_matched_var, "{{", "}}"));
			varvalue = Beth._parseValue(varname);
			newHtml = oldHtml;
			if (varvalue !== undefined) {
				Beth.binds.push(varname);				
				newHtml = oldHtml.replace(current_matched_var, '<beth data-bind="'+ (Beth.binds.length-1) +'">'+Beth._unescapeReal(varvalue)+"</beth>");
			} else {
				if ($('[beth-bind="'+varname+'"][beth-default]').length > 0) {
					Beth._declareVar(varname, $('[beth-bind="'+varname+'"][beth-default]').first().attr('beth-default'));
					Beth.binds.push(varname);
					newHtml = oldHtml.replace(current_matched_var, '<beth data-bind="'+ (Beth.binds.length-1) +'">'+Beth._unescapeReal($('[beth-bind="'+varname+'"][beth-default]').first().attr('beth-default'))+"</beth>");
				} else {
					newHtml = oldHtml.replace(current_matched_var, '');
				}
			}
			oldHtml = newHtml;
		}
		document.documentElement.innerHTML = newHtml;
	}

	static _bindVariables() {
		$("textarea[beth-bind], input[beth-bind][type!='radio'][type!='checkbox'], select[beth-bind]").each(function() {
			var bethvar_name = $(this).attr('beth-bind');
			if (Beth._isVarDefined(bethvar_name)) {
				try {
					var bethvar_value = eval(bethvar_name);
					if (bethvar_value != $(this).val()) {
						eval(bethvar_name+' = $(this).val()');
						Beth._triggerEvent($(this), 'change');
					}
				} catch(e) {
					console.warn("Beth: Variable not defined", e);
				}
			}
		});

		$("input[beth-bind][type='radio']").each(function() {
			var bethvar_name = $(this).attr('beth-bind');
			if ($(this).is(':checked') && Beth._isVarDefined(bethvar_name)) {
				try {
					var bethvar_value = eval(bethvar_name);
					if (bethvar_value != $(this).val()) {
						eval(bethvar_name+' = $(this).val()');
						Beth._triggerEvent($(this), 'change');
					}
				} catch(e) {
					console.warn("Beth: Variable not defined", e);
				}
			}
		});

		$("input[beth-bind][type='checkbox']").each(function() {
			var bethvar_name = $(this).attr('beth-bind');
			if (Beth._isVarDefined(bethvar_name)) {
				try {
					var bethvar_value = eval(bethvar_name);
					if (bethvar_value != $(this).is(':checked')) {
						eval(bethvar_name+" = $(this).is(':checked')");
						Beth._triggerEvent($(this), 'change');
					}
				} catch(e) {
					console.warn("Beth: Variable not defined", e);
				}
			}
		});

		$("beth").each(function() {
			var newHtml = eval(Beth.binds[parseInt($(this).data('bind'))]);
			if ($(this).html() != newHtml) {
		 		$(this).html(Beth._unescapeReal(newHtml));
			}
		});

		setTimeout(function() {
			Beth._bindVariables();
		}, Beth._refreshInterval);
	}

	static _initInputValues() {
		$("textarea[beth-default]:not([beth-bind]), input[beth-default]:not([beth-bind]), select[beth-default]:not([beth-bind])").each(function() {
			try {
				var bethvar_name = $(this).val(eval($(this).attr('beth-default')));
			} catch(e) {
				var bethvar_name = $(this).val($(this).attr('beth-default'));
			}
		});

		$("textarea[beth-bind], input[beth-bind][type!='radio'][type!='checkbox'], select[beth-bind]").each(function() {
			try {				
				var bethvar_name = $(this).attr('beth-bind');
				Beth._declareVar(bethvar_name, $(this).attr('beth-default'));
				$(this).val(Beth._unescapeReal(eval($(this).attr('beth-bind'))));				
			} catch(e) {
				$(this).removeAttr('beth-bind');
				console.warn("Beth: Variable not defined", e);
			}
		});

		$("input[beth-bind][type='radio']").each(function() {
			try {
				var bethvar_name = $(this).attr('beth-bind');
				Beth._declareVar(bethvar_name, $(this).attr('beth-default'));
				$(this).prop('checked', Beth._unescapeReal(eval($(this).attr('beth-bind'))) == $(this).val());
			} catch(e) {
				$(this).removeAttr('beth-bind');
				console.warn("Beth: Variable not defined", e);
			}
		});

		$("input[beth-bind][type='checkbox']").each(function() {
			try {
				var bethvar_name = $(this).attr('beth-bind');
				Beth._declareVar(bethvar_name, $(this).attr('beth-default'));
				$(this).prop('checked', eval($(this).attr('beth-bind')) ? true : false);				
			} catch(e) {
				$(this).removeAttr('beth-bind');
				console.warn("Beth: Variable not defined", e);
			}
		});
	}

	static _bindDirectives() {
		$("[beth-hide]").each(function() {
			try {
				var hide = eval($(this).attr('beth-hide'));
				if (hide == true) {
					$(this).hide();
				} else {
					$(this).show();					
				}
			} catch(e) {
				$(this).removeAttr('beth-hide');
				console.warn("Beth: Hide eval error", e);
			}
		});

		$("[beth-disable]").each(function() {
			try {
				var disable = eval($(this).attr('beth-disable'));
				if (disable == true) {
					$(this).prop('disabled', true);
				} else {
					$(this).prop('disabled', false);				
				}
			} catch(e) {
				$(this).removeAttr('beth-disable');
				console.warn("Beth: Hide eval error", e);
			}
		});

		$("[beth-if]").each(function() {
			try {
				var result = eval($(this).attr('beth-if'));
				if (result != true) {
					$(this).remove();				
				}
			} catch(e) {
				console.warn("Beth: Hide eval error", e);
			}
			$(this).removeAttr('beth-if');
		});

		setTimeout(function() {
			Beth._bindDirectives();
		}, Beth._refreshInterval);
	}

	
	static _watchVar(varname) {		
		if (varname.indexOf('.') > -1) {
			var varname_arr = varname.split('.');
			var prop = varname_arr.pop();
			var obj = varname_arr.join('.');
			var realObj = eval(obj);
		} else {
			var prop = varname;
			var realObj = window;
		}	

		realObj.watch(prop, function(param, oldVal, newVal) {			
			realObj.unwatch(param);
			console.log("[beth-bind='"+varname+"']");
			
			$("[beth-bind='"+varname+"']").each(function() {
				if ($(this).prop('type') == 'radio') {
					$(this).prop('checked', newVal == $(this).val());
				} else if ($(this).prop('type') == 'checkbox') {
					$(this).prop('checked', newVal);
				} else {
					$(this).val(Beth._unescapeReal(newVal)).change();
				}
			});
			if (realObj[prop] != newVal) {
				realObj[prop] = newVal;
			}
			setTimeout(function() {
				Beth._watchVar(varname);
			}, Beth._refreshInterval);
		});
	}
	
	static _triggerEvent(selector, event) {
		var callback = selector.attr('beth-'+event);
		if (callback !== undefined && Beth._initialized) {
			eval(callback);
		}
	}

	static _unescapeReal(escape) {
		var escaped = escape;
		while (escaped !== unescape(escaped)) {
			escaped = unescape(escaped);						
		}
		return escaped;
	}
	
	static _declareVar(varname, varvalue = null) {	
		Beth._watchVar(varname);
		if (!Beth._isVarDefined(varname)) {
			varvalue = Beth._parseValue(varvalue);
			try {
				eval("window."+varname+'="'+escape(varvalue)+'";');
				if (eval("window."+varname) == "null" || eval("window."+varname) == "undefined") {
					eval("window."+varname+'="";');
				}
				return true;
			} catch (e) {
				return false;
			}
		} else {
			return false;
		}
	}
	
	static _isVarDefined(varname) {
		var valid = true;
		try {
			valid = eval("typeof "+varname+" !== 'undefined'");
			if (valid) {
				var varvalue = eval(varname);
				if (varvalue === undefined) {
					if (Beth.binds.indexOf(varname) != -1) {
						valid = false;
					} else {
						valid = true;
					}
				} else {
					valid = true;
				}
			}
		} catch(e) {
			valid = false;
		}
		return valid;
	}

	static _parseValue(varvalue) {
		if (varvalue !== undefined) {
			try {
				varvalue = eval(varvalue);
			} catch(e) {
				varvalue = String(varvalue);
			}
		} else {
			varvalue = "";
		}

		return varvalue;
	}

	static _extractTextBetween(subject, start, end) {
		var after = subject;
	    try{
	        return subject.split(start)[1].split(end)[0];
	    } catch(e){
	    	return after;
	    }
	}

}


/*
 * object.watch polyfill
 *
 * 2012-04-03
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

// object.watch
if (!Object.prototype.watch) {
    Object.defineProperty(Object.prototype, "watch", {
        enumerable: false,
        configurable: true,
        writable: false,
        value: function(prop, handler) {
            var
                oldval = this[prop],
                newval = oldval,
                getter = function() {
                    return newval;
                },
                setter = function(val) {
                    oldval = newval;
                    return newval = handler.call(this, prop, oldval, val);
                };

			if (delete this[prop]) { // can't watch constants
			
                Object.defineProperty(this, prop, {
                    get: getter,
                    set: setter,
                    enumerable: true,
                    configurable: true
                });
            }
        }
    });
}

// object.unwatch
if (!Object.prototype.unwatch) {
    Object.defineProperty(Object.prototype, "unwatch", {
        enumerable: false,
        configurable: true,
        writable: false,
        value: function(prop) {
            var val = this[prop];
            delete this[prop]; // remove accessors
            this[prop] = val;
        }
    });
}