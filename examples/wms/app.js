'use strict';

define(['ol', 'toolbar', 'layermanager', 'ows', 'query', 'search', 'print', 'permalink', 'lodexplorer', 'measure', 'legend', 'panoramio', 'geolocation', 'api'],

    function(ol, toolbar, layermanager) {
        var module = angular.module('hs', [
            'hs.toolbar',
            'hs.layermanager',
            'hs.ows',
            'hs.query',
            'hs.search', 'hs.print', 'hs.permalink', 'hs.lodexplorer', 'hs.measure',
            'hs.legend', 'hs.panoramio', 'hs.geolocation', 'hs.api'
        ]);

        module.directive('hs', ['OlMap', 'Core', function(OlMap, Core) {
            return {
                templateUrl: hsl_path + 'hslayers.html',
                link: function(scope, element) {
                    Core.fullscreenMap(element);
                }
            };
        }]);

        module.value('box_layers', [{
            id: 'armenia',
            'img': 'armenia.png',
            title: 'Armenia'
        }, {
            id: 'osm',
            'img': 'osm.png',
            title: 'Open street map'
        }, {
            id: 'osm',
            'img': 'osm.png',
            title: 'Open street map'
        }, {
            id: 'osm',
            'img': 'osm.png',
            title: 'Open street map'
        }, {
            id: 'osm',
            'img': 'osm.png',
            title: 'Open street map'
        }, {
            id: 'osm',
            'img': 'osm.png',
            title: 'Open street map'
        }]);

        module.value('default_layers', [
            new ol.layer.Tile({
                source: new ol.source.MapQuest({
                    layer: 'sat'
                }),
                title: "Base layer",
                box_id: 'osm',
                base: true
            }),
            new ol.layer.Tile({
                title: "Swiss",
                source: new ol.source.TileWMS({
                    url: 'http://wms.geo.admin.ch/',
                    params: {
                        LAYERS: 'ch.swisstopo.pixelkarte-farbe-pk1000.noscale',
                        INFO_FORMAT: undefined,
                        FORMAT: "image/png; mode=8bit"
                    },
                    crossOrigin: null
                }),
            })
        ]);

        module.value('default_view', new ol.View({
            center: ol.proj.transform([17.474129, 52.574000], 'EPSG:4326', 'EPSG:3857'), //Latitude longitude    to Spherical Mercator
            zoom: 4,
            units: "m"
        }));

        module.controller('Main', ['$scope', 'Core', 'OwsWmsLayerProducer', 'InfoPanelService',
            function($scope, Core, OwsWmsLayerProducer, InfoPanelService) {
                if (console) console.log("Main called");
                $scope.hsl_path = hsl_path; //Get this from hslayers.js file
                $scope.Core = Core;
                OwsWmsLayerProducer.addService('http://erra.ccss.cz/geoserver/ows', 'armenia');

                $scope.$on('infopanel.updated', function(event) {
                    if (console) console.log('Attributes', InfoPanelService.attributes, 'Groups', InfoPanelService.groups);
                });
            }
        ]);

        return module;
    });