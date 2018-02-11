import Logger from '/client/lib/Logger';
import AudioBufferLoader from './AudioBufferLoader';

const metronomeUrl = '/audio/metronome.mp3';

class Audio {
    static init() {
        try {
            if (this.context) return;
            // Fix up for prefixing
            window.AudioContext = window.AudioContext
                || window.webkitAudioContext;
            this.context = new AudioContext();
            this.buffers = new AudioBufferLoader(this.context);
            this.metronomeBuffer = new AudioBufferLoader(this.context);
            this.source = null;
            this.isConfirmedByUser = false;
        } catch (e) {
            let msg = 'Web Audio API is not supported in this browser';
            Logger.error(msg, {
                error: e,
              });
        }
    }

    static get currentTime() {
        return this.context.currentTime;
    }

    static ensureAudioIsInitialized() {
        if (this.isConfirmedByUser) return;

        // some browsers require audio to played on a user
        // action the first time. this method must be called
        // by a user event, such as play button click.

        // create empty buffer and play it
        const buffer = this.context.createBuffer(1, 1, 22050);
        const source = this.context.createBufferSource();
        source.buffer = buffer;
        source.connect(this.context.destination);
        source.start(0);

        this.metronomeBuffer.load(metronomeUrl).then(() => {
            this.isConfirmedByUser = true;
        });
    }

    static load(urlList) {
        return this.buffers.load(urlList); // returns promise
    }

    static getBuffer(url) {
        return this.buffers.getBuffer(url);
    }

    static playBuffer(buffer, startOffset, duration) {
        startOffset = startOffset || 0;
        duration = duration || 0;

        let source = this.context.createBufferSource(); // creates a sound source
        source.buffer = buffer; // tell the source which sound to play
        source.connect(this.context.destination); // connect the source to the context's destination (the speakers)
        source.start(0, startOffset, duration); // play the source now

        return source;
    }

    static playMetronome() {
        let buffer = this.metronomeBuffer.getBuffer(metronomeUrl);
        this.playBuffer(buffer, 0, 1000);
    }

    static play(url, startOffset, duration) {
        let buffer = this.buffers.getBuffer(url);
        let source = this.playBuffer(buffer, startOffset, duration);
        this.source = source;
    }

    static loadFile(url) {
        let self = this;
        return new Promise((resolve, reject) => {
            // Load buffer asynchronously
            let request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';

            request.onload = function() {
                // Asynchronously decode the audio file data in request.response
                self.context.decodeAudioData(
                    request.response,
                    function(buffer) {
                        if (!buffer) {
                            reject({ status: self.status, statusText: 'error decoding file data: ' + url });
                            return;
                        }
                        resolve(buffer);
                    },
                    function(error) {
                        console.error('decodeAudioData error', error, url);
                        reject(error);
                    }
                );
            };

            request.onerror = function() {
                reject('BufferLoader: XHR error');
            };

            request.send();
        });
    }

    static stop() {
        if (!this.source) return;
        this.source.stop(0);
        this.source = null;
    }
}

export default Audio;
