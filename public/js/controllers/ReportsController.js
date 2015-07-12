angular.module('bfacp').controller('ReportsController', ['$scope', '$http', '$interval', '$modal', function($scope, $http, $interval, $modal) {
    $scope.reports = {
        refresh: false,
        data: []
    };

    $scope.actions = [];

    /**
     * Fetchs the actions that can be used on reports.
     * @return void
     */
    $scope.getActions = function() {
        $http.get('api/reports/actions').success(function(data, status) {
            angular.forEach(data, function(action, key) {
                $scope.actions.push({
                    name: action,
                    id: key
                });
            });
        }).error(function(data, status) {
            console.error('Unable to get report actions. Will retry in 5 seconds.');
            setTimeout(function() {
                $scope.getActions();
            }, 5 * 1000);
        });
    };

    $scope.getActions();

    /**
     * Fetchs the latest reports.
     * @return void
     */
    $scope.latestReports = function() {
        $scope.reports.refresh = true;
        $http.get('api/reports').success(function(data, status) {
            $scope.reports.data = data.data;
        }).error(function(data, status) {

        }).finally(function() {
            $scope.reports.refresh = false;
        });
    };

    // Re-fetch the reports every 30 seconds
    $interval($scope.latestReports, 30 * 1000);

    $scope.open = function(report) {
        var reportInstance = $modal.open({
            animation: true,
            templateUrl: 'js/templates/modals/report.html',
            controller: 'ReportInstanceController',
            resolve: {
                report: function() {
                    return report;
                },
                actions: function() {
                    return $scope.actions;
                }
            }
        });
    };
}])
.controller('ReportInstanceController', ['$scope', '$modalInstance', 'report', 'actions', 'ReportFactory', function($scope, $modalInstance, report, actions, ReportFactory) {
    $scope.report = report;
    $scope.actions = actions;
    $scope.reportReason = report.record_message;
    $scope.actionSelected = null;
    $scope.working = false;
    $scope.edit = false;

    $scope.ok = function () {
        var action = $scope.actions[$scope.actionSelected];

        if(action === undefined) {
            alert('You must select a valid action.');
            return;
        }

        if(action.id == 8) {
            if(!confirm('Are you sure you want to permanently ban ' + report.target_name + '?')) {
                return;
            }
        }

        if(action.id == 7) {
            if(!confirm('Are you sure you want to temporarily ban ' + report.target_name + '?')) {
                return;
            }
        }

        $scope.working = true;

        ReportFactory.setAction(action);
        ReportFactory.setRecordId($scope.report);
        ReportFactory.setReason($scope.reportReason);
        ReportFactory.updateReport().then(function(data) {
            toastr.success(data.message);
            $modalInstance.close();
        }, function(data) {
            toastr.error(data.message);
            if(data.status_code == 422) {
                $scope.cancel();
            }
        }).finally(function() {
            $scope.working = false;
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);