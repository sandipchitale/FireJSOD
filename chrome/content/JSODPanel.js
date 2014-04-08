/* See license.txt for terms of usage */

define([
    "firebug/lib/lib",
    "firebug/lib/trace",
    "firejsod/svg/jquery-2.1.0.min",
    "firejsod/svg/jquery.svg.min",
    "firejsod/svg/jquery.svganim.min"
],
function(FBL, FBTrace) {

// ********************************************************************************************* //
// Panel Implementation

/**
 * This object represents a main Firebug JSOD panel. There are also toolbar buttons that allows
 * to dynamically append and remove a side panel.
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

    showJSOD: function(object)
    {
        // Log into Firebug's Console panel
        for (var prop in object.value) {
	        Firebug.Console.log(typeof object.value[prop]);
        }
    }
});

// ********************************************************************************************* //

return JSODPanel;

// ********************************************************************************************* //
});