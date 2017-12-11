'use strict';

import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';

angular.module('drillApp')
  .component('audioClipDialog', {
    templateUrl: 'client/design/designSurface/audioClipDialog/audioClipDialog.view.ng.html',
    bindings: {
      onOpen: "&"
    },
    controller: function ($scope, $rootScope, eventService, appStateService) {
      var ctrl = this;

      var slider = document.querySelector('#slider');
      
      $scope.playPause = function() {
        //ctrl.wavesurfer.playPause();
      }

      ctrl.activate = function(args) {
        $('#audioClipDialog').modal('show');
        console.log('audio dialog opened');
        $('#audioClipDialog').on('shown.bs.modal', function () {
          loadAudio(args.musicFile);
          $(document).on('keydown', onSpacePressed);
        });
        $('#audioClipDialog').on('hidden.bs.modal', function () {
          console.log('audio dialog closed');
          unloadAudio();
          $(document).off('keydown');
          $('#audioClipDialog').off('shown.bs.modal');
          $('#audioClipDialog').off('hidden.bs.modal');
        });
      }

      ctrl.play = function() {
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

      ctrl.clearRegion = function() {
        ctrl.wavesurfer.clearRegions();
        ctrl.wavesurfer.seekTo(0); // beginning
        ctrl.selection = null;
        ctrl.duration = ctrl.wavesurfer.getDuration();
        ctrl.tempo = guessTempo(ctrl.duration, guessCounts(ctrl.duration));
      }

      ctrl.formattedDuration = function() {
        return formatDuration(ctrl.duration);
      }

      function onSpacePressed(e) {
        console.log(e);
        if (e.key != ' ') return;

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
        ctrl.tempo = guessTempo(duration, ctrl.counts - 1);
      }

      function formatDuration(duration) {
        var mins = zeroPad(Math.floor(duration / 60), 2);
        var secs = zeroPad(Math.floor(duration - (mins * 60)), 2);
        var partialSecs = (duration - (mins * 60) - secs).toFixed(1);
        return mins + ':' + secs + '.' + (partialSecs * 10);
      }

      function zeroPad( number, width )
      {
        width -= number.toString().length;
        if ( width > 0 )
        {
          return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
        }
        return number + ""; // always return a string
      }

      function guessCounts(duration) {
        var counts = Math.round(duration / 0.5);

        // round to nearest even
        //return counts % 2 == 0 ? counts : counts + 1;

        return Math.round(counts);
      }

      function guessTempo(duration, counts) {
        var tempo = Math.floor(counts * 60 / duration);
        console.log(duration, counts, tempo);
        return tempo;
      }

      function loadAudio(musicFile) {
        console.log('loadAudio');
        ctrl.selection = null;
        ctrl.wavesurfer = WaveSurfer.create({
          container: '#waveform',
          waveColor: 'blue',
          plugins: [
            TimelinePlugin.create({
              container: '#wave-timeline',
              //deferInit: true // stop the plugin from initialising immediately
              // primaryLabelInterval: 1,
              // secondaryLabelInterval: 2,
              timeInterval: .1
            }),
            RegionsPlugin.create({})
          ]
        });

        ctrl.wavesurfer.load('/audio/' + musicFile.fileName);
//        ctrl.wavesurfer.load('/audio/Sousa - the_liberty_bell_disc6.mp3');
        
        ctrl.wavesurfer.on('ready', function () {
          console.log('wavesurfer ready');        
          ctrl.wavesurfer.enableDragSelection({});
          ctrl.counts = guessCounts(ctrl.wavesurfer.getDuration());
          ctrl.duration = ctrl.wavesurfer.getDuration();
          ctrl.tempo = guessTempo(ctrl.duration, ctrl.counts);
          $rootScope.$safeApply();
        });

        ctrl.wavesurfer.on('region-created', function(region){
          if (ctrl.selection) {
            ctrl.selection.remove();
          }
          ctrl.selection = region;
        });

        ctrl.wavesurfer.on('region-updated', function(region){
          if (!ctrl.selection) return;

          // var beginningOfRegion = region.start / ctrl.wavesurfer.getDuration();
          // ctrl.wavesurfer.seekTo(0.5);
          var duration = region.end - region.start;
          ctrl.counts = guessCounts(duration);
          ctrl.duration = ctrl.selection.end - ctrl.selection.start;
          ctrl.tempo = guessTempo(ctrl.duration, ctrl.counts);
        });

        // for zoom
        // slider.value = ctrl.wavesurfer.params.minPxPerSec;
        // slider.min = ctrl.wavesurfer.params.minPxPerSec;    
        // slider.addEventListener('input', function() {
        //     ctrl.wavesurfer.zoom(Number(this.value * 10));
        // });        

      }

      function unloadAudio() {
        console.log('unloadAudio');
        if (!ctrl.wavesurfer) return;
console.log('about to destory wavesurf');
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


