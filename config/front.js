var bower = __dirname + '/../bower_components';

module.exports = {  
    less: {
        paths: {
            src : './public_src/less',
            dist : './public/style'    
        },
        options: {
            compress: true,
            cleancss: true,
            strictImports: true,
            strictUnits: true,
            strictMath: false,
            sourceMap: true,
            globalVar: '',
            modifyVars: {},
            paths: ['bower_components']
        }
    },
    js: {
        paths: {
            src : './public_src/js',
            dist : './public/js'
        },
        linter: {},
        browserify : {
            insertGlobals: true,
            debug: false
        },
        uglify: {
            mangle: false,
            compress: true,
            output: {
                beautify: false
            }
        },
        vendor: {
            'vendors.js' : [
                bower + '/jquery/dist/jquery.js',
                bower + '/leaflet/dist/leaflet.js',
                bower + '/leaflet.markercluster/dist/leaflet.markercluster-src.js',
                bower + '/tooltipster/js/jquery.tooltipster.js',
                bower + '/ejs/ejs.js',
                bower + '/magnific-popup/dist/jquery.magnific-popup.min.js'
            ]
        }
    },
    fonts: {
        paths: {
            src : './public_src/fonts',
            dist : './public/fonts'
        }
    },
    static: {
        paths: {
            src : './public_src/static',
            dist : './public/static'
        }
    }
};