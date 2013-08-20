#### when.js

A small library that provides smarter `<script>` loading / initialization.

***

#### Example configuration

You can use something like the following to declare some JavaScript packages:

	__.packages({
		'hello': ['scripts/helloworld.js'],
		'foo': ['scripts/bar.js']
	});

Then, tell when.js *when* to load these packages (and some other files):

	__({
		'*': 'hello', // Loads 'hello' package as soon as the page loads
		'delay 3000': 'delayed-script.js', // Loads delayed-script.js after 3 seconds
		'click #some-button': ['button-action.js', 'thing.js'], // Loads some more scripts when a button is clicked
		'in body': 'foo' // Loads 'foo' package when hovering over the body
	});

***

#### Demo

A working example can be found at [beacham.ca/when.js](http://beacham.ca/when.js "when.js")
