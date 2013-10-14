/**
 * Created By:
 * Carlos Bucheli Engr.
 * colaborum@gmail.com
 */

/********************************
 * Initializing the whole thing *
 ********************************/

$(window).bind("load",function() {
    var docLoc = new String(document.location);
    var fileName = docLoc.substring(docLoc.lastIndexOf('/') + 1);
    var assetsUrl = ( fileName.length ) ? docLoc.substr(0, docLoc.lastIndexOf(fileName)) : docLoc;

    // Styles
    assetsPath.push(assetsUrl + 'assets/css/');
    assetsLabel.push('Loading Styles');
    assetsLoatType.push('request');

    assetsStyles.push({id:'reset', url:'nav/reset.css'});
    assetsStyles.push({id:'style', url:'nav/style.css'});
    assetsStyles.push({id:'prettify', url:'nav/prettify-sunburst-customized.css'});
    assetsStyles.push({id:'navDefault', url:'nav/default.css'});
    assetsStyles.push({id:'uiDefault', url:'ui/default.css'});
    assetsStyles.push({id:'uiDefault', url:'ui/responsive.css'});

    // Scripts
    assetsPath.push(assetsUrl + 'assets/js/');
    assetsLabel.push('Loading Scripts');
    assetsLoatType.push('request');

    assetsScripts.push({id:'jQuery', url:'jquery-1.10.2.min.js'});
    assetsScripts.push({id:'carouFredSel', url:'jquery.carouFredSel.js'});
    assetsScripts.push({id:'prettifyJS', url:'prettify.js'});
    assetsScripts.push({id:'prettifyCSS', url:'prettify.css.js'});
    assetsScripts.push({id:'nav', url:'nav.js'});

    assetsScripts.push({id:'globals', url:'gammo/globals.js'});
    assetsScripts.push({id:'modal', url:'gammo/modal.js'});
    assetsScripts.push({id:'gloader', url:'gammo/gloader.js'});
    assetsScripts.push({id:'init', url:'gammo/init.js'});

    // Images
    assetsPath.push(assetsUrl + 'assets/images/');
    assetsLabel.push('Loading Images');
    assetsLoatType.push('img');
    assetsImages.push({id:'loader', url:'loader.gif'});
    assetsImages.push({id:'img-loader', url:'img-loader.gif'});
    assetsImages.push({id:'bodyBg', url:'body-bg.png'});

    // Thumbnails
    for ( var t = 0; t < scnsTotal; t++ ) {
        assetsImages.push({id:'thumb_' + t, url:'thumbnails/' + t + '.svg'});
    }

    // SVG
    assetsPath.push(assetsUrl + 'assets/svg/');
    assetsLabel.push('Loading SVG');
    assetsLoatType.push('svg');

    assetsSVG.push({id:'crayon', url:'crayon.svg'});
    assetsSVG.push({id:'circled', url:'circled.svg'});

    /**
     * SVG Scenes
     */
    for ( var s = 0; s < scnsTotal; s++  ) {
        assetsSVG.push({id:'scene_l_' + s, url:'scenes/' + s + '_l.svg'});
        assetsSVG.push({id:'scene_r_' + s, url:'scenes/' + s + '_r.svg'});
    }

    assetsSVG.push({id:'btnQualify', url:'qualifyButton.svg'});
    assetsSVG.push({id:'btnWrong', url:'wrongButton.svg'});

    assetsSVG.push({id:'btnErr', url:'btnErr.svg'});
    assetsSVG.push({id:'btnOk', url:'btnOk.svg'});

    assetsSVG.push({id:'iconAudio', url:'icons/audio.svg'});
    assetsSVG.push({id:'iconBulb', url:'icons/bulb.svg'});
    assetsSVG.push({id:'iconBulbBW', url:'icons/bulb-bw.svg'});
    assetsSVG.push({id:'iconCamera', url:'icons/camera.svg'});
    assetsSVG.push({id:'iconCheck', url:'icons/check.svg'});
    assetsSVG.push({id:'iconSettings', url:'icons/settings.svg'});

    // Sounds
    assetsPath.push(assetsUrl + 'assets/sounds/');
    assetsLabel.push('Loading Sounds');
    assetsLoatType.push('sound');
    assetsSounds.push({id:'background', url:'background.mp3'});
    assetsSounds.push({id:'error', url:'error.mp3'});
    assetsSounds.push({id:'acierto', url:'acierto.mp3'});
    assetsSounds.push({id:'final', url:'final.mp3'});

    assetsAvail.push(assetsStyles);
    assetsAvail.push(assetsScripts);
    assetsAvail.push(assetsImages);
    assetsAvail.push(assetsSVG);
    assetsAvail.push(assetsSounds);

    // Initialize the Modal Manager
    ModalMngr = new ModalManager();

    // Initialize the Sound Manager
    SoundMngr = new GammoSound();
    SoundMngr.init();

    // Initialize the Assets Manager
    GameLoader = new GammoLoader(assetsPath, assetsAvail);
    GameLoader.loadNext();
});







/*$(function() {

	$(window).bind('resize.site', function() {
		var f = ($(window).height() < 750) ? 'removeClass' : 'addClass';
		$('body')[f]('largescreen');
	}).trigger('resize.site');
*/
	
	/* $('#c-cur-sour').click(function() {
		$('#c-sourcecode').slideToggle( 1000 );
		$('html, body').animate({
			scrollTop: $('#c-current ul').offset().top
		});
		return false;
	});
}); */