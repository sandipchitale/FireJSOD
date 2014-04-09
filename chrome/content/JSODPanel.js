/* See license.txt for terms of usage */

define([
    "firebug/lib/lib",
    "firebug/lib/trace",
    "firebug/lib/domplate",
    "firejsod/svg/jquery-2.1.0.min",
    "firejsod/svg/jquery.svg.min",
    "firejsod/svg/jquery.svganim.min"
],
function(FBL, FBTrace, Domplate) {

// ********************************************************************************************* //
// Panel Implementation

/**
 * This object represents a main Firebug JSOD panel.
 */
var JSODPanel = function JSODPanel() {};
JSODPanel.prototype = FBL.extend(Firebug.Panel,
{
    name: "jsodpanel",
    title: "JSOD",

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Initialization

    initialize: function()
    {
        Firebug.Panel.initialize.apply(this, arguments);
    },

    destroy: function(state)
    {
        Firebug.Panel.destroy.apply(this, arguments);
    },

    showJSOD: function(value)
    {
        $(this.panelNode).svg(function(svg) {
            var gr = svg.group(gr, 'g', {fontFamily: 'Courier', fontSize: '12'});
            var g = svg.group(gr, 'g', {fontFamily: 'Courier', fontSize: '12'});
            var rect = svg.rect(g, 10, 10, 300, 200,  {fill: 'white', stroke: 'black', strokeWidth: '1'});
        });
    }
});

// ********************************************************************************************* //
// Panel UI (Domplate)
var {domplate, SPAN} = Domplate;

/**
 * Domplate template used to render panel's content. Note that the template uses
 * localized strings and so, Firebug.registerStringBundle for the appropriate
 * locale file must be already executed at this moment.
 */
JSODPanel.prototype.jsodTemplate = domplate(
{
    tag: SPAN(
            'JSOD goes here!'
        ),

    render: function(parentNode)
    {
        this.tag.replace({}, parentNode);
    }
});

// ********************************************************************************************* //

return JSODPanel;

// ********************************************************************************************* //
});