define(['angular', 'app', 'map', 'ol'],

    function(angular, app, map, ol) {
        angular.module('hs.wirecloud', ['hs', 'hs.map'])

        .service("WireCloud", ['$rootScope', 'OlMap', 'wirecloud_data_consumer', 'default_layers',
            function($rootScope, OlMap, wirecloud_data_consumer, default_layers) {
                var view = OlMap.map.getView();
                if (console) console.log('Wirecloud interface loaded');
                if (typeof MashupPlatform !== 'undefined') {
                    var extent_layer = default_layers[2];
                    $rootScope.$on('browserurl.updated', function(event) {
                        var center = view.getCenter();
                        center = ol.proj.transform(center, view.getProjection(), 'EPSG:4326');
                        MashupPlatform.wiring.pushEvent("center_event", center[0] + ', ' + center[1]);
                    });
                    MashupPlatform.wiring.registerCallback("center_slot", function(data) {
                        if (console) console.log("center_slot", data);
                        view.setCenter([parseFloat(data.split(",")[0]), parseFloat(data.split(",")[1])]);
                    });
                    MashupPlatform.wiring.registerCallback("draw_extent_slot", function(data) {
                        if (console) console.log("draw_extent_slot", data);
                        var b = data.split(",");
                        var first_pair = [parseFloat(b[0]), parseFloat(b[1])]
                        var second_pair = [parseFloat(b[2]), parseFloat(b[3])];
                        first_pair = ol.proj.transform(first_pair, 'EPSG:4326', 'EPSG:3857');
                        second_pair = ol.proj.transform(second_pair, 'EPSG:4326', 'EPSG:3857');
                        var extent = [first_pair[0], first_pair[1], second_pair[0], second_pair[1]];
                        view.fitExtent(extent, OlMap.map.getSize());
                        extent_layer.getSource().clear();
                        var attributes = {};
                        attributes.geometry = ol.geom.Polygon.fromExtent(extent);
                        extent_layer.getSource().addFeatures([new ol.Feature(attributes)]);
                    });
                    MashupPlatform.wiring.registerCallback("location_info_slot", function(data) {
                        if (console) console.log("location_info_slot", data)
                    });
                } else return;
            }
        ])

        .run(function(WireCloud) { // instance-injector
            //Gets executed after service is loaded
        });
    })