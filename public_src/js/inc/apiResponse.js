/**
 * Api object to set & get api response
 *
 * Usage to format data to output
 *  data = {...};
 *  var response = require('apiResponse.js')
 *  response.setSuccess(data);
 *  response.getJson();
 *
 * Usage to get data from api response
 *  $.ajax(...).done(function(data, textStatus, jqXHR) {
        var response = new apiResponse();
        response.init(data);

        if(response.isSuccess()) ...
        if(response.isError()) ...
        var data = response.getData();
    });
 */

'use strict';

module.exports = function(){
    // Statics
    this.STATUS_ERROR = 'error';
    this.STATUS_SUCCESS = 'success';
    this.STATUS_FAIL = 'fail';

    // Properties and default values
    this.status= this.STATUS_SUCCESS;
    this.message = null;
    this.code = null;
    this.data = null;

    // Setters
    this.setError= function(message, code) {
        this.status = this.STATUS_ERROR;
        this.message = message;
        this.code = code || 500;
        this.data = null;
    }.bind(this);

    this.setAccessDenied= function() {
        this.setError('Access denied', 403);
    }.bind(this);

    this.setSuccess= function(data) {
        this.status = this.STATUS_SUCCESS;
        this.data = data || {};
        this.message = null;
        this.code = null;
    }.bind(this);

    this.setFail= function(data) {
        this.status = this.STATUS_FAIL;
        this.message = null;
        this.code = null;
        this.data = data || {};
    }.bind(this);

    this.reset= function() {
        this.status = this.STATUS_SUCCESS;
        this.message = null;
        this.code = null;
        this.data = null;
    }.bind(this);

    // Object getter
    this.getJson= function() {
        var res = {
            status : this.status
        };
        if(null!==this.code) {
            res.code = this.code;
        }
        if(null!==this.data) {
            res.data = this.data;
        }
        if(null!==this.message) {
            res.data = this.message;
        }
        return res;
    }.bind(this);

    // Init from a response
    this.init= function(data) {
        if(data.status) {
            this.status = data.status;
        }
        if(data.code) {
            this.code = data.code;
        }
        if(data.data) {
            this.data = data.data;
        }
        if(data.message) {
            this.message = data.message;
        }
    }.bind(this);

    this.isError= function() {
        return this.status === this.STATUS_ERROR;
    }.bind(this);

    this.isFail= function() {
        return this.status === this.STATUS_FAIL;
    }.bind(this);

    this.isSuccess= function() {
        return this.status === this.STATUS_SUCCESS;
    }.bind(this);

    this.getData= function() {
        return this.data;
    }.bind(this);
};
