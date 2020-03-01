'use strict';

angular.module('newsApp')
	.factory('Modal', function ($rootScope, $modal, $q) {
		var service = {
			confirm: confirm
		};
		return service;

		// ****************************************************************

		function confirm(options) {
			if (!options.message) {
				throw new Error('"message" parameter must be provided');
			}

			options.title = options.title || 'Confirm';
			options.modalClass = options.modalClass || 'modal-default';
			options.dismissable = options.dismissable || true;

			var modal = openModal({
				modal: {
					dismissable: options.dismissable,
					title: options.title,
					html: options.message,
					buttons: [{
						classes: 'btn-primary',
						text: 'Yes',
						click: function (e) {
							modal.close(e);
						}
					}, {
						classes: 'btn-default',
						text: 'No',
						click: function (e) {
							modal.dismiss(e);
						}
					}]
				}
			}, options.modalClass);

			return modal.result;
		}

		function openModal(scope, modalClass) {
			var modalScope = $rootScope.$new();
			scope = scope || {};

			angular.extend(modalScope, scope);

			return $modal.open({
				templateUrl: 'components/modal/modal.html',
				windowClass: modalClass,
				scope: modalScope
			});
		};
	});