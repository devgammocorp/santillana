/**
 * Created By:
 * Carlos Bucheli Engr.
 * colaborum@gmail.com
 */

/********************
 * Global Variables *
 ********************/
var assetsStyles = new Array();
var assetsScripts = new Array();
var assetsImages = new Array();
var assetsSVG = new Array();
var assetsSounds = new Array();
var assetsPath = new Array();
var assetsLabel = new Array();
var assetsLoatType = new Array();
var assetsAvail = new Array();

var GameLoader;
var ModalMngr;
var SoundMngr;
var NavMngr;
var GameMngr;

/******************
 * Game Specifics *
 ******************/
var levelDifficult = new Number(3);
var scnsTotal = new Number(9);
var scnsPerPage = new Number(Math.ceil(scnsTotal / levelDifficult));

var dfcltCurrent = new Number(0);
var sceneCurrent = new Number(0);
var sceneComplete = new Array();
var scenesComplete = new Array();

var colorsAvail = new Array();
var colorIndex = new Array();

for ( var sc = 0; sc < 15; sc++ ) {
    sceneComplete.push(0);
}

for ( var lc = 0; lc < scnsTotal; lc++ ) {
    scenesComplete.push(0);
}

colorsAvail.push('#FFC926');
colorsAvail.push('#007FFF');
colorsAvail.push('#D90000');
colorsAvail.push('#008C23');
colorsAvail.push('#8C008C');
colorsAvail.push('#795524');
colorsAvail.push('#555555');
colorsAvail.push('#FFB399');
colorsAvail.push('#FF4000');

colorIndex.push('yellow');
colorIndex.push('blue');
colorIndex.push('red');
colorIndex.push('green');
colorIndex.push('purple');
colorIndex.push('brown');
colorIndex.push('gray');
colorIndex.push('pink');
colorIndex.push('orange');

/********************
 * Global Functions *
 ********************/

/**
 * Find & Replace
 * @param find
 * @param replace
 * @param str
 * @returns {*|XML|string|void}
 */
function replaceAll(find, replace, str) {
    return str.replace(new RegExp(find, 'g'), replace);
}

/**
 * Shuffles the given array
 * @param arr
 * @returns {*}
 */
function arrayShuffle(arr) {
    for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
    return arr;
}


/**
 * Returns the element's html including self
 * @param s
 * @returns {*}
 */
jQuery.fn.outerHTML = function(s) {
    return s
        ? this.before(s).remove()
        : jQuery("<p>").append(this.eq(0).clone()).html();
};

/**
 * Time Counter
 */
var timeS = new Number(-1);
var timeM = new Number(0);
var timeH = new Number(0);
var timeG = 1;

function timerAdd() {
    timeS++;

    if ( timeS >= 60 ) {
        timeM++;
        timeS = 0;
    }

    if ( timeM >= 60 ) {
        timeH++;
        timeM = 0;
        timeS = 0;
    }

    $('#sceneTime').val(timeM + ':' + timeS);

    if ( timeG == 1 ) { setTimeout('timerAdd()', 1000); }
}

function timerStop() {
    timeH = 0;
    timeM = 0;
    timeS = 0;
    timeG = 0;
}

/**
 * Returns TRUE if current browser is safari mobile
 * @returns {Boolean}
 */
function safaMob() {
    // if ( $.browser.name.toLowerCase() == 'safari' && $.browser.versionNumber >= 6 ) {
    if ( $.browser.name.toLowerCase() == 'safari' ) {
        return true;
    }
    else {
        return false;
    }
}

/**
 * Cleans any "click mark" whatsoever
 */
function clickMarksCleanner() {
    for ( var r = 0; r < 3; r++ ) {
        for ( var c = 0; c < 3; c++ ) {
            $('#clickMark_' + r + '_' + c).attr('class', 'none');
        }
    }
}