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
        this.createUI();
    },

    destroy: function(state)
    {
        Firebug.Panel.destroy.apply(this, arguments);
    },

    createUI: function() {
        this.jsodTemplate.tag.replace({}, this.panelNode, this.jsodTemplate);
    },

    showJSOD: function(value)
    {
            $("#svg", this.panelNode).svg(function(svg) {
            var g = svg.group(null, 'g', {fontFamily: 'Courier', fontSize: '12'});
            var rect = svg.rect(g, 10, 10, 300, 200,  {fill: 'white', stroke: 'black', strokeWidth: '1'});
        });
    }
});


// ********************************************************************************************* //
// Panel UI (Domplate)
var {domplate, DIV, TABLE, TR, TD, BUTTON, INPUT, SPAN, HR} = Domplate;

/**
 * Domplate template used to render panel's content. Note that the template uses
 * localized strings and so, Firebug.registerStringBundle for the appropriate
 * locale file must be already executed at this moment.
 */
JSODPanel.prototype.jsodTemplate = domplate(
{
    tag:
    DIV(
        TABLE({align: "center"},
            TR({align: "center"},
                TD("&nbsp;"),
                TD("&nbsp;"),
                TD("&nbsp;"),
                TD(BUTTON({id: "NW"}, "\u25E4")),
                TD(BUTTON({id: "N"}, "\u25B2")),
                TD(BUTTON({id: "NE"}, "\u25E5")),
                TD("&nbsp;"),
                TD("&nbsp;"),
                TD("&nbsp;")
            ),
            TR({align: "center"},
                TD(BUTTON({id: "ZO"}, "\uFF0D")),
                TD(INPUT({id: "Z", type: "range", min: "-3", max: "3"})),
                TD(BUTTON({id: "ZI"}, "\uff0b")),
                TD(BUTTON({id: "W"}, "\u25c0")),
                TD(BUTTON({id: "H"}, "\u25A3")),
                TD(BUTTON({id: "E"}, "\u25B6")),
                TD(INPUT({id: "EXPR"})),
                TD(BUTTON({id: "EVAL"}, "=")),
                TD(INPUT({id: "EXPRVAL", readonly: "true"}))
            ),
            TR({align: "center"},
                TD("&nbsp;"),
                TD(SPAN("100%")),
                TD("&nbsp;"),
                TD(BUTTON({id: "SW"}, "\u25E3")),
                TD(BUTTON({id: "S"}, "\u25BC")),
                TD(BUTTON({id: "SE"}, "\u25E2")),
                TD("&nbsp;"),
                TD("&nbsp;"),
                TD("&nbsp;")
            )
        ),
        DIV({id: "svg", style: "padding: 5px; border: 1px solid lightgray; height: 1000px; overflow: hidden;"})
    ),
    render: function(parentNode)
    {
        this.tag.replace({}, parentNode);
    }
});

return JSODPanel;

// ********************************************************************************************* //
});