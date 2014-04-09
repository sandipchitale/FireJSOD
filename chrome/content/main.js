/* See license.txt for terms of usage */

define([
    "firebug/firebug",
    "firebug/lib/trace",
    "firejsod/JSODPanel",
    "firejsod/showjsod"
],
function(Firebug, FBTrace, JSODPanel, ShowJSOD) {

// ********************************************************************************************* //
// The application object

var theApp =
{
    initialize: function()
    {
        Firebug.registerPanel(JSODPanel);
        Firebug.registerUIListener(ShowJSOD);
        Firebug.registerStylesheet("chrome://firejsod/skin/JSOD.css");
    },

    shutdown: function()
    {
        Firebug.unregisterUIListener(ShowJSOD);
        Firebug.unregisterPanel(JSODPanel);
        Firebug.unregisterStylesheet("chrome://firejsod/skin/JSOD.css");
    }
}

// ********************************************************************************************* //

return theApp;

// ********************************************************************************************* //
});
