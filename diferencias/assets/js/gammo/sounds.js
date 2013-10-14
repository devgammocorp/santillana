/**
 * Created By:
 * Carlos Bucheli Engr.
 * colaborum@gmail.com
 */

var tmpCnt = 10;

/**
 * Main Game Class
 * @constructor
 */
var GammoSound = function () {
    this.poolBff = {};
    this.poolTag = {};
    this.audioPrf = 1;
    this.audioCxt = null;
    this.audioTag = null;
    this.requestGen;

    /**
     * Initializes this Class
     */
    this.init = function() {
        try {
            // Fix up for prefixing
            window.AudioContext = window.AudioContext||window.webkitAudioContext;
            this.audioCxt = new AudioContext();
        }
        catch(e) {  // No audio context
            try { this.audioTag = new Audio(); }
            catch(e) { /* alert('safari mobile...'); */ }
        }
    }

    /**
     * Loads an audio file
     * @param audioUrl
     * @param audioId
     */
    this.load = function(audioId, audioUrl) {
        var context = this;
        var filePath = audioUrl.substring(0, audioUrl.lastIndexOf('.'));
        var fileExt = String(audioUrl.substring(audioUrl.lastIndexOf('.') + 1)).toLowerCase();

        // Firefox 21 - 206 Partial Content
        switch ( $.browser.name.toLowerCase() ) {
            case 'firefox':
                // if ( parseFloat($.browser.version) < 21 && fileExt == 'mp3' ) {
                    filePath += '.ogg';
                // }
                /* else {
                    filePath += '.' + fileExt;
                } */

                break;

            default:
                filePath += '.' + fileExt;
                break;
        }

        if ( this.audioCxt != null ) {  // Audio context present
            this.audioPrf = 1;
            this.requestGen = new XMLHttpRequest();

            this.requestGen.open('GET', filePath, true);
            this.requestGen.responseType = 'arraybuffer';

            // Decode asynchronously
            this.requestGen.onload = function() {
                context.audioCxt.decodeAudioData(context.requestGen.response, function(buffer) {
                    context.poolBff[audioId] = buffer;

                    if ( GameLoader.current < GameLoader.assets[GameLoader.type].length - 1 ) {
                        GameLoader.current++;
                    }
                    else {
                        GameLoader.type++;
                        GameLoader.current = 0;
                    }

                    if ( GameLoader.type < GameLoader.paths.length ) { GameLoader.loadNext(); }
                    else { GameLoader.domCreate(); }
                });
            }

            this.requestGen.send();
        }
        else if ( this.audioTag != null ) {  // No audio context
            this.audioPrf = 0;
            var audioGen = new Audio();

            audioGen.id = audioId;

            // Can play audio?
            audioGen.addEventListener("canplaythrough", function() {
                context.poolTag[audioId] = this;

                if ( GameLoader.current < GameLoader.assets[GameLoader.type].length - 1 ) {
                    GameLoader.current++;
                }
                else {
                    GameLoader.type++;
                    GameLoader.current = 0;
                }

                if ( GameLoader.type < GameLoader.paths.length ) { GameLoader.loadNext(); }
                else { GameLoader.domCreate(); }
            });

            // alert($.browser.name + '\n' + $.browser.version + '\n' + filePath);
            audioGen.src = filePath;
        }

        // Safari Mobile
        if ( safaMob() ) {
            var audioDom = '';
            audioDom += '<audio id="snd_' + audioId + '">';
            audioDom += '<source src="' + filePath + '.' + fileExt;
            audioDom += '?r=' + Math.floor((Math.random()*100)+1) + '';
            audioDom += '" type="audio/' + fileExt + '">';
            audioDom += '</audio>';

            tmpCnt += 10;
            $('body').append(audioDom);
        }
    }

    /**
     * Plays audio from the sounds pool
     * @param soundId
     * @param from
     * @param to
     */
    this.play = function(soundId, from, to) {
        if ( parseInt(this.audioPrf) == 1 ) { // Audio Context
            var source = this.audioCxt.createBufferSource(); // creates a sound source
            source.buffer = this.poolBff[soundId];           // tell the source which sound to play
            source.connect(this.audioCxt.destination);       // connect the source to the context's destination (the speakers)
            // source.noteOn(from);
            source.start(from);                              // play the source now
            // note: on older systems, may have to use deprecated noteOn(time);

            alert('audio context...');
        }
        else { // Audio Tag
            var tagObj = this.poolTag[soundId];
            tagObj.play();
        }
    }

    this.pause = function() {
    }

    this.stop = function() {
    }

    /**
     * Stops all sounds
     */
    this.stopAll = function() {
        /* $.each( this.pool, function( key, element ) {
            element.stop();
            element.currentTime = 0;
        }); */
    }
};

/**
 * Stop TimeOut
 * @param audio
 * @param time
 */
var stopTimeOut_Audio;
var stopTimeOut_Time;
function audioStopTOut() {
    alert('');

    // alert(stopTimeOut_Audio.currentTime);
    // setTimeout('stopTimeOut()', 100);
}

/* $(document).ready(function() {
}); */
