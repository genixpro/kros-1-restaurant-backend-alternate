angular
	.module('newsApp')
	.provider('toastr', [function() {
		var defaultOptions = {};

		var service = {
			notify: notify,
			danger: danger,
			info: info,
			warning: warning,
			success: success
		};
		return {
			$get: function() {
				return service;
			},
			setDefaultOptions: function(options) {
				defaultOptions = options;
			}
		};

		// ***********************************************

		function notify(message, options) {
			options = options || {};

			var optionsCopy = angular.copy(defaultOptions);
			angular.extend(optionsCopy, options);

			$.notify(message, optionsCopy);
		}

		function danger(message, options) {
			options = options || {};
			options.status = 'danger';
			notify(message, options);
		}

		function info(message, options) {
			options = options || {};
			options.status = 'info';
			notify(message, options);
		}

		function success(message, options) {
			options = options || {};
			options.status = 'success';
			notify(message, options);
		}

		function warning(message, options) {
			options = options || {};
			options.status = 'warning';
			notify(message, options);
		}
	}]);