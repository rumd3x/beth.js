var instance = new MyTestModel();
var string_inside = "<b>Testing</b> Beth-Inside <i>directive</i> with and <ul><li>without</li> <li>HTML</li></ul> content!";

$(document).ready(function() {
	$("#btnGenText").click(function() {
		instance.text = Math.random().toString(36).substring(2);
	});
});