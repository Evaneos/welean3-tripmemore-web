/* global $ */

'use strict';

// jQuery plugins
if(!$.plugin) {
    $.plugin = function(name, object) {
        $.fn[name] = function(options) {
            if($(this).data(name)) {
                return $(this).data(name);
            }
            return this.each(function() {
                if ( ! $.data(this, name) ) {
                    $.data(this, name, Object.create(object).init(options, this));
                }
            });
        };
    };
}