'use strict';

import shortid from 'shortid';
import Audio from '/client/lib/audio/Audio';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';
import Metronome from './Metronome';
import Events from '/client/lib/Events';
import EventSubscriptionManager from '/client/lib/EventSubscriptionManager';
import Logger from '/client/lib/Logger';

angular.module('drillApp')
  .component('audioClipDialog', {
    templateUrl: 'client/design/designSurface/audioClipDialog/audioClipDialog.view.ng.html',
    bindings: {
      drill: '<',
    },
    controller: function($scope, $rootScope, $window,
        eventService, appStateService) {
      let ctrl = this;

      let slider = document.querySelector('#slider');

      $scope.playPause = function() {
        // ctrl.wavesurfer.playPause();
      };

      ctrl.activate = function(args) {
        ctrl.musicFile = args.musicFile;

        ctrl.isMetronomeEnabled = true;
        ctrl.isPublic = args.musicFile.isPublic || false;
        ctrl.title = args.musicFile.title;
        ctrl.tempo = args.musicFile.tempo;
        ctrl.duration = args.musicFile.duration;
        ctrl.counts = args.musicFile.counts;

        $('#audioClipDialog').modal('show');

        $('#audioClipDialog').on('shown.bs.modal', function() {
          loadAudio(ctrl.musicFile);
          // $(document).on('keydown', onSpacePressed);
          $window.addEventListener('keydown', onSpacePressed);
      });

        $('#audioClipDialog').on('hidden.bs.modal', function() {
          unloadAudio();
          // $(document).off('keydown');
          $window.removeEventListener('keydown', onSpacePressed);
          $('#audioClipDialog').off('shown.bs.modal');
          $('#audioClipDialog').off('hidden.bs.modal');
        });

        resetZoom();
      };

      ctrl.play = function(playMetronome) {
        Audio.ensureAudioIsInitialized();
        playMetronome = playMetronome === undefined ? true : playMetronome;
        if (ctrl.wavesurfer.isPlaying()) {
          ctrl.wavesurfer.pause();
          ctrl.metronome.stop();
          return;
        }
        if (ctrl.selection) {
          ctrl.selection.play();
        } else {
          ctrl.wavesurfer.playPause();
        }
        if (playMetronome && ctrl.isMetronomeEnabled) {
          ctrl.metronome = new Metronome(ctrl.wavesurfer,
            ctrl.beats || ctrl.musicFile.beats);
          ctrl.metronome.start();
        }
      };


      ctrl.clearRegion = function() {
        ctrl.wavesurfer.clearRegions();
        ctrl.wavesurfer.seekTo(0); // beginning
        ctrl.selection = null;
        ctrl.duration = ctrl.wavesurfer.getDuration();
        ctrl.tempo = null; // calcTempo(ctrl.duration, guessCounts(ctrl.duration));
        ctrl.counts = null;
        ctrl.startOffset = 0;
      };

      ctrl.formattedDuration = function() {
        return formatDuration(ctrl.duration);
      };

      ctrl.addAudioClip = function() {
        let startCount = getStartCount();
        let clip = getClip();

        try {
          clip.timelineId = shortid.generate(); // add a unique id for timeline to use
          clip.startCount = startCount;
          clip.endCount = startCount + ctrl.counts - 1;

          if (!ctrl.drill.music) {
            ctrl.drill.music = [];
          }
          ctrl.drill.music.push(clip);
          eventService.notify(Events.audioClipAdded, {
            audioClip: clip,
          });
        } catch (ex) {
          const msg = 'addAudioClip: ' + ex.message;
          const ctx = {
            clip: clip,
          };
          throw new AddAudioClipException(msg, ex, ctx);
        }
      };

      ctrl.isValid = function() {
        return ctrl.counts > 0 && ctrl.tempo > 0 && ctrl.duration > 0;
      };

      ctrl.isSavable = function() {
        return ctrl.musicFile != null
          && $scope.currentUser != null
          && ctrl.isValid()
          && (ctrl.musicFile.type == 'clip'
            || ctrl.selection != null);
      };

      ctrl.saveClip = function() {
        let clip = getClip();
        appStateService.saveClip(clip);
        Bert.alert('Clip saved.', 'success', 'growl-top-right');
      };

      function getClip() {
        // if (!ctrl.selection) return null;

        let clip = {
          type: ctrl.selection ? 'clip' : 'file',
          fileName: ctrl.musicFile.fileName,
          key: ctrl.musicFile.key,
          url: ctrl.musicFile.url,
          title: ctrl.title,
          counts: ctrl.counts,
          tempo: ctrl.tempo,
          duration: ctrl.duration,
          fileDuration: ctrl.wavesurfer.getDuration(),
          startOffset: ctrl.startOffset || 0,
          performedBy: ctrl.musicFile.performedBy,
          isPublic: ctrl.isPublic,
          userId: $scope.currentUser ? $scope.currentUser._id : null,
          beats: normalizeBeats(ctrl.beats),
        };

        if (ctrl.musicFile.type == 'clip' && ctrl.musicFile._id) {
          clip._id = ctrl.musicFile._id;
        }
        // clip.id = clip._id || shortid.generate(); // need an id for timeline

        return clip;
      }

      function normalizeBeats(beats) {
        const beatsLength = beats ? beats.length : 0;
        const newBeats = beats ? beats.slice() : [];
        let cumulativeTime = newBeats.length > 0
          ? newBeats[newBeats.length - 1].timeOffset
          : 0;
        const timeInterval = 60 / ctrl.tempo;
        for (let i = beatsLength + 1; i <= ctrl.counts; i++) {
          const newBeat = {
            count: i,
            timeInterval: timeInterval,
            timeOffset: cumulativeTime,
          };
          newBeats.push(newBeat);
          cumulativeTime = cumulativeTime + timeInterval;
        }
        return newBeats;
      }

      function getStartCount() {
        if (!ctrl.drill.music || ctrl.drill.music.length == 0) {
          return 1;
        }

        let lastClip = ctrl.drill.music[ctrl.drill.music.length - 1];
        return lastClip.endCount + 1;
      }

      function onSpacePressed(e) {
        let thisTap = e.timeStamp;
        if (e.key != ' ' || e.target.nodeName == 'INPUT') return;
        Audio.playMetronome();
        if (!ctrl.wavesurfer.isPlaying()) {
          ctrl.beats = [{
            count: 1,
            timeInterval: 0,
            timeOffset: 0,
          }];
          ctrl.play(false);
          ctrl.counts = 1;
          ctrl.firstTap = thisTap;
          ctrl.lastTap = thisTap;
          ctrl.cumulativeTime = 0;
        } else {
          let timeSinceLastTap = thisTap - ctrl.lastTap;
          ctrl.cumulativeTime += timeSinceLastTap;
          ctrl.counts++;
          ctrl.lastTap = thisTap;
          ctrl.beats[ctrl.counts - 1] = {
            count: ctrl.counts,
            timeInterval: timeSinceLastTap / 1000,
            timeOffset: ctrl.cumulativeTime / 1000,
          };
        }
        let duration = (ctrl.lastTap - ctrl.firstTap) / 1000;
        ctrl.tempo = calcTempo(duration, ctrl.counts - 1);
        $rootScope.$safeApply();
      }

      function formatDuration(duration) {
        let mins = zeroPad(Math.floor(duration / 60), 2);
        let secs = zeroPad(Math.floor(duration - (mins * 60)), 2);
        let partialSecs = (duration - (mins * 60) - secs).toFixed(1);
        return mins + ':' + secs + '.' + (partialSecs * 10);
      }

      function zeroPad(number, width) {
        width -= number.toString().length;
        if (width > 0) {
          return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
        }
        return number + ''; // always return a string
      }

      function calcTempo(duration, counts) {
        let tempo = Math.floor(counts * 60 / duration);
        return tempo;
      }

      function showSpinner() {
        eventService.notify(Events.showSpinner);
      }

      function hideSpinner() {
        eventService.notify(Events.hideSpinner);
      }

      function loadAudio(musicFile) {
        showSpinner();
        ctrl.selection = null;
        ctrl.wavesurfer = WaveSurfer.create({
          container: '#waveform',
          waveColor: 'blue',
          plugins: [
            TimelinePlugin.create({
              container: '#wave-timeline',
              timeInterval: (musicFile.fileDuration || musicFile.duration) < 5
                ? .1
                : 5,
            }),
            RegionsPlugin.create({}),
          ],
        });

        // use Audio class to load music so it will be buffered for later
        Audio
          .load(musicFile.url)
          .then(() => {
            ctrl.wavesurfer.loadDecodedBuffer(Audio.getBuffer(musicFile.url));
          })
          .catch((err) => {
            let msg = 'Unable to load audio file.';
            Bert.alert(msg, 'danger', 'growl-top-right');
            Logger.error(msg, {
              url: musicFile.url,
              error: err,
            });
            hideSpinner();
          });

        ctrl.wavesurfer.on('ready', function() {
          ctrl.wavesurfer.enableDragSelection({});
          ctrl.duration = ctrl.wavesurfer.getDuration();
          ctrl.beats = musicFile.beats;

          addRegion(ctrl.musicFile);

          hideSpinner();
          $rootScope.$safeApply();
        });

        ctrl.wavesurfer.on('error', function(err) {
          Bert.alert('Unable to load audio.', 'danger', 'growl-top-right');
          console.log(err);
          hideSpinner();
        });

        ctrl.wavesurfer.on('region-created', function(region) {
          if (ctrl.selection) {
            ctrl.selection.remove();
          }
          ctrl.selection = region;
        });

        ctrl.wavesurfer.on('region-updated', function(region) {
          if (!ctrl.selection) return;

          ctrl.duration = ctrl.selection.end - ctrl.selection.start;
          ctrl.counts = null;
          ctrl.tempo = null;
          ctrl.startOffset = ctrl.selection.start;
        });

        // for zoom

        document.querySelector('#slider').oninput = function() {
          ctrl.wavesurfer.zoom(Number(this.value));
        };

        ctrl.zoomIn = function() {
          slider.value = Number(slider.value) + 5;
          ctrl.wavesurfer.zoom(Number(slider.value));
        };

        ctrl.zoomOut = function() {
          slider.value = Number(slider.value) - 5;
          ctrl.wavesurfer.zoom(Number(slider.value));
        };
      }

      function addRegion(musicFile) {
        if (musicFile.type != 'clip') return;

        ctrl.wavesurfer.addRegion({
          start: musicFile.startOffset,
          end: musicFile.startOffset + musicFile.duration,
        });
        ctrl.startOffset = musicFile.startOffset;
        ctrl.duration = musicFile.duration;
      }

      function resetZoom() {
        slider.value = 1;
      }

      function unloadAudio() {
        if (!ctrl.wavesurfer) return;
        ctrl.wavesurfer.destroy();
      }

      ctrl.$onInit = function() {
        ctrl.subscriptions = new EventSubscriptionManager(eventService);
        ctrl.subscriptions.subscribe(Events.audioClipDialogActivated,
          (evt, args) => {
            ctrl.activate(args);
          });
      };

      ctrl.$onDestroy = function() {
        ctrl.subscriptions.unsubscribeAll();
      };
    },
  });

class AddAudioClipException {
  constructor(msg, inner, context) {
    this.message = msg;
    this.inner = inner;
    this.context = context;
  }

  toString() {
    return this.message;
  }
}
