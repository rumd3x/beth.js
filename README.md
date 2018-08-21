# beth.js
This JQuery based micro-framework implements "angular-like" utilities for your views.

## What's the point of this?
If you always used jQuery to manipulate the DOM and can do anything with it, but knows how bad it can get, this is for you.
If you used AngularJS and loved it AND hated it, this is also for you.

No Angular routing or scope, controllers bullshit. Do stuff the simple js way elimitaing only the DOM direct manipulation.

Less is more!

## Prerequisites
- jQuery

## Getting Started
Download the beth.js or beth.min.js file and include in your page. 

To display a value that is dinamically updated on your page just put an expression on your HTML page inside double brackets like so:
```
{{ expression }}
```

BethJS also interacts directly with your inputs and other DOM elements.
The following directives are available: (See in the example for usage, they're all simple and straightforward)
```
beth-bind
beth-change
beth-class
beth-click
beth-default
beth-disable
beth-each
beth-hide
beth-if
beth-include
beth-include-async
beth-inside
beth-html-inside
```

How do I programatically detect Beth was initalized sucessfully?
```javascript
if (Beth._initialized) {
	console.log("Beth is running...");
}
```

You can also override the default Beth update interval by setting a new integer value: (in milliseconds)
```javascript
Beth._refreshInterval = 70;
```
