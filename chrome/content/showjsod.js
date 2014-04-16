/* See license.txt for terms of usage */

define([
    "firebug/firebug",
    "firebug/lib/trace",
],
function(Firebug, FBTrace) {

// ********************************************************************************************* //
// Implementation

/**
 * This object represents Firebug UI listener. It's registered within the main.js
 * module using Firebug.registerUIListener() method.
 */
var ShowJSOD =
/** @lends ShowJSOD **/
{
    /**
     * Extends HTML Panel context menu. In order to see the menu items in action
     * right click at a node in the HTML panel and pick any of the "My Menu Item *"
     * from the context menu.
     */
    onContextMenu: function(items, object, target, context, panel, popup)
    {
        if (object == null || object == undefined  /* || panel.name != "watches" */)
            return;

        items.push("-");

        // Simple menu item
        var item1 = {
            id: "jsod",
            label : "JavaScript object diagram",
            command: this.onShowJSOD.bind(this, object)
        };

        items.push(item1);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Commands

    onShowJSOD: function(object)
    {
    	var jsodPanel =Firebug.chrome.selectPanel("jsodpanel");
    	jsodPanel.showJSOD(object);
    }
};

// ********************************************************************************************* //

return ShowJSOD;

// ********************************************************************************************* //
});
