import { Meteor } from 'meteor/meteor';
import DrillBuilder from '/client/lib/drill/DrillBuilder';
import Events from '/client/lib/Events';
import ApplicationException from '/client/lib/ApplicationException';

let _currentDrillFormatVersion = 1;

class appStateService {
    constructor($rootScope, alertService, eventService, userService) {
        this._drill = null;
        this._field = null;
        this.alertService = alertService;
        this.eventService = eventService;
        this.userService = userService;
        this.rootScope = $rootScope.$new(true);
        this.userProfile = userService.getUserProfile();
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

    setActiveTool(toolName, deactivateFn) {
        if (this.activeToolName === toolName) return;
        this.deactivateActiveTool();
        this.activeToolName = toolName;
        this.deactivateActiveToolFn = deactivateFn;
    }

    deactivateActiveTool() {
        if (this.deactivateActiveToolFn) {
            this.deactivateActiveToolFn();
        }
        this.activeToolName = null;
        this.deactivateActiveToolFn = null;
    }

    userChanged() {
        if (!Meteor.user()) return;

        // get user profile
        this.userProfile = this.userService.getUserProfile();

        // update logo and grid based on profile
        if (this.userProfile.isGridVisible) {
            this.eventService.notify(Events.showGrid);
        } else {
            this.eventService.notify(Events.hideGrid);
        }

        if (this.userProfile.isLogoVisible) {
            this.eventService.notify(Events.showLogo);
        } else {
            this.eventService.notify(Events.hideLogo);
        }
    }

    updateUserProfile() {
        let profile = {
            lastDrillId: this.drill._id,
            isGridVisible: this.userProfile.isGridVisible === undefined
                ? false
                : this.userProfile.isGridVisible,
            isLogoVisible: this.userProfile.isLogoVisible === undefined
                ? true
                : this.userProfile.isLogoVisible,
        };
        this.userService.updateUserProfile(profile);
    }

    getLastDrillId() {
        return Meteor.callPromise('getLastDrillId');
    }

    getDrill(id) {
        return Meteor.callPromise('getDrill', id);
    }

    openLastDrillOrNew() {
        return this.getLastDrillId()
            .then((drillId) => {
                if (!drillId) {
                    return this.newDrill();
                }

                return this.openDrill(drillId);
            });
    }

    openDrill(id) {
        return this.getDrill(id)
            .then((drill) => {
                if (shouldUpgradeDrill(drill)) {
                    upgradeDrill(drill);
                }
                this.drill = drill;
                this.eventService.notify(Events.drillOpened,
                    {
                        isNew: false,
                        drill: drill,
                    });
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

        let builder = new DrillBuilder();
        this.drill = builder.createDrill();
        this.drill.drillFormatVersion = _currentDrillFormatVersion;
        this.eventService.notify(Events.drillOpened,
            {
                isNew: true,
                drill: this.drill,
            });
        return this.drill;
    }

    saveDrill() {
        if (!this.drill) return;

        let id = this.drill._id;
        this.drill.isDirty = false;
        if (!id) {
            this.insertDrill();
        } else {
            this.updateDrill();
        }
    }

    insertDrill() {
        let self = this;
        self.drill.createdDate = new Date();
        self.drill.updatedDate = new Date();
        self.drill.userId = self.userService.getUserId(),
        self.drill.owner = self.userService.getUserEmail(),
        self.drill.name_sort = self.drill.name.toLowerCase();
        Drills.insert(angular.copy(self.drill), (err, id) => {
            if (err) {
                if (!this.userService.getUserId()) {
                    self.alertService.warning('Unable to save drill. Please login to save your work.'); // eslint-disable-line max-len
                } else {
                    self.alertService.danger('Unable to save drill. ' + err);
                }
                return;
            }
            self.drill._id = id;
        });
        self.updateUserProfile();
    }

    updateDrill() {
        const self = this;
        let id = this.drill._id;

        if (!id) {
            console.log('Unable to update. No _id.');
            return;
        }

        this.drill.updatedDate = new Date();
        this.drill.name_sort = this.drill.name.toLowerCase();
        this.drill.userId = this.userService.getUserId();
        this.drill.owner = this.userService.getUserEmail();

        Drills.update({
            _id: id,
        }, {
                $set: angular.copy(this.drill),
            },
            function(error) {
                if (error) {
                    if (!self.userService.getUserId()) {
                        // eslint-disable-next-line max-len
                        self.alertService.warning('Unable to save drill. Please login to save your work.');
                    } else {
                        // eslint-disable-next-line max-len
                        self.alertService.danger('Unable to save drill. ' + error);
                    }
                    throw new ApplicationException('Unable to update drill.', error, {
                        drillId: id,
                    });
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
        clip.userId = this.userService.getUserId();
        clip.owner = this.userService.getUserEmail();
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
        let id = clip._id;

        if (!id) {
            console.log('Unable to update. No _id.');
            return;
        }

        clip.updatedDate = new Date();
        clip.title_sort = clip.title.toLowerCase();
        clip.userId = this.userService.getUserId();
        clip.owner = this.userService.getUserEmail();

        MusicFiles.update({
            _id: id,
        }, {
                $set: angular.copy(clip),
            },
            function(error) {
                if (error) {
                    console.log('Unable to update musicFile', error);
                } else {
                    console.log('saved');
                }
            });
    }
}

function shouldUpgradeDrill(drill) {
    return drill
        && (!drill.drillFormatVersion
                || drill.drillFormatVersion < _currentDrillFormatVersion);
}

function upgradeDrill(drill) {
    console.log('upgrading drill to format version '
        + _currentDrillFormatVersion);
    drill.members.forEach((m) => {
        m.initialState.x *= 10;
        m.initialState.y *= 10;
        m.currentState.x *= 10;
        m.currentState.y *= 10;

        m.script.forEach((a) => {
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
    .service('appStateService',
        ['$rootScope', 'alertService', 'eventService', 'userService', appStateService]);
