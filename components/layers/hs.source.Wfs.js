define(['ol'], function (ol) {
    return function(options) {
        if (typeof options.version == 'undefined') options.version = '1.0.0';
        if (typeof options.hsproxy == 'undefined') options.hsproxy = true;
        if (typeof options.format == 'undefined') options.format = new ol.format.GeoJSON();
        options.projection = options.projection.toUpperCase();
        if (typeof options.parser == 'undefined') options.parser = function(response) {
            var features = [];
            var gm = new ol.format.GML3();
            for (var key in gm) {
                if (key.indexOf("_PARSERS") > 0)
                    gm[key]["http://www.opengis.net/gml/3.2"] = gm[key]["http://www.opengis.net/gml"];
            }
            $("member", response).each(function() {
                var attrs = {};
                var geom_node = $("geometry", this).get(0) || $("CP\\:geometry", this).get(0);
                attrs.geometry = gm.readGeometryElement(geom_node, [{}]);
                var feature = new ol.Feature(attrs);
                features.push(feature);
            });
            return features;
        }

        var src = new ol.source.Vector({
            format: options.format,
            loader: function(extent, resolution, projection) {
                this.set('loaded', false);
                this.clear();
                if (console) console.log("resolution", resolution);
                var p = options.url + (options.url.indexOf('?') > 0 ? '&' : '?') +
                    'service=WFS&TYPENAME=' + options.typename + '&request=GetFeature&' +
                    'version=' + options.version + '&' +
                    'SRSNAME=' + options.projection + '&outputFormat=geojson&' +
                    'bbox=' + extent.join(',') + ',urn:ogc:def:crs:EPSG:6.3:3857';
                var url = options.hsproxy ? "/cgi-bin/hsproxy.cgi?toEncoding=utf-8&url=" + window.escape(p) : p;

                $.ajax({
                        url: url,
                        context: this
                    })
                    .done(function(response) {
                        this.addFeatures(options.parser(response));
                        this.hasLine = false;
                        this.hasPoly = false;
                        this.hasPoint = false;
                        angular.forEach(this.getFeatures(), function(f) {
                            if (f.getGeometry()) {
                                switch (f.getGeometry().getType()) {
                                    case 'LineString' || 'MultiLineString':
                                        this.hasLine = true;
                                        break;
                                    case 'Polygon' || 'MultiPolygon':
                                        this.hasPoly = true;
                                        break;
                                    case 'Point' || 'MultiPoint':
                                        this.hasPoint = true;
                                        break;
                                }
                            }
                        })

                        if (this.hasLine || this.hasPoly || this.hasPoint) {
                            this.styleAble = true;
                        }
                        this.set('loaded', true);
                    });
            },
            projection: options.projection,
            strategy: ol.loadingstrategy.bbox
        });
        src.defOptions = options;
        return src;
    };
});
