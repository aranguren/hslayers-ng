'use strict';

var hsl_path = '../../';
require.config({
    paths: {
        toolbar: hsl_path + 'components/toolbar/toolbar',
        bootstrap: hsl_path + 'bower_components/bootstrap/dist/js/bootstrap.min',
        layermanager: hsl_path + 'components/layermanager/layermanager',
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
        ol: hsl_path + 'bower_components/ol3/build/ol',
        panoramio: hsl_path + 'components/panoramio/panoramio',
        core: hsl_path + 'components/core/core',
        SparqlJsonForestry: hsl_path + 'extensions/hs.source.SparqlJsonForestry',
        api: hsl_path + 'components/api/api',
        translations: hsl_path + 'components/translations/js/translations',
    },
    shim: {
        d3: {
            exports: 'd3'
        },
        dc: {
            deps: ['d3', 'crossfilter']
        }
    }
});

window.name = "NG_DEFER_BOOTSTRAP!";

require(['core'], function(app) {
    require(['app'], function(app) {
        var $html = angular.element(document.getElementsByTagName('html')[0]);
        angular.element().ready(function() {
            angular.resumeBootstrap([app['name']]);
        });
    });
});