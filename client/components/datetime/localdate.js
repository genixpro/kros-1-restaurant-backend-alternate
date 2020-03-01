(function () {
	angular.module('newsApp').directive('localdate', directive);

	directive.$inject = ['$parse', '$rootScope'];

	function directive($parse, $rootScope) {
		var directive = {
			restrict: 'A',
			require: ['ngModel'],
			link: link
		};
		return directive;

		function link(scope, element, attr, ctrls) {
			var ngModelController = ctrls[0];

			$rootScope.$watch('timezone', function (newValue, oldValue) {
				if (newValue != oldValue) {
					var currentValue = ngModelController.$modelValue;
					ngModelController.$modelValue = null;
					scope.$evalAsync(function () {
						ngModelController.$modelValue = currentValue;
					});
				}
			});

			ngModelController.$parsers.push(function (viewValue) {
        if (!viewValue) {
          return undefined;
        }
				var dt = new Date(viewValue);

				dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
				dt.setMinutes(dt.getMinutes() - getOffset(dt));
				console.log(dt.getTime());
				return dt.getTime();
			});

			ngModelController.$formatters.push(function (modelValue) {
				if (!modelValue) {
					return undefined;
				}

				var dt = new Date(modelValue);
				dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset());
				dt.setMinutes(dt.getMinutes() + getOffset(dt));

				return dt;
			});
		}

		function getOffset(dt) {
			var timezone = $rootScope.timezone;
			if (!timezone) {
				return 0;
			}
			return window.moment.tz(dt, timezone).utcOffset();
		}
	}
})();