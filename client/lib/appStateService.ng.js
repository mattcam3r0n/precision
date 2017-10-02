import DrillBuilder from '/client/lib/drill/DrillBuilder';

class appStateService {
    constructor($meteor, $rootScope) {
        this.drill = null;
    }

    get currentDrill() {
        if (!this.drill){
            var builder = new DrillBuilder();
            this.drill = builder.createDrill();
        }
        return this.drill;
    }

    set currentDrill(drill) {
        this.currentDrill = drill;
    }
}

angular.module('drillApp')
    .service('appStateService', appStateService);
