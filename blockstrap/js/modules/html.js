/*
 * 
 *  Blockstrap v0.5.0.2
 *  http://blockstrap.com
 *
 *  Designed, Developed and Maintained by Neuroware.io Inc
 *  All Work Released Under MIT License
 *  
 */

(function($) 
{
    var html = {};
    
    html.form = function()
    {
        return '{{#objects}}{{^fields_only}}<form id="{{id}}" class="{{css}}">{{/fields_only}}{{#fields}}<div class="form-group {{css}}">{{#inputs}}{{#label.text}}<label for="{{id}}" class="control-label {{label.css}}">{{label.text}}</label>{{/label.text}}{{#wrapper.css}}<div class="{{wrapper.css}}">{{/wrapper.css}}<input type="{{type}}" id="{{id}}" class="form-control {{css}}" placeholder="{{placeholder}}" value="{{value}}" autocomplete="off"{{#attributes}} {{key}}="{{value}}"{{/attributes}} />{{#icon}}{{#href}}<a id="{{id}}" class="{{css}}" href="{{href}}" {{#attributes}}{{key}}="{{value}}"{{/attributes}}>{{/href}}{{#glyph}}<span class="glyphicon glyphicon-{{glyph}}"></span>{{/glyph}}{{#href}}</a>{{/href}}{{/icon}}{{#wrapper.css}}</div>{{/wrapper.css}}{{/inputs}}{{#areas}}{{#label.text}}<label for="{{id}}" class="control-label {{label.css}}">{{label.text}}</label>{{/label.text}}{{#wrapper.css}}<div class="{{wrapper.css}}">{{/wrapper.css}}<textarea id="{{id}}" class="form-control {{css}}" placeholder="{{placeholder}}" style="{{style}}">{{value}}</textarea>{{#wrapper.css}}</div>{{/wrapper.css}}{{/areas}}{{#selects}}{{#label.text}}<label for="{{id}}" class="control-label {{label.css}}">{{label.text}}</label>{{/label.text}}{{#wrapper.css}}<div class="{{wrapper.css}}">{{/wrapper.css}}<select id="{{id}}" class="form-control {{css}}" placeholder="{{placeholder}}" autocomplete="off"{{#attributes}} {{key}}="{{value}}"{{/attributes}}>{{#values}}<option value="{{value}}">{{text}}</option>{{/values}}</select>{{#wrapper.css}}</div>{{/wrapper.css}}{{/selects}}</div>{{/fields}}{{#buttons}}<div class="actions">{{#forms}}<button type="{{type}}" id="{{id}}" class="btn {{css}}" {{#attributes}}{{key}}="{{value}}"{{/attributes}}>{{text}}</button>{{/forms}}</div>{{/buttons}}{{^fields_only}}</form>{{/fields_only}}{{/objects}}';
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {html:html});
})
(jQuery);
