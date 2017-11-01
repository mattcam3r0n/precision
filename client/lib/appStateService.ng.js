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

        // TODO: do i need this anymore? remove route delay?
        return Promise.resolve();
    }

    get currentDrill() {
        return this.drill;
    }

    set currentDrill(drill) {
        this.drill = drill;
    }

    getLastDrillId() {        
        return Meteor.callPromise('getLastDrillId');    
    }

    getDrill(id) {
        return Meteor.callPromise('getDrill', id);
    }

    openLastDrillOrNew() {
        return this.getLastDrillId()
            .then(drillId => {

                if (!drillId) 
                    return this.newDrill();

                return this.openDrill(drillId);
            });
    }

    openDrill(id) {
        return this.getDrill(id)
            .then(drill => {
                this.currentDrill = drill;
                return drill;
            });
    }

    closeDrill() {
        this.newDrill();
    }

    newDrill() {
        // save current drill before starting new drill
        this.saveDrill();
        
        var builder = new DrillBuilder();
        this.currentDrill = builder.createDrill();
        return this.currentDrill;   
    }

    saveDrill() {
        if (!this.currentDrill) return;

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

    deleteDrill(id) {
        Drills.remove(id);
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
