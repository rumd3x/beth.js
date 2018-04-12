$(document).ready(function() {
	Beth.refreshInterval = 15;
	Beth.init();
});

class Beth {

	constructor() {
		this.init();
	}

	static init() {
		Beth.binds = [];
		var oldHtml = $('html').html();
		var vars = oldHtml.match(/\{\{.*\}\}/g);
		for(var i = 0, length1 = vars.length; i < length1; i++) {			
			var varvalue;
			var varname = $.trim(Beth.extractTextBetween(vars[i], "{{", "}}"));
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
		$('html').html(newHtml);
		Beth.initInputValues();
		Beth.bindVariables();
	}

	static bindVariables() {
		$("beth").each(function() {
			var newHtml = eval(Beth.binds[$(this).data('bind')]);
			if ($(this).html() != newHtml) {
		 		$(this).html(newHtml);
			}
		});

		$("input[beth-bind][type!='radio'][type!='checkbox'], select[beth-bind]").each(function() {
			var bethvar = $(this).attr('beth-bind');
			window[bethvar] = $(this).val();
		});

		$("input[beth-bind][type='radio']").each(function() {
			if ($(this).prop('checked')) {
				var bethvar = $(this).attr('beth-bind');
				window[bethvar] = $(this).val();
			}
		});

		$("input[beth-bind][type='checkbox']").each(function() {
			var bethvar = $(this).attr('beth-bind');
			window[bethvar] = $(this).is(':checked');
		});

		setTimeout(function() {
			Beth.bindVariables();
		}, Beth.refreshInterval);
	}

	static initInputValues() {
		$("input[beth-bind][type!='radio'][type!='checkbox'], select[beth-bind]").each(function() {
			$(this).val(eval($(this).attr('beth-bind')));
		});

		$("input[beth-bind][type='radio']").each(function() {
			$(this).prop('checked', eval($(this).attr('beth-bind')) == $(this).val());
		});

		$("input[beth-bind][type='checkbox']").each(function() {
			$(this).prop('checked', $(this).attr('beth-bind'));
		});
	}

	static extractTextBetween(subject, start, end) {
		var after = subject;
	    try{
	        return subject.split(start)[1].split(end)[0];
	    } catch(e){
	    	return after;
	    }
	}

}