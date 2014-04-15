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
        this.jsodTemplate.render(this.panelNode);
        var that = this;
        $("#svg", this.panelNode).svg({onLoad: function(svg) {
            svg.style.width = '100%';

            var defs = svg.defs(null, "jsoddefs")
            var arrow = svg.marker(defs, 'arrow', 9, 6, 13, 13);
            var arrowHead = svg.createPath();
            svg.path(arrow, arrowHead.move(2,2).line(2,11).
            line(10, 6).line(2,2).close(), {fill: '#000000'});

            var zoomOutButton = $("#ZO", that.panelNode)[0];
            var zoomRange = $("#ZR", that.panelNode)[0];
            var zoomInButton = $("#ZI", that.panelNode)[0];
            var zoomPercent = $("#ZP", that.panelNode)[0];
            var panNorthWestButton = $("#NW", that.panelNode)[0];
            var panNorthButton = $("#N", that.panelNode)[0];
            var panNorthEastButton = $("#NE", that.panelNode)[0];
            var panWestButton = $("#W", that.panelNode)[0];
            var homeButton = $("#H", that.panelNode)[0];
            var panEastButton = $("#E", that.panelNode)[0];
            var panSouthWestButton = $("#SW", that.panelNode)[0];
            var panSouthButton = $("#S", that.panelNode)[0];
            var panSouthEastButton = $("#SE", that.panelNode)[0];

            var expressionInput = $("#EXPR", that.panelNode)[0];
            var evaluateExpression = $("#EVAL", that.panelNode)[0];
            var resultValue = $("#RESVAL", that.panelNode)[0];

            var zoomlevel = 1.0;

            var ox = 0;
            var oy = 0;

            var panzoom = function() {
                $(svg.root().childNodes[1]).animate({svgTransform:'translate(' + ox + ',' + oy + ') scale(' + zoomlevel + ')'}, 0);
            }

            var zoomPercents = [0.25, 0.50, 0.75, 1.00, 1.25, 1.5, 2.00];
            var zoom = function(level) {
                zoomPercent.textContent = '' + (zoomPercents[parseInt(level)+3] * 100) + '%';
                zoomlevel = zoomPercents[parseInt(level)+3];
                panzoom();
            }

            var zoomIn = function() {
                var zoomedAt = zoomRange.value;
                zoomedAt = Math.min(zoomedAt, 3);
                zoomedAt = Math.max(zoomedAt, -3);
                zoomedAt++;
                zoomedAt = Math.min(zoomedAt, 3);
                zoomedAt = Math.max(zoomedAt, -3);
                zoomRange.value = zoomedAt;
                zoom(zoomRange.value);
            }

            var zoomTo = function() {
                zoom(zoomRange.value);
            }

            var zoomOut = function() {
                var zoomedAt = zoomRange.value;
                zoomedAt = Math.min(zoomedAt, 3);
                zoomedAt = Math.max(zoomedAt, -3);
                zoomedAt--;
                zoomedAt = Math.min(zoomedAt, 3);
                zoomedAt = Math.max(zoomedAt, -3);
                zoomRange.value = zoomedAt;
                zoom(zoomRange.value);
            }

            var pan = function(dx, dy) {
                ox += dx;
                oy += dy;
                panzoom();
            }

            var panNorthWest = function() {
                pan(-100, -100);
            }

            var panNorth = function() {
                pan(0, -100);
            }

            var panNorthEast = function() {
                pan(+100, -100);
            }

            var panWest = function() {
                pan(-100, 0);
            }

            var homeClicked = false;
            var home = function() {
                ox = 0;
                oy = 0;
                if (homeClicked) {
                    homeClicked = false;
                    homeButton.classList.remove('JSOD-home-clicked');
                    zoomRange.value = 0;
                    zoomTo();
                } else {
                    panzoom();
                    homeClicked = true;
                    homeButton.classList.add('JSOD-home-clicked');
                    setTimeout(function() {
                        homeClicked = false;
                        homeButton.classList.remove('JSOD-home-clicked');
                    }, 1000);
                }
            }

            var panEast = function() {
                pan(100, 0);
            }

            var panSouthWest = function() {
                pan(-100, +100);
            }

            var panSouth = function() {
                pan(0, +100);
            }

            var panSouthEast = function() {
                pan(100, +100);
            }

            $(zoomInButton).on('click', zoomIn);
            $(zoomRange).on('change', zoomTo);
            $(zoomOutButton).on('click', zoomOut);

            $(panNorthWestButton).on('click', panNorthWest);
            $(panNorthButton).on('click', panNorth);
            $(panNorthEastButton).on('click', panNorthEast);
            $(panWestButton).on('click', panWest);
            $(homeButton).on('click', home);
            $(panEastButton).on('click', panEast);
            $(panSouthWestButton).on('click', panSouthWest);
            $(panSouthButton).on('click', panSouth);
            $(panSouthEastButton).on('click', panSouthEast);

            var g = svg.group({fontFamily: 'Courier', fontSize: '12'});

            var dragging = false;
            var dragStartX = 0;
            var dragStartY = 0;
            $(svg.root()).on('mousedown', function(e) {
                dragging = true;
                dragStartX = e.clientX;
                dragStartY = e.clientY;
                svg.root().classList.add('JSOD-dragging');
            });
            $(svg.root()).on('mouseup', function(e) {
                if (dragging) {
                    svg.root().classList.remove('JSOD-dragging');
                    pan(e.clientX - dragStartX, e.clientY - dragStartY);
                    dragStartX = 0;
                    dragStartY = 0;
                }
                dragging = false;
            });

            $(svg.root()).on('mousewheel', function(e) {
                var delta = 50;
                if (e.originalEvent.wheelDeltaX === 0) {
                    if (e.originalEvent.wheelDeltaY > 0) {
                        if (e.ctrlKey) {
                            zoomIn();
                            e.preventDefault();
                        } else {
                            pan(0, -delta);
                        }
                        e.stopPropagation();
                    } else if (e.originalEvent.wheelDeltaY < 0) {
                        if (e.ctrlKey) {
                            zoomOut();
                            e.preventDefault();
                        } else {
                            pan(0, delta);
                        }
                        e.stopPropagation();
                    }
                } else {
                    if (e.originalEvent.wheelDeltaX > 0) {
                        pan(-delta, 0);
                        e.stopPropagation();
                    } else if (e.originalEvent.wheelDeltaX < 0) {
                        pan(delta, 0);
                        e.stopPropagation();
                    }
                }
            });

            function clear(g) {
                if (g) {
                    while (g.firstChild) {
                        g.removeChild(g.firstChild);
                    }
                }
            }

            var loadProperty = function(propertyLabel, propetyValue, e) {
                e.stopPropagation();
                e.preventDefault();
                expressionInput.value = '';

                ox = 0;
                oy = 0;
                panzoom();
                zoomRange.value = 0;
                zoomTo();

                clear(g);
                drawGraph(svg, g, propertyLabel, propetyValue);
            }

            function drawJavascriptObject(svg, gr, valueLabel, value, ox, oy, boxWidth, boxHeight) {
                function functionName(functionString) {
                    // try {
                        // return /^function\s*(([_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*)?\([^)]*\))\s*/.exec('' + functionString)[1];
                    // } catch(e) {
                        return functionString.substring(0, 30);
                    // }
                }

                function doDrawJavascriptObjectProperties(x, y, borderColor, value) {
                    var props = [];
                    var g = svg.group(gr, 'g', {fontFamily: 'Courier', fontSize: '12'});

                    var tooltip;

                    function compareText(a, b) {
                        return a.text.localeCompare(b.text);
                    }
                    for(var prop in value) {
                        //if (!value.hasOwnProperty(prop)) {
                        //    continue;
                        //}
                        try {
                            var propName = prop;
                            var propValue = value[prop];
                            // Skip __proto__ as we already rendered it above
                            if ('__proto__' == propName) {
                                continue;
                            }

                            if (propValue) {
                                if ((typeof propValue) === 'function') {
                                    continue;
                                } else if ((typeof propValue) === 'object') {
                                    props.push({text:propName + 'O', value: propValue});
                                } else if ((typeof propValue) === 'number') {
                                    props.push({text:propName + ' : ' + propValue + '#', value: propValue});
                                } else if ((typeof propValue) === 'string') {
                                    props.push({text:propName + ' : \'' + propValue.substring(0,36) + '\'S', value: propValue});
                                } else {
                                    props.push({text:propName + ' : ' + propValue + ((typeof propValue) === 'boolean' ? 'B' : '-'), value: propValue});
                                }
                            }
                        } catch (e) {
                        }
                    }
                    props.sort(compareText);

                    var funcs = [];
                    for(var prop in value) {
                        // if (!value.hasOwnProperty(prop)) {
                            // continue;
                        // }
                        try {
                            var propName = prop;
                            var propValue = value[prop];

                            if (propValue) {
                                if ((typeof propValue) === 'function') {
                                    funcs.push({text:propName + '()F', value: (propValue.name || propValue)});
                                }
                            }
                        } catch (e) {
                            // ignore
                        }
                    }
                    funcs.sort(compareText);

                    props = props.concat(funcs);

                    for(var i = 0; i < props.length; i++) {
                        y += boxHeight;
                        var text = props[i].text;
                        var type = text.substring(text.length - 1);
                        text = text.substring(0, text.length - 1);
                        var propertyLabel = text;
                        var propetyValue = props[i].value;
                        tooltip = text;
                        if (type == 'O' || type === 'A' || type === 'F' || type === 'N') {
                        } else {
                            text = text.substring(0, text.indexOf(' : ') + 30);
                        }
                        var rect = svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: borderColor, strokeWidth: '1'});
                        svg.title(rect, tooltip);
                        svg.text(g, x+20, y+16, text, {fill: 'black'});

                        if (type === 'A') {
                            svg.text(g, x+5, y+15, '[]', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                        } else if (type === 'O') {
                            svg.text(g, x+7, y+16, 'o', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                        } else if (type === 'S') {
                            svg.text(g, x+5, y+15, '\'\'', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                        } else if (type === 'F') {
                            svg.text(g, x+5, y+15, 'fx', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                        } else if (type === 'B') {
                            svg.text(g, x+4, y+15, '0|1', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                        } else if (type === '#') {
                            svg.text(g, x+7, y+15, '#', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                        } else if (type === '-') {
                            svg.text(g, x+6, y+15, '-', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                        } else if (type === 'N') {
                        }
                        if (type === 'O' || type === 'A' || type === 'F') {
                            var loadButton = svg.rect(g, x+boxWidth-20, y+(boxHeight/2)-8, 16, 16, {fill: 'WhiteSmoke', stroke: 'lightgray', strokeWidth: '1'});
                            $(loadButton).on('click', loadProperty.bind(this, propertyLabel, propetyValue));
                            var loadButtonText = svg.text(g, x+boxWidth-15, y+(boxHeight/2)+4, '=',{stroke: 'lightgray', strokeWidth: '1'});
                            $(loadButtonText).on('click', loadProperty.bind(this, propertyLabel, propetyValue));
                        }
                    }
                }

                function doDrawJavascriptObject(ox, oy, value, hasConstructorAsOwnProperty, __proto__Object, __proto____proto__Object) {
                    var x = ox;
                    var y = oy;
                    // Normal object i.e. not a prototype like
                    // i.e. does not have constructor as it's own property
                    if (!hasConstructorAsOwnProperty) {

                        svg.line(g, x-(boxWidth/4), y+12, x, y+12,  {stroke: 'black', markerEnd: 'url(#arrow)'});
                        svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: 'black', strokeWidth: '2'});

                        if ($.isArray(value)) {
                            svg.text(g, x+5, y+16, '[]', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                            svg.text(g, x+20, y+16, valueLabel + ' : ' + value, {fill: 'black', fontWeight: 'bold'});
                        } else if ((typeof value) == 'function') {
                            svg.text(g, x+5, y+16, 'fx', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                            svg.text(g, x+20, y+16, valueLabel + ' : ' + (value.name || functionName(Object.prototype.toString.call(value))), {fill: 'black', fontWeight: 'bold'});
                        } else {
                            svg.text(g, x+7, y+16, 'o', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                            if (value.constructor && value.constructor.name) {
                                svg.text(g, x+20, y+16, valueLabel + ' : ' + value.constructor.name, {fill: 'black', fontWeight: 'bold'});
                            } else {
                                svg.text(g, x+20, y+16, valueLabel + ' : ' + '{}', {fill: 'black', fontWeight: 'bold'});
                            }
                        }

                        if (__proto__Object) {
                            y += boxHeight;
                            svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'WhiteSmoke', stroke: 'black'});
                            svg.text(g, x+5, y+16, 'fx', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                            svg.text(g, x+20, y+16, 'constructor : ' + (value.constructor.name || ''), {fill: 'lightGray'});
                            if (value.constructor) {
                                var cfr1 = svg.line(g, x+boxWidth, y+12, x+boxWidth+(boxWidth/4), y+12,  {stroke: 'lightGray'});
                                svg.title(cfr1, 'Reference to Constructor function via inherited constructor property.');

                                var loadButton = svg.rect(g, x+boxWidth-20, y+(boxHeight/2)-8, 16, 16, {fill: 'WhiteSmoke', stroke: 'lightgray', strokeWidth: '1'});
                                $(loadButton).on('click', loadProperty.bind(this, value.constructor.name || 'constructor', value.constructor));
                                var loadButtonText = svg.text(g, x+boxWidth-15, y+(boxHeight/2)+4, '=',{stroke: 'lightgray', strokeWidth: '1'});
                                $(loadButtonText).on('click', loadProperty.bind(this, value.constructor.name || 'constructor', value.constructor));
                            }

                            y += boxHeight;
                            svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: 'black'});
                            svg.text(g, x+7, y+16, 'o', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                            svg.text(g, x+20, y+16, '__proto__', {fill: 'black'});
                            if (__proto__Object) {
                                var pr = svg.line(g, x+boxWidth, y+12, x+(boxWidth+(boxWidth/4)), y+12,  {stroke: 'black', markerEnd: 'url(#arrow)'});
                                svg.title(pr, 'Hidden reference to prototype object.');
                                var loadButton = svg.rect(g, x+boxWidth-20, y+(boxHeight/2)-8, 16, 16, {fill: 'WhiteSmoke', stroke: 'lightgray', strokeWidth: '1'});
                                $(loadButton).on('click', loadProperty.bind(this, '__proto__', __proto__Object));
                                var loadButtonText = svg.text(g, x+boxWidth-15, y+(boxHeight/2)+4, '=',{stroke: 'lightgray', strokeWidth: '1'});
                                $(loadButtonText).on('click', loadProperty.bind(this, '__proto__', __proto__Object));
                            }
                        }

                        doDrawJavascriptObjectProperties(x, y, 'black', value);
                    }

                    if (!hasConstructorAsOwnProperty  && !__proto__Object ) {
                        return;
                    }

                    // prototype object
                    if (hasConstructorAsOwnProperty) {
                        x = ox;
                        y = oy + 2*boxHeight;
                    } else {
                        x = ox+boxWidth+boxWidth/4;
                        y = oy + 2*boxHeight;
                    }

                    if (hasConstructorAsOwnProperty) {
                        var tp = svg.line(g, x-(boxWidth/4), y+12-(2*boxHeight), x-(boxWidth/8), y+12-(2*boxHeight), {stroke: 'black'});
                        var tp = svg.line(g, x-(boxWidth/8), y+12-(2*boxHeight), x, y+12,  {stroke: 'black', markerEnd: 'url(#arrow)'});
                    }
                    svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: 'gray', strokeWidth: '2'});
                    svg.text(g, x+6, y+15, 'o', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                    if (__proto__Object.__proto__ && __proto__Object.__proto__.constructor && __proto__Object.__proto__.constructor.name) {
                        svg.text(g, x+20, y+16, '{} : ' + __proto__Object.__proto__.constructor.name, {fill: 'black', fontWeight: 'bold'});
                    } else {
                        svg.text(g, x+20, y+16, '{} : ' + __proto__Object, {fill: 'black', fontWeight: 'bold'});
                    }

                    if (value.constructor) {
                        var c2pr = svg.line(g, x+(boxWidth+(boxWidth/4)), y+12, x+boxWidth, y+12, {stroke: 'black', markerEnd: 'url(#arrow)'});
                        svg.title(c2pr, 'Reference to prototype object from Constructor function.');

                        y -= boxHeight;

                        svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: 'gray'});
                        svg.text(g, x+5, y+15, 'fx', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                        svg.text(g, x+20, y+16, 'constructor', {fill: 'black'});
                        var p2cr = svg.line(g, x+boxWidth, y+12, x+(boxWidth+(boxWidth/4)), y+12,  {stroke: 'black', markerEnd: 'url(#arrow)'});
                        svg.title(p2cr, 'Reference to Constructor function.');

                        var loadButton = svg.rect(g, x+boxWidth-20, y+(boxHeight/2)-8, 16, 16, {fill: 'WhiteSmoke', stroke: 'lightgray', strokeWidth: '1'});
                        $(loadButton).on('click', loadProperty.bind(this, value.constructor.name || 'constructor', value.constructor));
                        var loadButtonText = svg.text(g, x+boxWidth-15, y+(boxHeight/2)+4, '=',{stroke: 'lightgray', strokeWidth: '1'});
                        $(loadButtonText).on('click', loadProperty.bind(this, value.constructor.name || 'constructor', value.constructor));

                        y += boxHeight;
                    }

                    y += boxHeight;
                    svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: 'gray'});
                    svg.text(g, x+7, y+16, 'o', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                    if (__proto____proto__Object) {
                        svg.text(g, x+20, y+16, '__proto__', {fill: 'black'});
                        var ppr = svg.line(g, x+boxWidth, y+12, x+(boxWidth*2.25), y+12,  {stroke: 'black'});
                        svg.title(ppr, 'Hidden reference to prototype object.');

                        var loadButton = svg.rect(g, x+boxWidth-20, y+(boxHeight/2)-8, 16, 16, {fill: 'WhiteSmoke', stroke: 'lightgray', strokeWidth: '1'});
                        $(loadButton).on('click', loadProperty.bind(this, '__proto__', __proto____proto__Object));
                        var loadButtonText = svg.text(g, x+boxWidth-15, y+(boxHeight/2)+4, '=',{stroke: 'lightgray', strokeWidth: '1'});
                        $(loadButtonText).on('click', loadProperty.bind(this, '__proto__', __proto____proto__Object));
                    } else {
                        svg.text(g, x+20, y+16, '__proto__', {fill: 'red'});
                        svg.line(g, x+boxWidth, y+12, x+(boxWidth+(boxWidth/8)), y+12,  {stroke: 'black'});
                        svg.line(g, x+(boxWidth+(boxWidth/8)), y+3, x+(boxWidth+(boxWidth/8)), y+21,  {stroke: 'black'});
                        svg.line(g, x+(boxWidth+(boxWidth/8))+3, y+6, x+(boxWidth+(boxWidth/8))+3, y+18,  {stroke: 'black'});
                        svg.line(g, x+(boxWidth+(boxWidth/8))+6, y+9, x+(boxWidth+(boxWidth/8))+6, y+15,  {stroke: 'black'});
                    }

                    if (hasConstructorAsOwnProperty) {
                        doDrawJavascriptObjectProperties(x, y, 'gray', value);
                    } else {
                        doDrawJavascriptObjectProperties(x, y, 'gray', __proto__Object);
                    }

                    if (hasConstructorAsOwnProperty) {
                        x = ox+boxWidth+boxWidth/4;
                        y = oy;
                    } else {
                        x = ox+boxWidth+boxWidth/4+boxWidth+boxWidth/4;
                        y = oy;
                    }

                    if (value.constructor) {
                        y += boxHeight;
                        svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: 'lightGray', strokeWidth: '2'});
                        svg.text(g, x+5, y+16, 'fx', {fill: 'white', fontSize: '9', fontWeight: 'bold'});
                        svg.text(g, x+20, y+16, value.constructor.name || functionName(Object.prototype.toString.call(value.constructor)), {fill: 'black', fontWeight: 'bold'});
                        y += boxHeight;
                        svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: 'lightGray'});
                        svg.text(g, x+20, y+16, 'prototype', {fill: 'black'});
                        svg.text(g, x+7, y+16, 'o', {fill: 'black', fontSize: '9', fontWeight: 'bold'});

                        doDrawJavascriptObjectProperties(x, y, 'lightGray', value.constructor);
                    }
                }

                // This functions determines if this is a regular object or a function prototype
                // and drwas it accordingly
                function drawJavascriptObjectOrPrototypeObject(ox, oy, valueLabel, value)
                {
                    var hasConstructorAsOwnProperty = false;
                    var constructorObject;
                    var __proto__Object;

                    if (value.hasOwnProperty('constructor')) {
                        hasConstructorAsOwnProperty = true;
                    }
                    if (value.__proto__) {
                        __proto__Object = value.__proto__;
                    }

                    // Is the value a prototype object
                    if (hasConstructorAsOwnProperty) {
                        // the value is really the __proto__Object
                        doDrawJavascriptObject(ox, oy, value, hasConstructorAsOwnProperty, /*__proto__Object */ value, /*__proto____proto__Object*/ __proto__Object);
                        // __proto__Object is really the __proto____proto__Object for the next level, so also draw the next level
                        if (__proto__Object) {
                            ox += 800;
                            oy += 72;
                            // Next vertical block - recursion
                            drawJavascriptObject(svg, gr, '{}', __proto__Object, ox, oy, boxWidth, boxHeight);
                        }
                        return;
                    }

                    var __proto____proto__Object;
                    function get__proto____proto__Object(ox, oy, __proto__Object) {
                        if (__proto__Object.hasOwnProperty('constructor')) {
                             constructorObject = __proto__Object.constructor;
                        }
                        if (__proto__Object.__proto__) {
                            __proto____proto__Object = __proto__Object.__proto__;
                        }
                        doDrawJavascriptObject(ox, oy, value, hasConstructorAsOwnProperty, __proto__Object, __proto____proto__Object);
                        // Recurse
                        if (__proto____proto__Object) {
                            // Initially just use the passed in name as label
                            if (hasConstructorAsOwnProperty) {
                                ox += 800;
                            } else {
                                ox += 1200;
                            }
                            oy += 72;
                            // Next vertical block - recursion
                            drawJavascriptObject(svg, gr, '{}', __proto____proto__Object, ox, oy, boxWidth, boxHeight);
                        }
                    }
                    if (__proto__Object) {
                        (get__proto____proto__Object.bind(this, ox, oy))(__proto__Object);
                    } else {
                        doDrawJavascriptObject(ox, oy, value, false);
                    }
                }
                (drawJavascriptObjectOrPrototypeObject.bind(this, ox, oy))(valueLabel, value);
            }

            function drawGraph(svg, gr, valueLabel, value) {
                if (value) {
                    clear(gr);
                    var boxWidth = 320;
                    var boxHeight = 24;
                    var x = boxWidth/4;
                    var y = boxHeight;
                    drawJavascriptObject(svg, gr, valueLabel, value, x, y, boxWidth, boxHeight);
                }
            }

            that.showJSOD = function(value) {
                var valueLabel = '{}';
                if ($.isArray(value)) {
                    valueLabel = '[]';
                } else if ((typeof value) === 'function') {
                    valueLabel = value.name || '()';
                }
                expressionInput.value = valueLabel;
                if (((typeof value) === 'object') || ((typeof value) === 'function')) {
                    drawGraph(svg, g, valueLabel, value);
                } else {
                    resultValue.value = '' + value;
                }
            }
        },
        settings: {
            width: '100%',
            height: '100%'
        }});
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
                TD(INPUT({id: "ZR", type: "range", min: "-3", max: "3"})),
                TD(BUTTON({id: "ZI"}, "\uff0b")),
                TD(BUTTON({id: "W"}, "\u25c0")),
                TD(BUTTON({id: "H"}, "\u25A3")),
                TD(BUTTON({id: "E"}, "\u25B6")),
                TD(INPUT({id: "EXPR"})),
                TD(BUTTON({id: "EVAL"}, "=")),
                TD(INPUT({id: "RESVAL", readonly: "true"}))
            ),
            TR({align: "center"},
                TD("&nbsp;"),
                TD(SPAN({id: "ZP"}, "100%")),
                TD("&nbsp;"),
                TD(BUTTON({id: "SW"}, "\u25E3")),
                TD(BUTTON({id: "S"}, "\u25BC")),
                TD(BUTTON({id: "SE"}, "\u25E2")),
                TD("&nbsp;"),
                TD("&nbsp;"),
                TD("&nbsp;")
            )

        ),
        DIV({id: "svg", style: "padding: 5px; overflow: hidden; bottom: 0; width: 100%; height: 800px;"})
    ),
    render: function(parentNode)
    {
        this.tag.replace({}, parentNode, this);
    }
});

return JSODPanel;

// ********************************************************************************************* //
});