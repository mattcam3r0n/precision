class Audio {
    static init() {
        try {
            if (this.context) return;

            // Fix up for prefixing
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();
            console.log(this.context);
        }
        catch (e) {
            console.log('Web Audio API is not supported in this browser');
        }
    }

    static loadFile(url) {
        // var fileReader  = new FileReader;
        // fileReader.onload = function(){
        //    var arrayBuffer = this.result;
        //    console.log(arrayBuffer);
        //    console.log(arrayBuffer.byteLength);
        // }
        // fileReader.readAsArrayBuffer(file);          

        var self = this;
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
      
        // Decode asynchronously
        request.onload = function() {
          self.context.decodeAudioData(request.response, function(buffer) {
            self.buffer = buffer;
            console.log(buffer);
          }, function(err) {
              console.log(err);
          });
        }
        request.send();
    }

    static play() {
        var source = this.context.createBufferSource(); // creates a sound source
        source.buffer = this.buffer;                    // tell the source which sound to play
        source.connect(this.context.destination);       // connect the source to the context's destination (the speakers)
        source.start(0);                           // play the source now
        this.source = source;
    }

    static stop() {
        this.source.stop(0);
    }
}

export default Audio;
