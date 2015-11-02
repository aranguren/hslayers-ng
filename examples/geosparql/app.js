'use strict';

define(['ol', 'dc', 'toolbar', 'layermanager', 'SparqlJson', 'query', 'search', 'print', 'permalink', 'measure', 'geolocation', 'legend', 'bootstrap', 'panoramio', 'bootstrap', 'api'],

    function(ol, dc, toolbar, layermanager, SparqlJson) {
        var module = angular.module('hs', [
            'hs.toolbar',
            'hs.layermanager',
            'hs.query',
            'hs.search', 'hs.print', 'hs.permalink',
            'hs.geolocation',
            'hs.legend',
            'hs.api',
            /*'hs.feature_crossfilter', */
            'hs.panoramio'
        ]);

        module.directive('hs', ['Core', function(Core) {
            return {
                templateUrl: hsl_path + 'hslayers.html',
                link: function(scope, element) {
                    Core.fullscreenMap(element, 'right');
                }
            };
        }]);

        var style = function(feature, resolution) {
            if (typeof feature.get('visible') === 'undefined' || feature.get('visible') == true) {
                var s = feature.get('http://www.openvoc.eu/poi#categoryOSM');
                if (typeof s === 'undefined') return;
                s = s.split(".")[1];
                return [
                    new ol.style.Style({
                        image: new ol.style.Icon({
                            anchor: [0.5, 1],
                            src: 'symbols/' + s + '.svg',
                            crossOrigin: 'anonymous'
                        })
                    })

                ]
            } else {
                return [];
            }
        }


        var sparql_layers = [];
        angular.forEach(['amenity.arts_centre',
            'amenity.atm',
            'amenity.bank',
            'amenity.bicycle_rental',
            'amenity.cafe',
            'amenity.car_wash',
            'amenity.dentist',
            'amenity.fast_food',
            'amenity.fountain',
            'amenity.library',
            'amenity.parking',
            'amenity.place_of_worship',
            'amenity.pub',
            'amenity.restaurant',
            'amenity.waste_basket',
            'building.hotel',
            'highway.bus_stop',
            'historic.archaeological_site',
            'historic.memorial',
            'shop.supermarket',
            'tourism.artwork',
            'tourism.camp_site',
            'tourism.information',
            'tourism.viewpoint',
            'tourism.zoo'
        ], function(value) {
            var value2;
            switch (value) {
                case 'amenity.arts_centre':
                    value2 = "Arts Center";
                    break;
                case 'amenity.atm':
                    value2 = "ATM";
                    break;
                case 'amenity.bank':
                    value2 = "Bank";
                    break;
                case 'amenity.bicycle_rental':
                    value2 = "Bicycle Rental";
                    break;
                case 'amenity.cafe':
                    value2 = "Cafe";
                    break;
                case 'amenity.car_wash':
                    value2 = "Car Wash";
                    break;
                case 'amenity.dentist':
                    value2 = "Dentist";
                    break;
                case 'amenity.fast_food':
                    value2 = "Fast Food";
                    break;
                case 'amenity.fountain':
                    value2 = "Fountain";
                    break;
                case 'amenity.library':
                    value2 = "Library";
                    break;
                case 'amenity.parking':
                    value2 = "Parking";
                    break;
                case 'amenity.place_of_worship':
                    value2 = "Place of Worship";
                    break;
                case 'amenity.pub':
                    value2 = "Pub";
                    break;
                case 'amenity.restaurant':
                    value2 = "Restaurant";
                    break;
                case 'amenity.waste_basket':
                    value2 = "Waste Basket";
                    break;
                case 'building.hotel':
                    value2 = "Hotel";
                    break;
                case 'highway.bus_stop':
                    value2 = "Bus Stop";
                    break;
                case 'historic.archaeological_site':
                    value2 = "Archaeological Site";
                    break;
                case 'historic.memorial':
                    value2 = "Memorial";
                    break;
                case 'shop.supermarket':
                    value2 = "Supermarket";
                    break;
                case 'tourism.artwork':
                    value2 = "Artwork";
                    break;
                case 'tourism.camp_site':
                    value2 = "Camp Site";
                    break;
                case 'tourism.information':
                    value2 = "Information";
                    break;
                case 'tourism.viewpoint':
                    value2 = "Viewpoint";
                    break;
                case 'tourism.zoo':
                    value2 = "Zoo";
                    break;
            };
            var new_lyr = new ol.layer.Vector({
                title: " " + value2,
                source: new SparqlJson({
                    geom_attribute: 'bif:st_geomfromtext(UCASE(?geom))',
                    url: 'http://ha.isaf2014.info:8890/sparql?default-graph-uri=&query=' + encodeURIComponent('SELECT ?o ?p ?s FROM <http://www.sdi4apps.eu/poi.rdf> WHERE { ?o <http://www.openvoc.eu/poi#categoryOSM> ?filter_categ. ?o <http://www.opengis.net/ont/geosparql#asWKT> ?geom. FILTER(isBlank(?geom) = false). FILTER (str(?filter_categ) = "' + value + '"). ') + '<extent>' + encodeURIComponent('	?o ?p ?s } ORDER BY ?o') + '&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on',
                    category_field: 'http://www.openvoc.eu/poi#categoryOSM',
                    projection: 'EPSG:3857'
                        //feature_loaded: function(feature){feature.set('hstemplate', 'hs.geosparql_directive')}
                }),
                style: style,
                visible: false,
                path: 'Points of interest'
            });
            sparql_layers.push(new_lyr);
        })

        var route_style = function(feature, resolution) {
            return [new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: "rgba(242, 78, 60, 0.9)",
                    width: 2
                })
            })]
        };

        module.value('config', {
            box_layers: [new ol.layer.Group({
                'img': 'osm.png',
                title: 'Base layer',
                layers: [
                    new ol.layer.Tile({
                        source: new ol.source.OSM(),
                        title: "OpenStreetMap",
                        base: true,
                        visible: false,
                        path: 'Roads'
                    }),
                    new ol.layer.Tile({
                        title: "OpenCycleMap",
                        visible: true,
                        base: true,
                        source: new ol.source.OSM({
                            url: 'http://{a-c}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png'
                        }),
                        path: 'Roads'
                    }),
                    new ol.layer.Tile({
                        title: "MTBMap",
                        visible: false,
                        base: true,
                        source: new ol.source.XYZ({
                            url: 'http://tile.mtbmap.cz/mtbmap_tiles/{z}/{x}/{y}.png'
                        }),
                        path: 'Roads'
                    }),
                    new ol.layer.Tile({
                        title: "OwnTiles",
                        visible: false,
                        base: true,
                        source: new ol.source.XYZ({
                            url: 'http://ct37.sdi4apps.eu/map/{z}/{x}/{y}.png'
                        }),
                        path: 'Roads'
                    })
                ],
            }), new ol.layer.Group({
                'img': 'bicycle-128.png',
                title: 'Tourist info',
                layers: sparql_layers.concat([
                    new ol.layer.Vector({
                        title: "Cycling routes Plzen",
                        source: new ol.source.Vector({
                            format: new ol.format.GeoJSON(),
                            loader: function(extent, resolution, projection) {
                                $.ajax({
                                    url: 'plzensky_kraj.geojson',
                                    success: function(data) {
                                        src.addFeatures(src.readFeatures(data));
                                    }
                                });
                            },
                            strategy: ol.loadingstrategy.all
                        }),
                        style: route_style,
                        path: 'Roads/Additional Cycling routes'
                    }),
                    new ol.layer.Vector({
                        title: "Cycling routes Zemgale",
                        source: new ol.source.Vector({
                            format: new ol.format.GeoJSON(),
                            loader: function(extent, resolution, projection) {
                                $.ajax({
                                    url: 'zemgale.geojson',
                                    success: function(data) {
                                        src.addFeatures(src.readFeatures(data));
                                    }
                                });
                            },
                            strategy: ol.loadingstrategy.all
                        }),
                        style: route_style,
                        path: 'Roads/Additional Cycling routes'
                    }),
                    new ol.layer.Vector({
                        title: "Tour de LatEst",
                        source: new ol.source.Vector({
                            format: new ol.format.GeoJSON(),
                            loader: function(extent, resolution, projection) {
                                $.ajax({
                                    url: 'teourdelatest.geojson',
                                    success: function(data) {
                                        src.addFeatures(src.readFeatures(data));
                                    }
                                });
                            },
                            strategy: ol.loadingstrategy.all
                        }),
                        style: route_style,
                        path: 'Roads/Additional Cycling routes'
                    }),
                    new ol.layer.Vector({
                        title: "A1: the Vltava left-bank cycle route",
                        source: new ol.source.Vector({
                            format: new ol.format.GeoJSON(),
                            loader: function(extent, resolution, projection) {
                                $.ajax({
                                    url: 'prague.geojson',
                                    success: function(data) {
                                        src.addFeatures(src.readFeatures(data));
                                    }
                                });
                            },
                            strategy: ol.loadingstrategy.all
                        }),
                        style: route_style,
                        path: 'Roads/Additional Cycling routes'
                    }),
                    new ol.layer.Image({
                        title: "Forest roads",
                        BoundingBox: [{
                            crs: "EPSG:3857",
                            extent: [1405266, 6146786, 2073392, 6682239]
                        }],
                        source: new ol.source.ImageWMS({
                            url: 'http://gis.lesprojekt.cz/cgi-bin/mapserv?map=/home/ovnis/sdi4aps_forest_roads.map',
                            params: {
                                LAYERS: 'forest_roads,haul_roads',
                                INFO_FORMAT: "application/vnd.ogc.gml",
                                FORMAT: "image/png; mode=8bit"
                            },
                            crossOrigin: null
                        }),
                        path: 'Roads'
                    })
                ])
            }), new ol.layer.Group({
                'img': 'partly_cloudy.png',
                title: 'Weather',
                layers: [new ol.layer.Tile({
                        title: "OpenWeatherMap cloud cover",
                        source: new ol.source.XYZ({
                            url: "http://{a-c}.tile.openweathermap.org/map/clouds/{z}/{x}/{y}.png"
                        }),
                        visible: false,
                        opacity: 0.7,
                        path: 'Weather info'
                    }),
                    new ol.layer.Tile({
                        title: "OpenWeatherMap precipitation",
                        source: new ol.source.XYZ({
                            url: "http://{a-c}.tile.openweathermap.org/map/precipitation/{z}/{x}/{y}.png"
                        }),
                        visible: false,
                        opacity: 0.7,
                        path: 'Weather info'
                    }),
                    new ol.layer.Tile({
                        title: "OpenWeatherMap temperature",
                        source: new ol.source.XYZ({
                            url: "http://{a-c}.tile.openweathermap.org/map/temp/{z}/{x}/{y}.png"
                        }),
                        visible: false,
                        opacity: 0.7,
                        path: 'Weather info'
                    })
                ]
            })],
            crossfilterable_layers: [{
                layer_ix: 2,
                attributes: ["http://gis.zcu.cz/poi#category_osm"]
            }],
            default_view: new ol.View({
                center: [1490321.6967438285, 6400602.013496143], //Latitude longitude    to Spherical Mercator
                zoom: 14,
                units: "m"
            }),
            infopanel_template: hsl_path + 'examples/geosparql/infopanel.html'
        });

        module.controller('Main', ['$scope', '$filter', 'Core', 'hs.map.service', 'hs.query.service_infopanel',
            function($scope, $filter, Core, OlMap, InfoPanelService) {
                if (console) console.log("Main called");
                $scope.hsl_path = hsl_path; //Get this from hslayers.js file
                $scope.Core = Core;

                $scope.$on('infopanel.updated', function(event) {});

                var pop_div = document.createElement('div');
                document.getElementsByTagName('body')[0].appendChild(pop_div);
                var popup = new ol.Overlay({
                    element: pop_div
                });
                OlMap.map.addOverlay(popup);

                var show_location_weather = true;
                $scope.$on('map_clicked', function(event, data) {
                    if (!show_location_weather) return;
                    var on_features = false;
                    angular.forEach(data.frameState.skippedFeatureUids, function(k) {
                        on_features = true;
                    });
                    if (on_features) return;
                    var coordinate = data.coordinate;
                    var lon_lat = ol.proj.transform(
                        coordinate, 'EPSG:3857', 'EPSG:4326');
                    var url = '';
                    if (typeof use_proxy === 'undefined' || use_proxy === true) {
                        url = "/cgi-bin/hsproxy.cgi?toEncoding=utf-8&url=" + window.escape("http://api.openweathermap.org/data/2.5/weather?lat=" + lon_lat[1] + "&lon=" + lon_lat[0]);
                    } else {
                        url = "http://api.openweathermap.org/data/2.5/weather?lat=" + lon_lat[1] + "&lon=" + lon_lat[0];
                    }

                    $.ajax({
                            url: url
                        })
                        .done(function(response) {
                            if (console) console.log(response);
                            var element = popup.getElement();

                            var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(
                                coordinate, 'EPSG:3857', 'EPSG:4326'));
                            $(element).popover('destroy');
                            var content = 'No weather info';
                            if (response.weather) {
                                var wind_row = 'Wind: ' + response.wind.speed + 'm/s' + (response.wind.gust ? ' Gust: ' + response.wind.gust + 'm/s' : '');
                                var close_button = '<button type="button" class="close"><span aria-hidden="true">×</span><span class="sr-only" translate>Close</span></button>';
                                var weather = response.weather[0];
                                var cloud = '<img src="http://openweathermap.org/img/w/' + weather.icon + '.png" alt="' + weather.description + '"/>' + weather.description;
                                var temp_row = 'Temperature: ' + (response.main.temp - 273.15).toFixed(1) + ' °C';
                                var date_row = $filter('date')(new Date(response.dt * 1000), 'dd.MM.yyyy HH:mm');
                                content = close_button + '<p><b>' + response.name + '</b><br/><small> at ' + date_row + '</small></p>' + cloud + '<br/>' + temp_row + '<br/>' + wind_row;
                            }
                            $(element).popover({
                                'placement': 'top',
                                'animation': false,
                                'html': true,
                                'content': content
                            });

                            popup.setPosition(coordinate);
                            $(element).popover('show');
                            $('.close', element.nextElementSibling).click(function() {
                                $(element).popover('hide');
                                //show_location_weather = false;
                            });
                        });

                });

                $scope.$on('feature_crossfilter_filtered', function(event, data) {
                    var lyr = OlMap.findLayerByTitle('Specific points of interest');
                    var src = lyr.getSource();
                    src.clear();
                    if (data !== '') {
                        src.options.geom_attribute = 'bif:st_geomfromtext(UCASE(?geom))';
                        src.options.url = 'http://ha.isaf2014.info:8890/sparql?default-graph-uri=&query=' + encodeURIComponent('SELECT ?o ?p ?s FROM <http://www.sdi4apps.eu/poi.rdf> WHERE { ?o <http://www.openvoc.eu/poi#categoryOSM> ?filter_categ. ?o <http://www.opengis.net/ont/geosparql#asWKT> ?geom. FILTER(isBlank(?geom) = false). FILTER (str(?filter_categ) = "' + data + '"). ') + '<extent>' + encodeURIComponent('	?o ?p ?s } ORDER BY ?o') + '&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on';
                    } else
                        src.options.url = '';
                })
            }
        ]);

        return module;
    });
