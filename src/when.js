function When(config) {
	if (!config) {
		return;
	}

	var loadScript = function(path) {
		var head = document.getElementsByTagName('head')[0];
		var s = document.createElement('script');
		s.type = 'text/javascript';
		s.src = path;
		head.appendChild(s);
	};

	var loadScripts = function(paths) {
		for (var i = 0; i < paths.length; i++) {
			loadScript(paths[i]);
		}
	};

	var defer = function(func, args) {
		window.addEventListener('load', function() {
			func.apply(window, args);
		});
	};

	var bindScript = function(hint, paths) {
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
			loadScripts(paths);

			for (var i = 0; i < elements.length; i++) {
				elements[i].removeEventListener('mouseover', listener);
			}			
		};

		for (var i = 0; i < elements.length; i++) {
			elements[i].addEventListener('mouseover', listener, false);
		}
	};

	for (var key in config) {
		if (!config.hasOwnProperty(key)) {
			continue;
		}

		(function(key, paths) {
			if (key == '*') {
				loadScripts(paths);
			}
			else if (key.indexOf('delay ') == 0) {
				var value = parseInt(key.split(' ')[1], 10);

				setTimeout(function() {
					loadScripts(paths);
				}, value);
			}
			else if (key.indexOf('in ') == 0) {
				defer(bindScript, [key.split(' ')[1], paths]);
			}
		})(key, config[key]);
	}
};
