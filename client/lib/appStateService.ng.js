import { Meteor } from 'meteor/meteor';
import DrillBuilder from '/client/lib/drill/DrillBuilder';

var _currentDrillFormatVersion = 1;

class appStateService {
    constructor($rootScope) {
        this._drill = null;
        this.rootScope = $rootScope.$new(true);
    }

    get drill() {
        return this._drill;
    }

    set drill(d) {
        this._drill = d;
    }

    subscribeDrillChanged(cb) {
        var unsubscribe = this.rootScope.$on('drillChanged', cb);
        return unsubscribe;
    }

    notifyDrillChanged() {
        this.rootScope.$emit('drillChanged', this._drill);
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
                if (shouldUpgradeDrill(drill)) {
                    upgradeDrill(drill);
                }
                this.drill = drill;
                this.notifyDrillChanged();
                return drill;
            });
    }

    closeDrill() {
        this.newDrill();
        this.notifyDrillChanged();
    }

    newDrill() {
        // save current drill before starting new drill
        this.saveDrill();
        
        var builder = new DrillBuilder();
        this.drill = builder.createDrill();
        this.notifyDrillChanged();
        return this.drill;   
    }

    saveDrill() {
        if (!this.drill) return;

        var id = this.drill._id;
        this.drill.isDirty = false;
        if (!id) {
            this.insertDrill();
        } else {
            this.updateDrill();
        }
    }

    insertDrill() {
        this.drill.createdDate = new Date();
        this.drill.updatedDate = new Date();
        this.drill.userId = Meteor.userId();
        this.drill.owner = getOwnerEmail(Meteor.user());
        this.drill.name_sort = this.drill.name.toLowerCase();
        this.drill.owner = Meteor.userId();
        Drills.insert(angular.copy(this.drill), (err, id) => {
            if (err) {
                console.log('unable to insert', err, this.drill);
                return;
            }
            this.drill._id = id;
        });
        this.setCurrentDrill();
    }

    updateDrill() {
        var id = this.drill._id;

        if (!id) {
            console.log('Unable to update. No _id.');
            return;
        }

        this.drill.updatedDate = new Date();
        this.drill.name_sort = this.drill.name.toLowerCase();
        this.drill.userId = Meteor.userId();
        this.drill.owner = getOwnerEmail(Meteor.user());

        //delete this.currentDrill._id;
        var r = Drills.update({
            _id: id
        }, {
            $set: angular.copy(this.drill)
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
        if (!this.drill._id)
            return;
            
        // update user profile with id of current drill
        Meteor.users.update({ _id: Meteor.userId() }, {
            $set: {
                "profile.currentDrillId": this.drill._id
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

function shouldUpgradeDrill(drill) {
    return !drill.drillFormatVersion || drill.drillFormatVersion < _currentDrillFormatVersion;
}

function upgradeDrill(drill) {
    console.log('upgrading drill to format version ' + _currentDrillFormatVersion);
    drill.members.forEach(m => {
        m.initialState.x *= 10;
        m.initialState.y *= 10;
        m.currentState.x *= 10;
        m.currentState.y *= 10;

        m.script.forEach(a => {
            if (a) {
                a.deltaX *= 10;
                a.deltaY *= 10;
            }
        });
    });
    drill.drillFormatVersion = _currentDrillFormatVersion;
    drill.isDirty = true;
}

angular.module('drillApp')
    .service('appStateService', appStateService);
