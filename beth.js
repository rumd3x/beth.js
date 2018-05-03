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
		var matches = oldHtml.match(/\{\{.*\}\}/g);
		if (matches == null) {
			matches = [];
		}
		for(var i = 0, length1 = matches.length; i < length1; i++) {			
			var varvalue;
			var varname = $.trim(Beth._extractTextBetween(vars[i], "{{", "}}"));
			Beth._declareVar(varname, "''"); 
			varvalue = eval(varname);
			var newHtml = oldHtml;
			if (varvalue !== undefined) {
				Beth.binds.push(varname);
				newHtml = oldHtml.replace(vars[i], '<beth data-bind="'+ (Beth.binds.length-1) +'">'+varvalue+"</beth>");
			} else {
				newHtml = oldHtml.replace(vars[i], '');
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
						Beth._triggerChangeEvent($(this));
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
						Beth._triggerChangeEvent($(this));
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
						Beth._triggerChangeEvent($(this));
					}
				} catch(e) {
					console.warn("Beth: Variable not defined", e);
				}
			}
		});

		$("beth").each(function() {
			var newHtml = eval(Beth.binds[parseInt($(this).data('bind'))]);
			if ($(this).html() != newHtml) {
		 		$(this).html(unescape(newHtml));
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
				$(this).val(unescape(eval($(this).attr('beth-bind'))));
			} catch(e) {
				$(this).removeAttr('beth-bind');
				console.warn("Beth: Variable not defined", e);
			}
		});

		$("input[beth-bind][type='radio']").each(function() {
			try {
				var bethvar_name = $(this).attr('beth-bind');
				Beth._declareVar(bethvar_name, $(this).attr('beth-default'));
				$(this).prop('checked', unescape(eval($(this).attr('beth-bind'))) == $(this).val());
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

	static _triggerChangeEvent(selector) {
		var callback = selector.attr('beth-change');
		if (callback !== undefined && Beth._initialized) {
			eval(callback);
		}
	}

	static _declareVar(varname, varvalue = null) {
		if (!Beth._isVarDefined(varname)) {
			varvalue = Beth._parseValue(varvalue);
			eval("window."+varname+'="'+escape(varvalue)+'";');
			if (eval("window."+varname) == "null" || eval("window."+varname) == "undefined") {
				eval("window."+varname+'="";');
			}
			return true;
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
				if (varvalue === "") {
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