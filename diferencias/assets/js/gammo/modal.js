/**
 * Created By:
 * Carlos Bucheli Engr.
 * colaborum@gmail.com
 */

/*****************
 * Modal Manager *
 *****************/
var ModalManager = function () {
    this.contentOnLoad  = '<div id="appModal">';
    this.contentOnLoad += '<img src="./assets/images/loader.gif" class="loader">';
    this.contentOnLoad += '<span class="loadLabel">LOADING THE MAGIC</span></div>';

    this.contentCustom = '';

    /**
     * Sets the label text
     */
    this.label = function(str) {
        $('.modalLabel').text(str);
    }

    /**
     * Opens the Modal Layer
     */
    this.open = function() {
        $('#appModal').attr('class', '');
    }

    /**
     * Closes the Modal Layer
     */
    this.close = function() {
        $('#appModal').attr('class', 'none');
    }
};
