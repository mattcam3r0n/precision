angular.module('drillApp')
    .directive('customOnChange', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                const onChangeHandler = scope.$eval(attrs.customOnChange);
                element.on('change', onChangeHandler);
                element.on('$destroy', function() {
                    element.off('change', onChangeHandler);
                });
            },
        };
    });
