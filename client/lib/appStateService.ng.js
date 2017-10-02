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

    saveDrill() {
//        Drills.insert(angular.copy(this.currentDrill));

        var id = this.currentDrill._id;
        if (!id) {
            this.insertDrill();
        } else {
            this.updateDrill();
        }
    }

    insertDrill() {
        var id = Drills.insert(angular.copy(this.currentDrill));
        this.currentDrill._id = id;
        console.log('insertDrill', this.currentDrill);
    }

    updateDrill() {
        var id = this.currentDrill._id;
        delete this.currentDrill._id;
        var r = Drills.update({
            _id: id
        }, {
            $set: angular.copy(this.currentDrill)
        },
        function (error) {
            if (error) {
                console.log('Unable to update the drill', error);
            } else {
                console.log('saved');
            }
        });
        console.log('updateDrill', r);
    }
}

angular.module('drillApp')
    .service('appStateService', appStateService);
