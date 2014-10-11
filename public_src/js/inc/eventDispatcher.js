/**
 * A stupid and basic event dispatcher.
 */

'use strict';

module.exports =  {

    _logEnabled: false,
    events: {},

    trigger: function(eventName, data) {
        this._log('"' + eventName + '" triggered', data);
        if(this.events[eventName]) {
            data = data || {};
            this._log('"' + eventName + '" : ' + this.events[eventName].length + ' callback(s) to run');
            this.events[eventName].forEach(function(callback) {
                callback(data);
            });
        }
        return this;
    },
    subscribe: function(eventName, callback) {
        this._log('"' + eventName + '" event subscribed');
        if(!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
        return this;
    },

    // Log stuff
    enableLog: function() {
        this._logEnabled = true;
        return this;
    },
    disableLog: function() {
        this._logEnabled = false;
        return this;
    },
    _log: function(message, data) {
        data = data || '';
        if(this._logEnabled) {
            console.log('[eventDispatcher] ' + message, data);
        }
        return this;
    }
};