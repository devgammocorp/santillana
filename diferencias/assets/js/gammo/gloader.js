/**
 * Created By:
 * Carlos Bucheli Engr.
 * colaborum@gmail.com
 */

/**
 * Pre-Loader Class
 * @constructor
 * @param pathsArr
 * @param assetsArr
 */
var GammoLoader = function (pathsArr, assetsArr) {
    this.paths = pathsArr;
    this.assets = assetsArr;
    this.type = new Number();
    this.current = new Number();
    this.images = {};
    this.svgs = {};
    this.sounds = {};
    this.pgrTotal = new Number(1);

    /**
     * Loads the next asset
     */
    this.loadNext = function() {
        var fullPath = new String();

        fullPath = String(this.paths[this.type] + this.assets[this.type][this.current].url);

        switch (String(assetsLoatType[this.type])) {
            case 'request':
                this.loadRequest(fullPath);
                break;

            case 'img':
                this.loadImage(this.assets[this.type][this.current].id, fullPath);
                break;

            case 'svg':
                this.loadSVG(this.assets[this.type][this.current].id, fullPath);
                break;

            case 'sound':
                SoundMngr.load(this.assets[this.type][this.current].id, fullPath);
                break;
        }
    }

    /**
     * Loads a file via ajax
     * For loading styles and scripts
     * @param path
     */
    this.loadRequest = function(path) {
        $.ajax({
            url: path,
            context: this,
            beforeSend: function ( xhr ) {
                xhr.overrideMimeType("text/plain; charset=x-user-defined");
            }
        }).done(function ( data ) {
            if ( this.current < this.assets[this.type].length - 1 ) {
                this.current++;
            }
            else {
                this.type++;
                this.current = 0;
            }

            if ( this.type < this.paths.length - 1 ) {
                this.loadNext();
            }
        });
    }

    /**
     * Loads a single image
     * @param imgId
     * @param imgPath
     */
    this.loadImage = function(imgId, imgPath) {
        var $genericImg = new Image();
        var context = this;

        $genericImg.onload = function () {
            context.images[imgId] = this;

            if ( context.current < context.assets[context.type].length - 1 ) {
                context.current++;
            }
            else {
                context.type++;
                context.current = 0;
            }

            if ( context.type < context.paths.length - 1 ) {
                context.loadNext();
            }
        };

        setTimeout(function() {
            $genericImg.src = imgPath;
        }, 500);
    }

    /**
     * Loads a single SVG file
     * @param svgPath
     * @param svgId
     */
    this.loadSVG = function(svgId, svgPath) {
        $.ajax({
            type: 'GET',
            url: svgPath,
            dataType: 'html',
            context: this,
            success: function (svg_resp, xmlstatus) {
                this.svgs[svgId] = svg_resp;

                if ( this.current < this.assets[this.type].length - 1 ) {
                    this.current++;
                }
                else {
                    this.type++;
                    this.current = 0;
                }

                if ( this.type < this.paths.length ) {
                    this.loadNext();
                }
            },
            error: function (xhr, status, error) {
                alert(error);
            }
        });
    }

    /**
     * Creates the necessary DOM
     */
    this.domCreate = function() {
        var context = this;
        var strDom = new String();
        this.pgrTotal = Math.ceil(scnsTotal / scnsPerPage);

        strDom += '<div id="c-carousel">';
        strDom += '<div id="wrapper">';
        strDom += '<div id="inner" class="horizontal">';
        strDom += '<div id="carousel">';

        for ( var pg = 0; pg < this.pgrTotal; pg++ ) {
            strDom += '<div class="pgr_' + pg + '"></div>';
        }

        strDom += '</div>';
        strDom += '</div>';

        strDom += '<a href="#" id="left"></a>';
        strDom += '<a href="#" id="right"></a>';
        strDom += '</div>';
        strDom += '</div>';

        strDom += '<div id="topBar">';
        strDom += '<ul class="left">';
        strDom += '<li><input type="text" id="sceneTime" title="" value="00:00" readonly></li>';
        strDom += '<li><input type="text" id="sceneDiffCount" title="" value="0" readonly></li>';
        strDom += '</ul>';
        strDom += '</div>';

        strDom += '<div id="sideBar">';
        strDom += '<li><input type="button" id="sceneChooser" title="" value=""></li>';
        strDom += '<li><input type="button" id="goQualify" title="" onclick="GameMngr.checkComplete();" value="" class="none"></li>';

        if ( safaMob() ) {
            strDom += '<li><input type="button" id="historyPlay" title="" onclick="snd_background.play();" value=""></li>';
        }
        else {
            strDom += '<li><input type="button" id="historyPlay" title="" value=""></li>';
        }

        strDom += '</div>';

        strDom += '<div id="diff-circle" class="circle-mark"></div>';

        $('body').append(strDom);

        // Appending Thumbnails
        var actCnt = new Number(0);
        var difLvl = new Number(0);

        for ( var pg = 0; pg < this.pgrTotal; pg++ ) {
            for ( var act = 0; act < scnsPerPage; act++ ) {
                var thumb = this.images['thumb_' + actCnt];

                thumb.id = 'sceneThumb_' + actCnt;
                thumb.className = 't' + String(Math.ceil(act + 1));

                $('.pgr_' + pg).append(thumb);
                $('#sceneThumb_' + actCnt).attr('accesskey', actCnt);
                $('#sceneThumb_' + actCnt).attr('difficult', difLvl);

                actCnt++;
            }

            difLvl++;
        }

        // Click handler for thumbnails
        $('#carousel img').bind('click', function(event) {
            event.preventDefault();

            rowComplete = new Array();

            for ( var lc = 0; lc < levelDifficult; lc++ ) {
                rowComplete.push(0);
            }

            // Set Level
            sceneCurrent = parseInt($(this).attr('accesskey'));
            dfcltCurrent = parseInt($(this).attr('difficult'));
            $('#goQualify').attr('class', '');

            // Start Game Logic
            GameMngr = null;
            GameMngr = new GammoGame();
            GameMngr.svgs = context.svgs;
            GameMngr.images = context.images;
            GameMngr.init();
        });

        // Launcher for Image Chooser
        $('#sceneChooser').bind('click', function(event) {
            timerStop();
            GameMngr.reset();
            $('#goQualify').attr('class', 'none');
        });

        // Launcher for Main Audio
        if ( !safaMob() ) {
            $('#historyPlay').bind('click', function(event) {
                SoundMngr.play('background', 0, 0);
            });
        }

        // Pretty Print
        prettyPrint();

        // Gammo Navigation
        NavMngr = new GammoNav();
        NavMngr.init();

        // Play Main Sound
        // SoundMngr.play('background', 0, 0);

        // Stop Loading
        ModalMngr.close();
    }
};
