/* global $, L */

'use strict';

var appConfig = require('../../../../config/app.js');

module.exports =  {
    el: null,
    $el: null,

    _map: null,
    _markers : {},
    options: {
        eventDispatcher: null,
        modal: null
    },
    init: function(options, element) {
        this.options = $.extend({},this.options,options);

        this.el  = element;
        this.$el = $(element);

        this._init();
        return this;
    },

    _init: function() {
        this._eventSubscribe();
        this._initMap();
    },

    _eventSubscribe: function() {
        var me = this;
        this.options.eventDispatcher.subscribe('listUpdated', function(itemList) {
            me.uiFillList(itemList);
        });
        this.options.eventDispatcher.subscribe('requirePinFocus', function(pin) {
            me.focusPin(pin);
        });
        this.options.eventDispatcher.subscribe('requirePinZoom', function(pin) {
            me.zoomPin(pin);
        });
    },

    _initMap: function() {
        // @todo global setting
        // Leaflet map -----------------------------------------------------------------
        var tileLayer = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
        var tileAttributions = 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012';

        L.Icon.Default.imagePath = appConfig.urls.app + 'static/leaflet';

        this._map = new L.map('map', {
            zoomControl:false,
            center: [48.8587724, 2.346735],
            zoom: 14,
            maxBounds : [
                [90, -180],
                [-90, 180]
            ],
            attributionControl: false
        });

        new L.Control.Zoom({ 
            position: 'bottomright' 
        }).addTo(this._map);

        new L.control.attribution({
            position: 'bottomleft',
            attribution: tileAttributions
        }).addAttribution(tileAttributions).addTo(this._map);

        new L.control.scale({
            imperial: true,
            metric: true,
            position: 'bottomleft'
        }).addTo(this._map);

        new L.tileLayer(tileLayer, {
            minZoom: 2,
            maxZoom: 16,
            reuseTiles: false,
            unloadInvisibleTiles: false
        }).addTo(this._map);

        this.options.eventDispatcher.trigger('mapDrawn');
    },
    uiClearList: function() {
        this.options.eventDispatcher.trigger('mapCleaned');
    },
    uiFillList: function(itemList) {
        var pinArr = [],
            me = this;

        // @see https://github.com/Leaflet/Leaflet.markercluster
        // @todo set a custom and beatifull marker set
        var markers = L.markerClusterGroup({
            showCoverageOnHover: false,
            zoomToBoundsOnClick: false,
            disableClusteringAtZoom: 12,
            singleMarkerMode: true,
            maxClusterRadius: 50
        });

        itemList.forEach(function(pin) {
            var title = pin.place.name;
            var marker = L.marker(new L.LatLng(pin.place.ll, pin.place.lg), {title: title});
            marker.bindPopup(title);
            marker.on('mouseover', marker.openPopup.bind(marker));
            marker.options.pin = pin;
            me._markers[pin._id] = marker;
            markers.addLayer(me._markers[pin._id]);

            pinArr.push(L.marker([pin.place.ll, pin.place.lg]));
        });

        // Fit
        var group = new L.featureGroup(pinArr);
        this._map.fitBounds(group.getBounds());

        this._map.addLayer(markers);

        this.options.eventDispatcher.trigger('pinsDrawn');

        markers.on('click', function (a) {
            // @todo
            me.options.modal.showItemFromList([a.layer.options.pin]);
        });

        markers.on('clusterclick', function (a) {
            var clusters = a.layer.getAllChildMarkers(),
                pinToDisplay = [];
            for(var i=0; i<clusters.length; i++) {
                pinToDisplay.push(clusters[i].options.pin);
            }
            me.options.modal.showItemFromList(pinToDisplay);
        });
    },

    focusPin: function(pin) {
        if(this._markers[pin._id]) {
            this._map.panTo(new L.LatLng(pin.place.ll, pin.place.lg), {
                animate: true
            });
            this.options.eventDispatcher.trigger('pinFocused');
        }
    },
    zoomPin: function(pin) {
        this.focusPin(pin);
        if(this._markers[pin._id]) {
            var currentZoom = this._map.getZoom();
            if(currentZoom<9) {
                this._map.setZoom(currentZoom+3, {
                    animate: true
                });
            }
        }
    }
};