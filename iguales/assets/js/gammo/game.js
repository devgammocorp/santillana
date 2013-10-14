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

    this.pageCurrent = new Number(-1);
    this.colorCurrent = new String('none');
    this.pagesModel = new Array();
    this.pagesDone = new Array(scnsTotal - 1);
    this.comparableModels = new Array();
    this.comparablePages = new Array();
    this.rowCurrent = new Number(0);

    /**
     * Initializes this Class
     */
    this.init = function() {
        // TopBar Levels
        for ( var lvl = 0; lvl < 9; lvl++ ) {
            $('#toplvl_' + lvl).children('.number').attr('fill', '#000000');
        }

        $('#toplvl_' + sceneCurrent).children('.number').attr('fill', '#3E55A5');

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

        // Each scene has 3 rows
        for ( var r = 0; r < 3; r++ ) {
            ordItms = new Array();

            strDom += '<div id="row_' + r + '" class="';
            strDom += (r == 0) ? 'row' : 'row';
            strDom += '">';

            // Each row has 5 images
            for ( var c = 0; c < 5; c++ ) {
                ordItms.push('<div accesskey="' + r + '_' + c + '" class="image-holder">' + this.svgs['image_' + sceneCurrent + '_' + imgCnt] + '</div>');
                imgCnt++;
            }

            ordItms = arrayShuffle(ordItms);

            for ( i = 0; i < ordItms.length; i++ ) {
                strDom += '' + ordItms[i] + '';
            }

            strDom += '</div>';
        }

        strDom += '</div>';
        strDom += '</div>';

        // Color Choices
        strDom += '<div id="colorBox">';
        strDom += '<ul>';

        for ( var c = 0; c < (dfcltCurrent * 3) + 3; c++ ) {
            strDom += '<li id="colorChoice_' + String(colorIndex[c]) + '"></li>';
            strDom += '</li>';
        }

        strDom += '</ul>';
        strDom += '</div>';

        // strDom += '<input type="button" onclick="GameMngr.checkComplete();" value="GO" style="position:absolute; top: 10%; left:10%; height:50px; width: 50px; z-index:5000;">';

        $('body').append(strDom);

        // Appending Color Choices
        for ( c = 0; c < (dfcltCurrent * 3) + 3; c++ ) {
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
         * Qualify Button
         */
        /* $('#goQualify').click(function() {
            context.checkComplete();
        }); */

        /**
         * Click handler for color choices
         */
        $('#colorBox li').click(function() {
            for ( var c = 0; c < (dfcltCurrent * 3) + 3; c++ ) {
                $('#colorChoice_' + colorIndex[c]).attr('class', '');
            }

            context.colorCurrent = $(this).attr('color');
            $(this).attr('class', 'active');
        });

        /**
         * Click handler for image holders
         */
        $('.image-holder').bind('click', function(event) {
            // Must have selected a color
            if ( context.colorCurrent != 'none' ) {
                $svg = $(this).children('svg');

                // Coloring svg
                $($svg.children('.colorable').each(function() {
                    $(this).attr('fill', context.colorCurrent);
                }));

                SoundMngr.play('acierto');
            }
            else {
                alert('SELECCIONA UN COLOR!');
            }
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
        var strValid = new Array();
        var strEach = new Array();
        var repFig;
        var figGrp;
        var conf;

        var repeatLyrs = new Array(dfcltCurrent + 2);
        var repeatValid = new Array(dfcltCurrent + 2);

        // Gathering repeat-able figures
        for ( var rf = 0; rf < repeatLyrs.length; rf++ ) {
            repFig = new Array();
            strValid = new Array();

            for ( var f = 0; f < 15; f++ ) {
                $svg = $('#svg_' + sceneCurrent + '_' + f);

                if ( parseInt($svg.attr('repeat')) == rf ) {
                    repFig.push($svg);
                }

                strValid.push(1);
            }

            repeatLyrs[rf] = repFig;
            repeatValid[rf] = 0;
        }

        // Each group of figures must
        // have the same fill color

        for ( var grp = 0; grp < repeatLyrs.length; grp++ ) {
            figGrp = repeatLyrs[grp];

            for ( var fig = 0; fig < figGrp.length; fig++ ) {
                if ( this.qualifySVG(figGrp[0], figGrp[fig]) ) {
                    strEach.push(1);
                }
                else {
                    strEach.push(0);
                }
            }
        }

        if ( strEach.join() == strValid.join() ) {
            scenesComplete[sceneCurrent] = 1;

            if ( sceneCurrent > -1 && sceneCurrent < scnsTotal - 1 ) {
                sceneCurrent++;

                SoundMngr.play('final');

                var img = GameLoader.images['qualifyButton'];
                var ldr = GameLoader.images['loader'];

                img.id = 'goQual';
                img.className = 'loader';
                ldr.className = 'loader';

                $('#appModal').html('');
                $('#appModal').append(img);
                ModalMngr.open();

                $('#goQual').bind('click', function(event) {
                    $('#appModal').html('');
                    $('#appModal').append(ldr);
                    ModalMngr.open();

                    context.reset();

                    alert('FELICITACIONES!\nAhora completa el escenario: ' + (sceneCurrent + 1));

                    // Close Modal
                    setTimeout(function(){
                        $('#carousel img').each(function( index ) {
                            if ( index == sceneCurrent ) {
                                $(this).click();
                            }
                        });
                    }, 1000);
                });
            }
        }
        else {
            SoundMngr.play('error');

            var img = GameLoader.images['wrongButton'];
            var ldr = GameLoader.images['loader'];

            img.id = 'goNext';
            img.className = 'loader';
            ldr.className = 'loader';

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
                        if ( index == sceneCurrent ) {
                            $(this).click();
                        }
                    });
                }, 1000);
            });
        }

        this.qualify();
    }

    /**
     * Validates the given SVG
     */
    this.qualifySVG = function(svgF, svgE) {
        var isOk = new Boolean(true);
        var $svgFirst = svgF;
        var $svgEach = svgE;
        var color = new String();
        var layers = new Array();

        // Get valid color
        $svgFirst.children().each(function() {
            color = $(this).attr('fill');
            return false;
        });

        // Validate each layer agains the 'first color'
        if ( color != '#FFFFFF' && color != '#94441C' && color != '#BF7C73' ) {
            $svgEach.children('.colorable').each(function() {
                layers.push($(this).attr('fill'));
            });

            for ( var lyr = 0; lyr < layers.length; lyr++ ) {
                if ( String(layers[lyr]) != color ) {
                    isOk = false;
                    break;
                }
            }
        }
        else {
            isOk = false;
        }

        return(isOk);
    }

    /**
     * Validates the current app.
     */
    this.qualify = function() {
        var qDom = '';

        if ( String(scenesComplete.join()) == '1,1,1,1,1,1,1,1,1' ) {
            qDom  = this.svgs['stars'];
            qDom += '<div class="common">FELICITACIONES<br><br>Completaste todas las escenas.</div>';

            $('#appModal').html(qDom);

            ModalMngr.open();
        }

        for ( var lvl = 0; lvl < 9; lvl++ ) {
            $('#toplvl_' + lvl).children('.number').attr('fill', '#000000');
            ( parseInt(scenesComplete[lvl]) == 1 ) ? $('#topok_' + lvl).attr('class', '') : $('#topok_' + lvl).attr('class', 'none');
        }

        $('#toplvl_' + sceneCurrent).children('.number').attr('fill', '#3E55A5');
    }

    /**
     * Resets the game
     */
    this.reset = function() {
        timerStop();

        $('#content-wrapper').remove();
        $('#boxResult').remove();
        $('#colorBox').remove();
    }
};

/* $(document).ready(function() {
}); */
