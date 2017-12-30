import AudioBufferLoader from './AudioBufferLoader';

class Audio {
    static init() {
        try {
            if (this.context) return;

            // Fix up for prefixing
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();
            this.loadMetronome();
            this.buffers = new AudioBufferLoader(this.context);
        }
        catch (e) {
            console.log('Web Audio API is not supported in this browser');
        }
    }

    static get currentTime() {
        return this.context.currentTime;
    }

    static loadMetronome() {
        return this.loadFile('/audio/metronome.wav').then(buffer => {
            this.metronomeBuffer = buffer;
        });
    }

    static load(urlList) {
        return this.buffers.load(urlList); // returns promise 
    }

    static playBuffer(buffer, startOffset, duration) {
        startOffset = startOffset || 0;
        duration = duration || 0;

        var source = this.context.createBufferSource(); // creates a sound source
        source.buffer = buffer;                    // tell the source which sound to play
        source.connect(this.context.destination);       // connect the source to the context's destination (the speakers)
        source.start(0, startOffset, duration);                           // play the source now

        return source;
    }

    static playMetronome() {
        this.playBuffer(this.metronomeBuffer);
    }

    static play(url, startOffset, duration) {
        var buffer = this.buffers.getBuffer(url);
        var source = this.playBuffer(buffer, startOffset, duration);
        this.source = source; 
    }

    static loadFile(url) {
        var self = this;
        return new Promise((resolve, reject) => {
            // Load buffer asynchronously
            var request = new XMLHttpRequest();
            request.open("GET", url, true);
            request.responseType = "arraybuffer";

            request.onload = function () {
                // Asynchronously decode the audio file data in request.response
                self.context.decodeAudioData(
                    request.response,
                    function (buffer) {
                        if (!buffer) {
                            reject({ status: this.status , statusText: 'error decoding file data: ' + url });
                            return;
                        }
                        resolve(buffer);
                    },
                    function (error) {
                        console.error('decodeAudioData error', error, url);
                        reject(error);
                    }
                );
            }

            request.onerror = function () {
                reject('BufferLoader: XHR error');
            }

            request.send();
        });
        
    }

    static stop() {
        if (!this.source) return;
        this.source.stop(0);
    }
}

export default Audio;
