import Drill from '/client/lib/drill/Drill';

class appStateService {
    constructor($meteor, $rootScope) {

    }

    get currentDrill() {
        if (!this.drill){
            this.drill = new Drill();
            this.drill.name = "New Drill";
        }

        return this.drill;
    }

    set currentDrill(drill) {
        this.currentDrill = drill;
    }
}

angular.module('drillApp')
    .service('appStateService', appStateService);
