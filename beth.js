$(document, window, undefined).ready(function() {
	Beth._refreshInterval = 15;
	Beth._init();
});	

class Beth {

	constructor() {
		this._init();
	}

	static _init() {
		Beth._initialized = false;
		Beth.binds = [];
		var oldHtml = document.documentElement.innerHTML;
		var vars = oldHtml.match(/\{\{.*\}\}/g);
		for(var i = 0, length1 = vars.length; i < length1; i++) {			
			var varvalue;
			var varname = $.trim(Beth._extractTextBetween(vars[i], "{{", "}}"));
			try {
				varvalue = eval(varname);
			} catch(e) {
				varvalue = undefined;
				console.warn("Beth Parsing Error:", e);
			}
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
		Beth._initInputValues();
		Beth._bindVariables();
	}

	static _bindVariables() {
		$("input[beth-bind][type!='radio'][type!='checkbox'], select[beth-bind]").each(function() {
			var bethvar_name = $(this).attr('beth-bind');
			if (Beth._isValidEval(bethvar_name)) {
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
			if ($(this).is(':checked') && Beth._isValidEval(bethvar_name)) {
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
			if (Beth._isValidEval(bethvar_name)) {
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
		 		$(this).html(newHtml);
			}
		});

		setTimeout(function() {
			Beth._bindVariables();
		}, Beth._refreshInterval);

		if (!Beth._initialized) { 
			Beth._initialized = true; 
		}
	}

	static _triggerChangeEvent(selector) {
		var callback = selector.attr('beth-change');
		if (callback !== undefined && Beth._initialized) {
			eval(callback);
		}
	}

	static _isValidEval(varname) {
		var valid = true;
		try {
			valid = eval("typeof instance.tests.checkbox.toString() !== 'undefined'")
		} catch(e) {
			valid = false;
		}
		return valid;
	}

	static _initInputValues() {
		$("input[beth-bind][type!='radio'][type!='checkbox'], select[beth-bind]").each(function() {
			try {
				$(this).val(eval($(this).attr('beth-bind')));
			} catch(e) {
				$(this).removeAttr('beth-bind');
				console.warn("Beth: Variable not defined", e);
			}
		});

		$("input[beth-bind][type='radio']").each(function() {
			try {
				$(this).prop('checked', eval($(this).attr('beth-bind')) == $(this).val());
			} catch(e) {
				$(this).removeAttr('beth-bind');
				console.warn("Beth: Variable not defined", e);
			}
		});

		$("input[beth-bind][type='checkbox']").each(function() {
			try {
				$(this).prop('checked', $(this).attr('beth-bind'));
			} catch(e) {
				$(this).removeAttr('beth-bind');
				console.warn("Beth: Variable not defined", e);
			}
		});
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