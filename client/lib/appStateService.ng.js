import { Meteor } from 'meteor/meteor';
import DrillBuilder from '/client/lib/drill/DrillBuilder';

class appStateService {
    constructor($meteor) {
        this.drill = null;        
        this.$meteor = $meteor;
    }

    init() {
        // TODO: do I need this subscription here?
        //return a promise
        // return this.$meteor.subscribe('drills').then(() => {
        //     console.log('drills ready', arguments);
        // });
        return Promise.resolve();
    }

    get currentDrill() {
        if (!this.drill) {
            this.drill = this.loadLastDrillOrNew();
        }

        return this.drill;
    }

    set currentDrill(drill) {
        this.drill = drill;
    }

    loadLastDrillOrNew() {
        var lastDrillId = this.getLastDrillId();
        if (!lastDrillId){
            var builder = new DrillBuilder();
            return builder.createDrill();
        }

        return this.loadDrill(lastDrillId);
    }

    getLastDrillId() {
        var user = Meteor.user();
        if (!user || !user.profile || !user.profile.currentDrillId) 
            return null;

        return user.profile.currentDrillId;
    }

    loadDrill(drillId) {
        return Drills.findOne({ _id: drillId });
    }

    saveDrill() {
        var id = this.currentDrill._id;
        if (!id) {
            this.insertDrill();
        } else {
            this.updateDrill();
        }
    }

    insertDrill() {
        this.currentDrill.owner = Meteor.userId();
        var id = Drills.insert(angular.copy(this.currentDrill));
        this.currentDrill._id = id;
        this.setCurrentDrill();
    }

    updateDrill() {
        var id = this.currentDrill._id;
        //delete this.currentDrill._id;
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
        this.setCurrentDrill();
    }

    setCurrentDrill() {
        if (!this.currentDrill._id)
            return;

        // update user profile with id of current drill
        Meteor.users.update({ _id: Meteor.userId() }, {
            $set: {
                "profile.currentDrillId": this.currentDrill._id
            }
        }, 
        function(err) {
            if (err)
                console.log('Unable to update user', err);
        });
    }
}

angular.module('drillApp')
    .service('appStateService', appStateService);
