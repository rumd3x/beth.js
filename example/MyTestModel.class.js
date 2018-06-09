class MyTestModel {

	constructor() {
		this.text = 'Hello World!';
		this.tests = {
			select: 1,
			radio: 'female',
			checkbox: true,
			options: [
				{value: 0, text: 'Zero'}, 
				{value: 1, text: 'One'}, 
				{value: 2, text: 'Two'}
			]
		};
	}

	selectChanged(value) {
		alert('onchange callback :)');
		alert('new value => ' + value);
	}

}