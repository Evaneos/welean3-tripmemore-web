/* global $, document */

'use strict';

// Front basic stuff -----------------------------------------------------------
require('./misc/console-fix');
var appConfig = require('./../../config/app');

// Avoid touch delay on mobile devices
// @see https://github.com/ftlabs/fastclick
var attachFastClick = require('../../bower_components/fastclick/lib/fastclick.js');
attachFastClick(document.body);

// Tooltips --------------------------------------------------------------------
$('*[data-tooltip]').tooltipster({
   animation: 'grow',
   delay: 250,
   theme: 'tooltipster-tripmemore',
   touchDevices: false,
   trigger: 'hover'
});

// -----------------------------------------------------------------------------
// Screen
// -----------------------------------------------------------------------------

/**
 * Global event dispatcher
 * Event list :
    - init: once the screen is loaded
    - list
        - listUpdated: when sidebar list end to update
        - listCleared
    - map
        - mapDrawn
        - mapCleaned
        - pinsDrawn
        - pinFocused: once a pin is focused
        - pinZoomed
 */

require('./inc/jquery/jquery.plugin');

$.plugin('pinList', require('./inc/jquery/jquery.pinList'));
$.plugin('map', require('./inc/jquery/jquery.map'));

// Global event dispatcher
var eventDispatcher = require('./inc/eventDispatcher');
//eventDispatcher.enableLog();

var itemModal = require('./inc/jquery/jquery.itemView');
$.get(appConfig.urls.app + 'static/templates/item.ejs', {}, function(template) {
    // Item view modal
    itemModal.setup({
        eventDispatcher: eventDispatcher,
        modalId : 'modal',
        templates : {
            image: template,
            page: template,
        },
        modalTemplate : '<div class="tripmemore-modal">' +
                            '<div class="mfp-close"></div>' +
                            '<div class="inside" data-content></div>' +
                        '</div>'
    });

    $.get(appConfig.urls.app + 'static/templates/pin.ejs', {}, function(template) {
        // Pin list
        $('.pinlist-wrapper').pinList({
            eventDispatcher : eventDispatcher,
            itemTemplate: template,
            modal : itemModal
        });

        $('#map').map({
            eventDispatcher : eventDispatcher,
            modal : itemModal
        });

        // Trigger a init event - @tochange depending on view
        eventDispatcher.trigger('init');
    }, 'text');
}, 'text');