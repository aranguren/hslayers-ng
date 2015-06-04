'use strict';

var hsl_path = '../../';
//var jans_path = 'http://home.zcu.cz/~jezekjan/webglayer-gl-filter2/js/'; //http://localhost:9999/js/webglayer/js/

var jans_path = 'http://localhost:9999/js/webglayer/js/';

//https://github.com/tnajdek/angular-requirejs-seed
require.config({
    paths: {
        toolbar: hsl_path + 'components/toolbar/toolbar',
        layermanager: hsl_path + 'components/layermanager/layermanager',
        map: hsl_path + 'components/map/map',
        ows: hsl_path + 'components/ows/ows',
        'ows.wms': hsl_path + 'components/ows/ows_wms',
        'ows.nonwms': hsl_path + 'components/ows/ows_nonwms',
        'ows.wmsprioritized': hsl_path + 'components/ows/ows_wmsprioritized',
        query: hsl_path + 'components/query/query',
        search: hsl_path + 'components/search/search',
        print: hsl_path + 'components/print/print',
        permalink: hsl_path + 'components/permalink/permalink',
        lodexplorer: hsl_path + 'components/lodexplorer/lodexplorer',
        geolocation: hsl_path + 'components/geolocation/geolocation',
        measure: hsl_path + 'components/measure/measure',
        legend: hsl_path + 'components/legend/legend',
        app: 'app',
        d3: hsl_path + 'lib/d3.v3.min',
        xml2json: hsl_path + 'lib/xml2json.min',
        panoramio: hsl_path + 'components/panoramio/panoramio',
        core: hsl_path + 'components/core/core',
        WfsSource: hsl_path + 'extensions/hs.source.Wfs',
        api: hsl_path + 'components/api/api',
        translations: hsl_path + 'components/translations/js/translations',
        dimension: jans_path + '/Dimension',
        glutils:  jans_path + 'GLUtils',
        manager:  jans_path + 'Manager',
        mapcontroller: jans_path + 'MapController',
        heatmapdimension: jans_path + 'HeatMapDimension',
        stackedbarchart: jans_path + 'StackedBarChart',
        histogramdimension: jans_path + 'HistogramDimension',
        floatrasterreader: jans_path + 'FloatRasterReader',
        histfilterrender: jans_path + 'HistFilterRender',
        multibrush: jans_path + 'd3.svg.multibrush',
        filter: jans_path + 'Filter',
        dataloader: 'DataLoader',
        ol: hsl_path + 'lib/ol3/ol-full',
        wgl: 'webglinit',
        chart_panel: hsl_path + 'examples/webgl_viz/chart_panel/chart_panel',
      
        
    },

});

//http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
window.name = "NG_DEFER_BOOTSTRAP!";

require(['core'], function(app) {
    require(['app'], function(app) {
        var $html = angular.element(document.getElementsByTagName('html')[0]);
        angular.element().ready(function() {
            angular.resumeBootstrap([app['name']]);
        });
    });
});