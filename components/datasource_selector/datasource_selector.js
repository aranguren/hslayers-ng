define(['angular', 'ol', 'map'],

    function(angular, ol) {
        angular.module('hs.datasource_selector', ['hs.map'])
            .directive('datasourceSelector', function() {
                return {
                    templateUrl: hsl_path + 'components/datasource_selector/partials/datasource_selector.html'
                };
            })

        .controller('DatasourceSelector', ['$scope', 'OlMap',
            function($scope, OlMap) {
                var map = OlMap.map;
                var default_style = new ol.style.Style({
                    image: new ol.style.Icon({
                        src: 'http://ewi.mmlab.be/otn/api/info/../../js/images/marker-icon.png',
                        offset: [0, 16]
                    }),
                    fill: new ol.style.Fill({
                        color: "rgba(139, 189, 214, 0.3)",
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#112211',
                        width: 1
                    })
                })

                $scope.datasets = null;

                $scope.loadDatasets = function(datasets) {
                    $scope.datasets = datasets;
                    for (var ds in $scope.datasets) {
                        var url = window.escape($scope.datasets[ds].url);
                        $.ajax({
                            url: "/cgi-bin/hsproxy.cgi?toEncoding=utf-8&url=" + url,
                            cache: false,
                            dataType: "json",
                            success: function(j) {
                                $scope.datasets[ds].layers = [];
                                $scope.datasets[ds].loaded = true;
                                for (var lyr in j) {
                                    if (j[lyr].keywords && j[lyr].keywords.indexOf("kml") > -1) {
                                        var obj = j[lyr];
                                        obj.path = lyr;
                                        $scope.datasets[ds].layers.push(obj);
                                    }
                                }
                                if (!$scope.$$phase) $scope.$digest();
                            }
                        });
                    }
                }

                $scope.setDefaultFeatureStyle = function(style) {
                    default_style = style;
                }

                $scope.addLayerToMap = function(ds, layer) {
                    if (ds.type == "datatank") {
                        if (layer.type == "shp") {
                            var src = new ol.source.KML({
                                url: ds.url + '/../../' + layer.path + '.kml',
                                projection: ol.proj.get('EPSG:3857'),
                                extractStyles: false
                            });
                            var lyr = new ol.layer.Vector({
                                title: layer.title || layer.description,
                                source: src,
                                style: default_style
                            });
                            var listenerKey = src.on('change', function() {
                                if (src.getState() == 'ready') {
                                    var extent = src.getExtent();
                                    src.unByKey(listenerKey);
                                    if (!isNaN(extent[0]) && !isNaN(extent[1]) && !isNaN(extent[2]) && !isNaN(extent[3]))
                                        OlMap.map.getView().fitExtent(extent, map.getSize());
                                }
                            });
                            OlMap.map.addLayer(lyr);

                        }
                    }
                }

                $scope.loadDatasets([{
                    title: "Datatank",
                    url: "http://ewi.mmlab.be/otn/api/info",
                    type: "datatank"
                }]);
                $scope.$emit('scope_loaded', "DatasourceSelector");
            }
        ]);

    });
