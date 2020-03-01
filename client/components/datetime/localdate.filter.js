(function () {
	angular.module('newsApp').filter('localdate', filter);

	filter.$inject = ['$parse', '$rootScope'];

	function filter($parse, $rootScope) {
		return function(input) {
			if (!input) {
				return null;
			}

			var dt = new Date(input);
			dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset());
			dt.setMinutes(dt.getMinutes() + getOffset(dt));
			return dt.getTime();
		};
		
		function getOffset(dt) {
			var timezone = $rootScope.timezone;
			if (!timezone) {
				return 0;
			}
			return window.moment.tz(dt, timezone).utcOffset();
		}
	}
})();