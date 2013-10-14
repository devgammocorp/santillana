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
    this.svgs;
    this.images;

    // Game logic variables
    this.colorCurrent = 'none';
    this.colorCurrent = new String('none');
    this.rowCurrent = new Number(0);

    /**
     * Initializes this Class
     */
    this.init = function() {
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
        var imgCnt = new Number(0);

        strDom += '<div id="content-wrapper" class="none">';
        strDom += '<div id="working-area">';

        // Left Side Image
        strDom += '<div class="box-diff left">';
        strDom += this.svgs['scene_l_' + sceneCurrent];
        strDom += '</div>';

        // Right Side Image
        strDom += '<div class="box-diff right">';
        strDom += this.svgs['scene_r_' + sceneCurrent];
        strDom += '</div>';

        strDom += '</div>';
        strDom += '</div>';

        // Color Choices
        strDom += '<div id="colorBox">';
        strDom += '<ul>';

        for ( var c = 0; c < ((dfcltCurrent * 3) + 3); c++ ) {
            strDom += '<li id="colorChoice_' + String(colorIndex[c]) + '"></li>';
            strDom += '</li>';
        }

        strDom += '</ul>';
        strDom += '</div>';

        // strDom += '<input type="button" onclick="GameMngr.checkComplete();" value="GO" style="position:absolute; top: 10%; left:10%; height:50px; width: 50px; z-index:5000;">';

        $('body').append(strDom);

        // Appending Color Choices
        for ( c = 0; c < ((dfcltCurrent * 3) + 3); c++ ) {
            $('#colorChoice_' + colorIndex[c]).attr('color', colorsAvail[c]);
            $('#colorChoice_' + colorIndex[c]).append(this.svgs['crayon']);
            $('#colorChoice_' + colorIndex[c]).children('svg').children('#colorable').attr('fill', colorsAvail[c]);
        }

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
         * Click handler for color choices
         */
        $('#colorBox li').click(function() {
            for ( var c = 0; c < ((dfcltCurrent * 3) + 3); c++ ) {
                $('#colorChoice_' + colorIndex[c]).attr('class', '');
            }

            context.colorCurrent = $(this).attr('color');
            $(this).attr('class', 'active');
        });

        /**
         * Click handler for SVG nodes
         */
        $('.clickable').bind('click', function(event) {
            var totalDiff = new Number($(this).parent('svg').attr('tdiff'));
            var idParts = String($(this).attr('id')).split('_');

            $('#circled_' + idParts[idParts.length - 1]).attr('class', '');
            $('#circerr_' + idParts[idParts.length - 1]).attr('class', '');

            diffCount++;
            $('#sceneDiffCount').val(diffCount);

            context.checkComplete(totalDiff);

            // Must have selected a color
            /* if ( context.colorCurrent != 'none' ) {
                $svg = $(this).children('svg');

                // Coloring svg
                $($svg.children('.colorable').each(function() {
                    $(this).attr('fill', context.colorCurrent);
                }));

                SoundMngr.play('acierto');
            }
            else {
                alert('SELECCIONA UN COLOR!');
            } */
        });

        /**
         * Hover handler for SVG nodes
         */
        $('.clickable').hover(function() {
            // $(this).fadeOut(100);
        });

        /**
         * Hover handler for SVG nodes
         */
        $('.clickable').mouseout(function() {
            // $(this).fadeIn(500);
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
    this.checkComplete = function(totalDiff) {
        var conf;

        if ( diffCount >= totalDiff ) {
            scenesComplete[sceneCurrent] = 1;

            if ( sceneCurrent > -1 && sceneCurrent < scnsTotal - 1 ) {
                sceneCurrent++;

                SoundMngr.play('final');
                conf = confirm('FELICITACIONES!\nAhora completa el escenario: ' + (sceneCurrent + 1));

                // Confirmed for next level
                if ( conf == true ) {
                    ModalMngr.open();
                    this.reset();

                    // Close Modal
                    setTimeout(function(){
                        $('#carousel img').each(function( index ) {
                            if ( index == sceneCurrent ) {
                                $(this).click();
                            }
                        });
                    }, 1000);
                }
                else { // Cancel next level
                    ModalMngr.label('');
                    ModalMngr.open();

                    this.reset();

                    sceneComplete = null;
                    scenesComplete = null;

                    sceneComplete = new Array();
                    scenesComplete = new Array();

                    for ( var sc = 0; sc < 15; sc++ ) { sceneComplete.push(0); }
                    for ( var lc = 0; lc < scnsTotal; lc++ ) { scenesComplete.push(0); }

                    // Close Modal
                    setTimeout(function() { ModalMngr.close(); }, 1000);

                    sceneCurrent = 0;
                }
            }
            else {
                this.qualify();
            }
        }
    }

    /**
     * Validates the current app.
     */
    this.qualify = function() {
        if ( String(scenesComplete.join()) == '1,1,1,1,1,1,1,1,1' ) {
            alert('FELICITACIONES\n\nCompletaste todas las escenas.');
        }
        /* else {
            alert('Completa TODAS las escenas correctamente...');
        } */
    }

    /**
     * Resets the game
     */
    this.reset = function() {
        timerStop();
        diffCount = 0;

        $('#content-wrapper').remove();
        $('#boxResult').remove();
        $('#colorBox').remove();
    }
};

/* $(document).ready(function() {
}); */
