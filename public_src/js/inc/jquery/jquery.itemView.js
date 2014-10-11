'use strict';

/* global $, ejs, L, alert */

var appConfig = require('../../../../config/app.js');

module.exports = {
    options: {
        eventDispatcher: null,
        templates : {},
        modalId : 'modal',
        modalTemplate : '<div class="tripmemore">' +
                            '<div class="mfp-close"></div>' +
                            '<div class="inside" data-content></div>' +
                        '</div>',
        modalMapId : 'map-details'
    },
    setup: function(options) {
        this.options = $.extend({},this.options,options);
    },

    showItemFromList: function(itemList, itemId) {
        var me = this;

        // Get the position in the array to display the good place in gallery mode
        // @torefactor: it's so uglyyyy
        var keyPosition = -1;
        if('undefined'===typeof(itemId)) {
            keyPosition = 0;
        }
        else {
            for(var i=0; i<itemList.length; i++) {
                if(itemList[i]._id===itemId) {
                    keyPosition = i;
                }
            }
            if(keyPosition<0) {
                alert('Item not found');
            }    
        }

        $.magnificPopup.open({ 
            key: me.options.modalId,
            items: itemList,
            type: 'inline',
            inline: {
                markup: me.options.modalTemplate
            },
            gallery: {
                enabled: true 
            },
            callbacks: {
                markupParse: function($template, item) {
                    var $content = $template.find('*[data-content]'),
                        ejsTemplate = me.options.templates[item.media.type];

                    var $html = $(ejs.render(ejsTemplate, item));
                    $content.html($html);
                },
                change : function() {
                    var modal = this;
                    // @torefactor sorry that FUCKING plugin does not manage "change DONE"...
                    // Too late to change the tool, wanna to go working on server!
                    setTimeout(function() {
                        var $html = $(modal.content);
                        $html.find('#' + me.options.modalMapId).each(function() {
                            var ll = $(this).data('ll'),
                                lg = $(this).data('lg');
                            
                            // @todo global setting
                            // Leaflet map -----------------------------------------------------------------
                            var tileLayer = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
                            var tileAttributions = 'Tiles &copy; Esri';

                            L.Icon.Default.imagePath = appConfig.urls.app + 'static/leaflet';

                            var map = new L.map(me.options.modalMapId, {
                                zoomControl:false,
                                center: [ll, lg],
                                zoom: 4,
                                maxBounds : [
                                    [90, -100000000],
                                    [-90, 100000000]
                                ],
                                attributionControl: false
                            });

                            new L.control.attribution({
                                position: 'bottomleft',
                                attribution: tileAttributions
                            }).addAttribution(tileAttributions).addTo(map);

                            new L.tileLayer(tileLayer, {
                                minZoom: 3,
                                maxZoom: 10,
                                reuseTiles: false,
                                unloadInvisibleTiles: false
                            }).addTo(map);

                            L.marker([ll, lg]).addTo(map);

                        });
                    }, 100);
                    
                }
            }
        }, keyPosition);
    }
};