import { Meteor } from 'meteor/meteor';
import DrillBuilder from '/client/lib/drill/DrillBuilder';
import Events from '/client/lib/Events';

var _currentDrillFormatVersion = 1;

class appStateService {
    constructor($rootScope, alertService, eventService) {
        this._drill = null;
        this._field = null;
        this.alertService = alertService;
        this.eventService = eventService;
        this.rootScope = $rootScope.$new(true);
        this.userProfile = {};
    }

    get drill() {
        return this._drill;
    }

    set drill(d) {
        this._drill = d;
    }

    get field() {
        return this._field;
    }

    set field(f) {
        this._field = f;
    }

    get isGridVisible() {
        return this.userProfile.isGridVisible;
    }

    set isGridVisible(val) {
        this.userProfile.isGridVisible = val;
    }

    get isLogoVisible() {
        return this.userProfile.isLogoVisible;
    }

    set isLogoVisible(val) {
        this.userProfile.isLogoVisible = val;
    }

    userChanged() {
        if (!Meteor.user()) return;
console.log('userChanged', Meteor.user().profile);

        // get user profile
        this.userProfile = Meteor.user().profile;
        // open new or last drill
        // TODO: change from current way of opening last drill, in design view
        //     fire drillOpened event 

        // update logo and grid based on profile
        if (this.userProfile.isGridVisible)
            this.eventService.notify(Events.showGrid);
        else
            this.eventService.notify(Events.hideGrid);

        if (this.userProfile.isLogoVisible)
            this.eventService.notify(Events.showLogo);
        else
            this.eventService.notify(Events.hideLogo);
    }

    updateUserProfile() {
        if (!Meteor.user()) return;

        var profile = {
            lastDrillId: this.drill._id,
            isGridVisible: this.userProfile.isGridVisible === undefined ? false : this.userProfile.isGridVisible,
            isLogoVisible: this.userProfile.isLogoVisible === undefined ? true : this.userProfile.isLogoVisible
        };

        Meteor.call('updateUserProfile', profile);
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
        this.drill.drillFormatVersion = _currentDrillFormatVersion;
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
        //this.drill.owner = Meteor.userId();
        Drills.insert(angular.copy(this.drill), (err, id) => {
            if (err) {
                if (!Meteor.userId())
                    this.alertService.warning('Unable to save drill. Please login to save your work.');
                else
                    this.alertService.danger('Unable to save drill. ' + err);
                return;
            }
            this.drill._id = id;
        });
        this.updateUserProfile();
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

        var r = Drills.update({
            _id: id
        }, {
                $set: angular.copy(this.drill)
            },
            function (error) {
                if (error) {
                    if (!Meteor.userId())
                        this.alertService.warning('Unable to save drill. Please login to save your work.');
                    else
                        this.alertService.danger('Unable to save drill. ' + err);
                } else {
                    console.log('saved');
                }
            });
        this.updateUserProfile();
    }

    deleteDrill(id) {
        Drills.remove(id);
    }

    saveClip(clip) {
        if (!clip) return;

        if (!clip._id) {
            this.insertClip(clip);
        } else {
            this.updateClip(clip);
        }
    }

    insertClip(clip) {
        clip.createdDate = new Date();
        clip.updatedDate = new Date();
        clip.userId = Meteor.userId();
        clip.owner = getOwnerEmail(Meteor.user());
        clip.title_sort = clip.title.toLowerCase();
        MusicFiles.insert(angular.copy(clip), (err, id) => {
            if (err) {
                console.log('unable to insert', err, clip);
                return;
            }
            clip._id = id;
        });
    }

    updateClip(clip) {
        var id = clip._id;

        if (!id) {
            console.log('Unable to update. No _id.');
            return;
        }

        clip.updatedDate = new Date();
        clip.title_sort = clip.title.toLowerCase();
        clip.userId = Meteor.userId();
        clip.owner = getOwnerEmail(Meteor.user());

        var r = MusicFiles.update({
            _id: id
        }, {
                $set: angular.copy(clip)
            },
            function (error) {
                if (error) {
                    console.log('Unable to update musicFile', error);
                } else {
                    console.log('saved');
                }
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
    .service('appStateService', ['$rootScope', 'alertService', 'eventService', appStateService]);
