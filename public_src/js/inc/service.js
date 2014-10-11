
/*
 * Easy call a service
 * Usage:
 * service = require(service.js);
 */
var config = require('./config'),
    urlHelper = require('../../../utils/urlHelper')(config.url),
    URI = require('URIjs'),
    apiResponse = require('../../../utils/apiResponse');

module.exports = {
    defaults : {
        service : '',   // service name
        action: '',     // Service action
        filters: {},    // Object filtering
        data : {},      // Service args
        success : function(data) {},    // Callback on success
        fail : function(data) {},        // Callback on fail
        error : function() {}      // Callback on error
    },
    call: function(options) {
        options = $.extend({}, this.defaults, options);
        var type = '';

        switch(options.action) {
            case 'get' : 
                type='GET';
                options.data = {};
            break;
            case 'update' : 
                type='PUT'; 
            break;
            case 'delete' : 
                type='DELETE';
                options.data = {};
            break;
            case 'create' : 
                type='POST'; 
                options.filters = {};
            break;
            default :
                alert('Internal error');
                return false;
        }

        var url = URI( urlHelper('api/' + options.service + '/' + options.action));
        url.query(options.filters);
        $.ajax({
            url: url,
            type: type,
            data: options.data
        })
        .done(function(data, textStatus, jqXHR) {
            var response = new apiResponse();
            response.init(data);
            switch(response.status) {
                case response.STATUS_ERROR :
                    return options.error();
                case response.STATUS_SUCCESS :
                    return options.success(response.data);
                case response.STATUS_FAIL :
                    return options.fail(response.data);
                default :
                    options.error();
            }
        })
        .error(function(jqXHR, textStatus, err) {
            options.error();
        });
    }
};
