class MyTestModel {

	constructor() {
		this.text = 'Hello World!';
		this.tests = {
			select: 1,
			radio: 'female',
			checkbox: true
		};
	}

	selectChanged(value) {
		alert('onchange callback :)');
		alert('new value => ' + value);
	}

}