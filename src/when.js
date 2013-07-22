var wloadEvent = new Event('whenloaded');

When = function(config) {
	if (!config) {
		return;
	}

	var defer = function(func, args) {
		window.addEventListener('load', function() {
			func.apply(window, args);
		});
	};

	var bindScript = function(hint, event, paths) {
		if (hint[0] == '#') {
			var el = document.getElementById(hint.substr(1));

			if (!el) {
				return;
			}

			var elements = [el];
		}
		else if (hint[0] == '.') {
			var elements = document.getElementsByClassName(hint.substr(1));
		}
		else {
			return;
		}

		var listener = function() {
			return function() {
				When.load(paths);

				for (var i = 0; i < elements.length; i++) {
					elements[i].removeEventListener(event, listener);
				}			
			}
		};

		for (var i = 0; i < elements.length; i++) {
			elements[i].addEventListener(event, listener(event), false);
		}
	};

	for (var key in config) {
		if (!config.hasOwnProperty(key)) {
			continue;
		}

		(function(key, paths) {
			if (key == '*') {
				When.load(paths);
			}
			else if (key.indexOf('delay ') == 0) {
				var value = parseInt(key.split(' ')[1], 10);

				setTimeout(function() {
					When.load(paths);
				}, value);
			}
			else if (key.indexOf('in ') == 0) {
				defer(bindScript, [key.split(' ')[1], 'mouseover', paths]);
			}
			else if (key.indexOf('click ') == 0) {
				defer(bindScript, [key.split(' ')[1], 'click', paths]);
			}
		})(key, config[key]);
	}

	When._initialized = true;
	window.dispatchEvent(wloadEvent);
};

When.version = When.__version__ = '0.1';
When._initialized = false;
When._packages = {};
When._defaults = {'alias': '__'};

When.loadScript = function(path) {
	var head = document.getElementsByTagName('head')[0];
	var tag = document.createElement('script');

	tag.type = 'text/javascript';
	tag.src = path;

	head.appendChild(tag);
};

When.load = function(source) {
	if (source in When._packages) {
		for (var i = 0; i < When._packages[source].length; i++) {
			When.loadScript(When._packages[source][i]);
		}
	}
	else if (typeof source == 'string') {
		When.loadScript(source);
	}
	else {
		for (var i = 0; i < source.length; i++) {
			When.loadScript(source[i]);
		}
	}
};

When.config = function(config) {
	for (var key in config) {
		if (When._defaults.hasOwnProperty(key)) { 
			When._defaults[key] = config[key];
			if (key == 'alias') {
				window[key] = window[key] || When;
			}
		}
	}
};

When.packages = function(config) {
	for (var key in config) {
		if (config.hasOwnProperty(key)) {
			When._packages[key] = config[key];
		}
	}
};

When.ready = function(func) {
	if (When._initialized) {
		func();
	}
	else {
		window.addEventListener(wloadEvent, func);
	}
};

if (typeof window[When._defaults.alias] == 'undefined') {
	window[When._defaults.alias] = When;
}

;
