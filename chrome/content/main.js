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
    },

    shutdown: function()
    {
        Firebug.unregisterUIListener(ShowJSOD);
        Firebug.unregisterPanel(JSODPanel);
    }
}

// ********************************************************************************************* //

return theApp;

// ********************************************************************************************* //
});
