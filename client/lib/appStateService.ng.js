import { Meteor } from 'meteor/meteor';
import DrillBuilder from '/client/lib/drill/DrillBuilder';
import Events from '/client/lib/Events';
import ApplicationException from '/client/lib/ApplicationException';
import Logger from '/client/lib/Logger';
import DrillZipper from '/lib/DrillZipper';

let _currentDrillFormatVersion = 1;

class appStateService {
  constructor(alertService, eventService, userService) {
    this._drill = null;
    this._field = null;
    this.alertService = alertService;
    this.eventService = eventService;
    this.userService = userService;
    this.zipper = new DrillZipper();
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

  get dontShowIntro() {
    return this.userService.dontShowIntro;
  }

  set dontShowIntro(val) {
    this.userService.dontShowIntro = val;
  }

  get releaseNotesVersion() {
    return this.userService.releaseNotesVersion;
  }

  set releaseNotesVersion(val) {
    this.userService.releaseNotesVersion = val;
  }

  get isGridVisible() {
    return this.userService.isGridVisible;
  }

  set isGridVisible(val) {
    this.userService.isGridVisible = val;
  }

  get isLogoVisible() {
    return this.userService.isLogoVisible;
  }

  set isLogoVisible(val) {
    this.userService.isLogoVisible = val;
  }

  getDrillId() {
    if (!this.drill) return null;
    return this.drill._id;
  }

  getDrillCount() {
    if (!this.drill) return null;
    return this.drill.count;
  }

  getDrillName() {
    if (!this.drill) return null;
    return this.drill.name;
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

    // update logo and grid based on profile
    if (this.userService.isGridVisible) {
      this.eventService.notify(Events.showGrid);
    } else {
      this.eventService.notify(Events.hideGrid);
    }

    if (this.userService.isLogoVisible) {
      this.eventService.notify(Events.showLogo);
    } else {
      this.eventService.notify(Events.hideLogo);
    }
  }

  updateUserProfile() {
    // new: set profile props on user service
    this.userService.lastDrillId = this.drill._id;
    this.userService.updateUserProfile();
  }

  getLastDrillId() {
    return Meteor.callPromise('getLastDrillId');
  }

  getDrill(id) {
    return Meteor.callPromise('getDrill', id);
  }

  getDrillZipped(id) {
    return Meteor.callPromise('getDrillZipped', id).then((zippedDrill) => {
      return this.zipper.unzip(zippedDrill).then((unzippedDrill) => {
        return unzippedDrill;
      });
    });
  }

  openLastDrillOrNew() {
    return this.getLastDrillId().then((drillId) => {
      if (!drillId) {
        return this.newDrill();
      }
      return this.openDrill(drillId);
    });
  }

  openDrill(id) {
    // console.log('openDrill', id);
    const start = performance.now();
    return this.getDrillZipped(id).then((drill) => {
      if (shouldUpgradeDrill(drill)) {
        upgradeDrill(drill);
      }
      const end = performance.now();
      Logger.info('Drill "' + drill.name + '" opened. ', {
        timing: end - start,
        drillId: drill._id,
      });
      this.drill = drill;
      this.updateUserProfile(); // set last drill id
      this.eventService.notify(Events.drillOpened, {
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
    if (this.drill && this.drill.isDirty) {
      this.saveDrill();
    }

    let builder = new DrillBuilder();
    this.drill = builder.createDrill();
    this.drill.name = this.drill.name + ' ' + this.userService.getNextNewDrillSuffix();
    this.drill.drillFormatVersion = _currentDrillFormatVersion;
    this.eventService.notify(Events.drillOpened, {
      isNew: true,
      drill: this.drill,
    });
    return this.drill;
  }

  saveDrillAs(drillInfo) {
    if (!this.drill) return;

    this.drill.isDirty = false;
    delete this.drill._id;
    this.drill.name = drillInfo.name;
    this.drill.description = drillInfo.description;

    return this.insertDrill().then(() => {
      this.eventService.notify(Events.drillSavedAs);
    });
  }

  saveDrill() {
    if (!this.drill) return;

    let id = this.drill._id;
    this.drill.isDirty = false;
    if (!id) {
      this.insertDrill();
    } else {
      this.updateDrillZipped();
    }
  }

  insertDrill() {
    let self = this;
    const start = performance.now();
    return Meteor.callPromise('insertDrill', self.drill)
      .then((id) => {
        const end = performance.now();
        self.drill._id = id;
        self.updateUserProfile();
        Logger.info('Drill inserted.', {
          timing: end - start,
          drillId: id.toString(),
        });
      })
      .catch((ex) => {
        self.alertService.danger('Unable to save drill. ' + ex);
        throw new ApplicationException('Error inserting drill.', ex, {});
      });
  }

  updateDrill() {
    const self = this;
    const id = self.drill._id;
    const start = performance.now();
    if (!id) {
      console.log('Unable to update. No _id.');
      return;
    }
    return Meteor.callPromise('updateDrill', this.drill)
      .then(() => {
        const end = performance.now();
        this.updateUserProfile();
        console.log('save complete', end - start);
        Logger.info('Drill ' + self.drill.name + ' updated.', {
          timing: end - start,
          drillId: id,
        });
      })
      .catch((ex) => {
        self.alertService.danger('Unable to save drill. ' + ex);
        throw new ApplicationException('Error updating drill.', ex, {
          drillId: id,
        });
      });
  }

  updateDrillZipped() {
    const self = this;
    const id = self.drill._id;
    const start = performance.now();
    if (!id) {
      console.log('Unable to update. No _id.');
      return;
    }

    self.zipper.zip(self.drill).then((zippedDrill) => {
      Meteor.callPromise('updateDrillZipped', zippedDrill)
        .then(() => {
          const end = performance.now();
          this.updateUserProfile();
          Logger.info('Drill "' + self.drill.name + '" updated.', {
            timing: end - start,
            drillId: id,
          });
        })
        .catch((ex) => {
          let message = 'Unable to save drill. ' + ex;
          if (ex.details && ex.details.error == 'not-your-drill') {
            message = 'You cannot save changes to a drill that is not yours. ';
            message += 'Use "Save As..." to save a copy of the drill.';
          }
          self.alertService.danger(message);
          throw new ApplicationException('Error updating drill.', ex, {
            drillId: id,
          });
        });
    });
  }

  deleteDrill(id) {
    if (id === this.drill._id) {
      this.alertService.info('You cannot delete this drill while it is open.');
      return;
    }

    // Drills.remove(id);
    Meteor.call('deleteDrill', id, (err, res) => {
      if (err) {
        throw new ApplicationException('Error deleting drill.', ex, {
          drillId: id,
        });
      }
    });
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

    MusicFiles.update(
      {
        _id: id,
      },
      {
        $set: angular.copy(clip),
      },
      function(error) {
        if (error) {
          console.log('Unable to update musicFile', error);
        } else {
          console.log('saved');
        }
      }
    );
  }
}

function shouldUpgradeDrill(drill) {
  return (
    drill &&
    (!drill.drillFormatVersion ||
      drill.drillFormatVersion < _currentDrillFormatVersion)
  );
}

function upgradeDrill(drill) {
  console.log(
    'upgrading drill to format version ' + _currentDrillFormatVersion
  );
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

angular
  .module('drillApp')
  .service('appStateService', [
    'alertService',
    'eventService',
    'userService',
    appStateService,
  ]);
