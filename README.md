# beth.js
This JQuery based tool implements "angular-like" utilities for your front-end.

## What's the point of this?
If you always used jQuery to manipulate the DOM and can do anything with it, but knows how bad it can get, this is for you.

No bullshit. Just do your stuff the simple way, eliminating direct DOM manipulation.

Less sometimes is more!

## Prerequisites
- jQuery

## Getting Started
Download the beth.js or beth.min.js file and include in your page anywhere after jQuery is loaded. 

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
