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
        this.currentDrill.isDirty = false;
        if (!id) {
            this.insertDrill();
        } else {
            this.updateDrill();
        }
    }

    insertDrill() {
        this.currentDrill.createdDate = new Date();
        this.currentDrill.updatedDate = new Date();
        this.currentDrill.userId = Meteor.userId();
        this.currentDrill.owner = getOwnerEmail(Meteor.user());
        this.currentDrill.name_sort = this.currentDrill.name.toLowerCase();
        this.currentDrill.owner = Meteor.userId();
        Drills.insert(angular.copy(this.currentDrill), (err, id) => {
            if (err) {
                console.log('unable to insert', err, this.currentDrill);
                return;
            }
            this.currentDrill._id = id;
        });
        this.setCurrentDrill();
    }

    updateDrill() {
        var id = this.currentDrill._id;

        if (!id) {
            console.log('Unable to update. No _id.');
            return;
        }

        this.currentDrill.updatedDate = new Date();
        this.currentDrill.name_sort = this.currentDrill.name.toLowerCase();
        this.currentDrill.userId = Meteor.userId();
        this.currentDrill.owner = getOwnerEmail(Meteor.user());

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

function getOwnerEmail(user) {
    if (!user || !user.emails || user.emails.length == 0)
      return 'unknown';
    
    return user.emails[0].address;
}

angular.module('drillApp')
    .service('appStateService', appStateService);
