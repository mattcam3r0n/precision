'use strict';

import shortid from 'shortid';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';

angular.module('drillApp')
  .component('audioClipDialog', {
    templateUrl: 'client/design/designSurface/audioClipDialog/audioClipDialog.view.ng.html',
    bindings: {
      drill: "<"
    },
    controller: function ($scope, $rootScope, eventService, appStateService) {
      var ctrl = this;

      var slider = document.querySelector('#slider');

      $scope.playPause = function () {
        //ctrl.wavesurfer.playPause();
      }

      ctrl.activate = function (args) {
        ctrl.musicFile = args.musicFile;

        ctrl.isPublic = args.musicFile.isPublic || false;
        ctrl.title = args.musicFile.title;
        ctrl.tempo = args.musicFile.tempo;
        ctrl.duration = args.musicFile.duration;
        ctrl.counts = args.musicFile.counts;

        $('#audioClipDialog').modal('show');

        $('#audioClipDialog').on('shown.bs.modal', function () {
          loadAudio(ctrl.musicFile);
          $(document).on('keydown', onSpacePressed);
        });

        $('#audioClipDialog').on('hidden.bs.modal', function () {
          unloadAudio();
          $(document).off('keydown');
          $('#audioClipDialog').off('shown.bs.modal');
          $('#audioClipDialog').off('hidden.bs.modal');
        });

        resetZoom();
      }

      ctrl.play = function () {
        if (ctrl.wavesurfer.isPlaying()) {
          ctrl.wavesurfer.pause();
          return;
        }

        if (ctrl.selection) {
          ctrl.selection.play();
        } else {
          ctrl.wavesurfer.playPause();
        }
      }

      ctrl.clearRegion = function () {
        ctrl.wavesurfer.clearRegions();
        ctrl.wavesurfer.seekTo(0); // beginning
        ctrl.selection = null;
        ctrl.duration = ctrl.wavesurfer.getDuration();
        ctrl.tempo = null; //calcTempo(ctrl.duration, guessCounts(ctrl.duration));
        ctrl.counts = null;
        ctrl.startOffset = 0;
      }

      ctrl.formattedDuration = function () {
        return formatDuration(ctrl.duration);
      }

      ctrl.addAudioClip = function () {
        var startCount = getStartCount();
        var clip = {
          id: shortid.generate(),
          fileName: getFilePath() + ctrl.musicFile.fileName,
          title: ctrl.title,
          counts: ctrl.counts,
          tempo: ctrl.tempo,
          duration: ctrl.duration,
          startOffset: ctrl.startOffset || 0,
          startCount: startCount,
          endCount: startCount + ctrl.counts - 1
        };
        ctrl.drill.music.push(clip);
        eventService.notifyAudioClipAdded({
          audioClip: clip
        });
      }

      ctrl.isValid = function() {
        return ctrl.counts > 0 && ctrl.tempo > 0 && ctrl.duration > 0;
      }

      ctrl.isSavable = function() {
        return ctrl.musicFile != null
            && $scope.currentUser != null
            && ctrl.isValid()
            && ( ctrl.musicFile.type == 'clip' 
            || ctrl.selection != null );
      }

      ctrl.saveClip = function() {
        var clip = getClip();
        appStateService.saveClip(clip);
      }

      function getClip() {
        if (!ctrl.selection) return null;

        var clip = {
            type : "clip",
            fileName : ctrl.musicFile.fileName,
            title : ctrl.title,
            counts : ctrl.counts,
            tempo : ctrl.tempo,
            duration : ctrl.duration,
            fileDuration : ctrl.wavesurfer.getDuration(),
            startOffset : ctrl.selection.start,
            performedBy : ctrl.musicFile.performedBy,
            isPublic : ctrl.isPublic,
            userId : $scope.currentUser._id
        };

        if (ctrl.musicFile.type == 'clip' && ctrl.musicFile._id) {
          clip._id = ctrl.musicFile._id;
        }
        
        return clip;
      }

      function getStartCount() {
        if (!ctrl.drill.music || ctrl.drill.music.length == 0)
          return 1;

        var lastClip = ctrl.drill.music[ctrl.drill.music.length - 1];
        return lastClip.endCount + 1;
      }

      function getFilePath() {
        return '/audio/';
      }

      function onSpacePressed(e) {
        if (e.key != ' ' || e.target.nodeName == 'INPUT') return;

        if (!ctrl.wavesurfer.isPlaying()) {
          ctrl.play();
          ctrl.counts = 1;
          ctrl.firstTap = e.timeStamp;
          ctrl.lastTap = e.timeStamp;
        } else {
          ctrl.counts++;
          ctrl.lastTap = e.timeStamp;
        }
        var duration = (ctrl.lastTap - ctrl.firstTap) / 1000;
        ctrl.tempo = calcTempo(duration, ctrl.counts - 1);
      }

      function formatDuration(duration) {
        var mins = zeroPad(Math.floor(duration / 60), 2);
        var secs = zeroPad(Math.floor(duration - (mins * 60)), 2);
        var partialSecs = (duration - (mins * 60) - secs).toFixed(1);
        return mins + ':' + secs + '.' + (partialSecs * 10);
      }

      function zeroPad(number, width) {
        width -= number.toString().length;
        if (width > 0) {
          return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
        }
        return number + ""; // always return a string
      }

      function guessCounts(duration) {
        var counts = Math.round(duration / 0.5);

        // round to nearest even
        //return counts % 2 == 0 ? counts : counts + 1;

        return Math.round(counts);
      }

      function calcTempo(duration, counts) {
        var tempo = Math.floor(counts * 60 / duration);
        return tempo;
      }

      function loadAudio(musicFile) {
        ctrl.selection = null;
        ctrl.wavesurfer = WaveSurfer.create({
          container: '#waveform',
          waveColor: 'blue',
          plugins: [
            TimelinePlugin.create({
              container: '#wave-timeline',
              //deferInit: true, // stop the plugin from initialising immediately
              // primaryLabelInterval: 1,
              // secondaryLabelInterval: 2,
              timeInterval: (musicFile.fileDuration || musicFile.duration) < 5 ? .1 : 5
            }),
            RegionsPlugin.create({})
          ]
        });

        ctrl.wavesurfer.load('/audio/' + musicFile.fileName);
        //        ctrl.wavesurfer.load('/audio/Sousa - the_liberty_bell_disc6.mp3');

        ctrl.wavesurfer.on('ready', function () {
          ctrl.wavesurfer.enableDragSelection({});
          ctrl.duration = ctrl.wavesurfer.getDuration();
          // if (!ctrl.counts)
          //   ctrl.counts = guessCounts(ctrl.wavesurfer.getDuration());
          // if (!ctrl.duration)
          //   ctrl.duration = ctrl.wavesurfer.getDuration();
          // if (!ctrl.tempo)
          //   ctrl.tempo = calcTempo(ctrl.duration, ctrl.counts);

          addRegion(ctrl.musicFile);

          $rootScope.$safeApply();
        });

        ctrl.wavesurfer.on('region-created', function (region) {
          if (ctrl.selection) {
            ctrl.selection.remove();
          }
          ctrl.selection = region;
        });

        ctrl.wavesurfer.on('region-updated', function (region) {
          if (!ctrl.selection) return;

          // var beginningOfRegion = region.start / ctrl.wavesurfer.getDuration();
          // ctrl.wavesurfer.seekTo(0.5);
          var duration = region.end - region.start;
          ctrl.duration = ctrl.selection.end - ctrl.selection.start;
          ctrl.counts = null; //guessCounts(duration);
          ctrl.tempo = null; //calcTempo(ctrl.duration, ctrl.counts);
          ctrl.startOffset = ctrl.selection.start;
        });

        //for zoom

        document.querySelector('#slider').oninput = function () {
          ctrl.wavesurfer.zoom(Number(this.value));
        };

        ctrl.zoomIn = function() {
          slider.value = Number(slider.value) + 5;
          ctrl.wavesurfer.zoom(Number(slider.value));
        }

        ctrl.zoomOut = function() {
          slider.value = Number(slider.value) - 5;
          ctrl.wavesurfer.zoom(Number(slider.value));
        }

      }

      function addRegion(musicFile) {
        if (musicFile.type != 'clip') return;

        ctrl.wavesurfer.addRegion({
          start: musicFile.startOffset,
          end: musicFile.startOffset + musicFile.duration,
        });
      }

      function resetZoom() {
        slider.value = 1;
      }
    
      function unloadAudio() {
        if (!ctrl.wavesurfer) return;
        ctrl.wavesurfer.destroy();
      }

      ctrl.$onInit = function () {
        ctrl.unsubscribeAudioClipDialogActivated = eventService.subscribeAudioClipDialogActivated((evt, args) => {
          ctrl.activate(args);
        });
      }

      ctrl.$onDestroy = function () {
        ctrl.unsubscribeAudioClipDialogActivated();
      }
    }
  });


