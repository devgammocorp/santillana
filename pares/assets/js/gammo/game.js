/**
 * Created By:
 * Carlos Bucheli Engr.
 * colaborum@gmail.com
 */

/**
 * Main Game Class
 * @constructor
 */
var GammoGame = function (difLvl) {
    this.difficult = new Number(difLvl);
    this.svgs;

    // Game logic variables
    this.pageCurrent = new Number(-1);
    this.colorCurrent = new String('none');
    this.pagesModel = new Array();
    this.pagesDone = new Array(scnsTotal - 1);
    this.comparableModels = new Array();
    this.comparablePages = new Array();
    this.rowCurrent = new Number(0);

    $('.colorable').attr('stroke', '#666666');

    /**
     * Initializes this Class
     */
    this.init = function() {
        // TopBar Levels
        for ( var lvl = 0; lvl < 9; lvl++ ) {
            $('#toplvl_' + lvl).children('.number').attr('fill', '#000000');
        }

        $('#toplvl_' + levelCurrent).children('.number').attr('fill', '#3E55A5');

        // Show the modal layer
        ModalMngr.open();

        // Create DOM
        this.createDOM();
    }

    /**
     * Creates the necessary DOM for this game
     */
    this.createDOM = function() {
        var strDom = '';
        var ordItms;
        var rndItms;

        strDom += '<div id="content-wrapper" class="none">';
        strDom += '<div id="working-area">';

        for ( var s = 0; s < 3; s++ ) {
            ordItms = new Array();
            rndItms = new Array();

            strDom += '<div id="row_' + levelCurrent + '_' + s + '" class="';
            strDom += (s == 0) ? 'row' : 'row none';
            strDom += '">';
            strDom += '<div class="image-model">' + this.svgs['model_' + levelCurrent + '_' + s] + '</div>';

            // Create array and randomize it
            for ( var l = 0; l < levelDifficult; l++ ) {
                ordItms.push('<div accesskey="' + levelCurrent + '_' + s + '" class="image-holder">' + this.svgs[levelCurrent + '_' + s + '_' + l] + '</div>');
            }

            ordItms.push('<div accesskey="' + levelCurrent + '_' + s + '" class="image-holder">' + this.svgs[levelCurrent + '_' + s + '_v'] + '</div>');

            ordItms = arrayShuffle(ordItms);

            for ( l = 0; l < ordItms.length; l++ ) {
                strDom += '' + ordItms[l] + '';
            }

            strDom += '</div>';
        }

        strDom += '</div>';
        strDom += '</div>';

        $('body').append(strDom);
        $('#content-wrapper').attr('class', '');

        // Add event handlers
        this.addEventHandlers();
    }

    /**
     * Event Handlers
     */
    this.addEventHandlers = function() {
        var context = this;

        /**
         * Make thumbnails clickable
         */
        $('.image-holder').bind('click', function(event) {
            var str = new String($(this).children('svg').attr('id'));
            var val = new Number($(this).children('svg').attr('valid'));
            var parts = str.split('_');
            var num = parseInt(parts[1]);

            $('#clickMark_' + parts[1] + '_' + parts[parts.length - 1]).attr('class', '');

            if (parseInt(rowComplete[num]) == 0) {
                if ( val == 1 && parseInt(rowComplete[num]) == 0 ) {
                    // Coloring svg
                    $('#svg_' + num + '_v').children().each(function() {
                        $(this).attr('fill', $(this).attr('tofill'));
                    });

                    // Show next row
                    context.rowCurrent++;
                    $('#row_' + levelCurrent + '_' + context.rowCurrent).attr('class', 'row');

                    rowComplete[num] = 1;

                    $('#boxResult').attr('class', 'none');

                    (!safaMob()) ? SoundMngr.play('acierto', 0, 0) : '';
                }
                else if( val != 1 && parseInt(rowComplete[num]) == 0 ) {
                    (!safaMob()) ? SoundMngr.play('error', 0, 0) : '';
                }
            }

            setTimeout('clickMarksCleanner()', 500);
            context.checkComplete();
        });

        // Close Modal
        setTimeout(function(){
            ModalMngr.close();

            // Start Time Counter
            timerStop();
            timeG = 1;
            timerAdd();
        }, 1000);
    }

    /**
     * Check if scenes are completed
     */
    this.checkComplete = function() {
        var context = this;
        var conf;

        if ( rowComplete.join() == '1,1,1' ) {
            levelsComplete[levelCurrent] = 1;

            if ( levelCurrent > -1 && levelCurrent < scnsTotal ) {
                levelCurrent++;

                var img = GameLoader.images['arrowRight'];
                var ldr = GameLoader.images['loader'];

                img.id = 'goNext';
                img.className = 'loader';
                ldr.className = 'loader';

                if( levelCurrent >= 9 ) {
                    $('#appModal').html('');
                    $('#appModal').append(img);
                    ModalMngr.open();

                    // $('#sceneChooser').click();
                }
                else {
                    $('#appModal').html('');
                    $('#appModal').append(img);
                    ModalMngr.open();

                    $('#goNext').bind('click', function(event) {
                        $('#appModal').html('');
                        $('#appModal').append(ldr);
                        ModalMngr.open();

                        context.reset();

                        // Close Modal
                        setTimeout(function(){
                            $('#carousel img').each(function( index ) {
                                if ( index == levelCurrent ) {
                                    $(this).click();
                                }
                            });
                        }, 1000);
                    });
                }
            }
        }

        this.qualify();
    }

    /**
     * Validates the current app.
     */
    this.qualify = function() {
        var qDom = '';

        if ( String(levelsComplete.join()) == '1,1,1,1,1,1,1,1,1' ) {
            qDom  = this.svgs['stars'];
            qDom += '<div class="common">FELICITACIONES<br><br>Completaste todas las escenas.</div>';

            $('#appModal').html(qDom);
        }

        for ( var lvl = 0; lvl < 9; lvl++ ) {
            $('#toplvl_' + lvl).children('.number').attr('fill', '#000000');
            ( parseInt(levelsComplete[lvl]) == 1 ) ? $('#topok_' + lvl).attr('class', '') : $('#topok_' + lvl).attr('class', 'none');
        }

        $('#toplvl_' + levelCurrent).children('.number').attr('fill', '#3E55A5');
    }

    /**
     * Resets the game
     */
    this.reset = function() {
        timerStop();

        for ( var lvl = 0; lvl < 9; lvl++ ) {
            $('#toplvl_' + lvl).children('.number').attr('fill', '#000000');
        }

        $('#content-wrapper').remove();
        $('#boxResult').remove();
        $('.statBox').remove();
    }
};

/* $(document).ready(function() {
}); */
