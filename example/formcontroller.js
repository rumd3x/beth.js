var instance = new MyTestModel();

$(document).ready(function() {
	$("#btnGenText").click(function() {
		instance.text = Math.random().toString(36).substring(2);
	});
});