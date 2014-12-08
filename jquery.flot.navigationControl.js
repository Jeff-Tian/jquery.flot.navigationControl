/* Flot plugin that adds some navigation controls on top of the canvas layer to allow users pan or zoom the graph. This is even more helpful 
    for the touch screen users.

Copyright (c) 2013 - 2014 http://zizhujy.com.
Licensed under the MIT license.

Usage:
Inside the <head></head> area of your html page, add the following line:

<script type="text/javascript" src="http://zizhujy.com/Scripts/flot/navigationControl/jquery.flot.navigationControl.js"></script>

Now you are all set, there will be pan and zooming controls appear on your canvas.

Online examples:
http://zizhujy.com/FunctionGrapher is using it.

Dependencies:
These navigation controls would only work if you have referenced jquery.flot.navigation.js plugin and enabled it already.

Customizations:
    options = {
            navigationControl: {
            homeRange: {xmin:-10,xmax:10,ymin:-10,ymax:10},
            panAmount: 100,
            zoomAmount: 1.5,
            position: {left: "20px", top: "20px"}
        }
    };

To make the control symbols (+, -, ←, ↑, →, ↓, ⌂) more beautiful, you may include your own icon fonts css file, the symbols 
have the css class 'icon' for you to hook.

*/

; (function ($) {
    String.prototype.format = function () {
        if (arguments.length <= 0) {
            return this;
        } else {
            var format = this;
            var args = arguments;

            var s = format.replace(/(?:[^{]|^|\b|)(?:{{)*(?:{(\d+)}){1}(?:}})*(?=[^}]|$|\b)/g, function (match, number) {
                number = parseInt(number);

                return typeof args[number] != "undefined" ? match.replace(/{\d+}/g, args[number]) : match;
            });

            return s.replace(/{{/g, "{").replace(/}}/g, "}");
        }
    };

    function init(plot, classes) {
        plot.hooks.draw.push(drawNavigationControl);

        plot.hooks.shutdown.push(shutdown);
    }

    function drawNavigationControl(plot, canvascontext) {
        var options = plot.getOptions();

        var display = options.navigationControl.display || "none";

        var control = "<div class='navigation-control' style='width: 0; height: 0; left: " + options.navigationControl.position.left + "; top: " + options.navigationControl.position.top + "; position: absolute; display: " + display + ";'>Control</div>";

        var buttonTemplate = "<div class='{0}' style='box-sizing: border-box; position: absolute; left: {1}; top: {2}; height: 28px; width: 28px; border: solid 1px #666; padding: 0; line-height: 28px; border-radius: 5px; cursor: pointer; background-color: #f5f5f5; display: inline-block; text-align: center; -webkit-box-shadow: 0 0 4px rgba(0, 0, 0, 0.15); box-shadow: 0 0 4px rgba(0, 0, 0, 0.15); text-shadow: 1px 1px 5px rgba(100, 100, 100, 0.75);'><div><span class='icon' style='color: #666; vertical-align: baseline;{4}'>{3}</span></div></div>";

        var horizontalZoomin = buttonTemplate.format('zoom-in-horizontal', '0', '0', '&#x2194;', ' font-size: larger!important;');
        var zoomin = buttonTemplate.format('zoom-in', '29px', '0', '+', '');
        var verticalZoomin = buttonTemplate.format('zoom-in-vertical', '58px', '0', '&#x2195;', ' font-size: larger!important;');

        var home = buttonTemplate.format('zoom-home', '29px', '58px', '⌂', '');

        var horizontalZoomout = buttonTemplate.format('zoom-out-horizontal', '0', '116px', '&#x2194;', ' font-size: larger!important;');
        var zoomout = buttonTemplate.format('zoom-out', '29px', '116px', '-', '');
        var verticalZoomout = buttonTemplate.format('zoom-out-vertical', '58px', '116px', '&#x2195;', ' font-size: larger!important;');

        var panup = buttonTemplate.format('pan-up', '29px', '29px', '↑', '');

        var panright = buttonTemplate.format('pan-right', '58px', '58px', '→', '');

        var pandown = buttonTemplate.format('pan-down', '29px', '87px', '↓', '');

        var panleft = buttonTemplate.format('pan-left', '0', '58px', '←', '');

        var whitebox = ""; // "<div class='navigation-control-placeholder' style='height: 28px; width: 28px; border: solid 1px transparent; margin-bottom: 1px; padding: 0; line-height: 28px; border-radius: 5px; vertical-align: middle; text-shadow: 0 1px 1px rgba(255, 255, 255, 0.75); background-color: transparent; display: inline-block; text-align: center; -webkit-box-shadow: 0 0 4px rgba(0, 0, 0, 0.15); box-shadow: 0 0 4px rgba(0, 0, 0, 0); text-shadow: 1px 1px 5px rgba(100, 100, 100, 0.75);'></div>";

        var $placeholder = plot.getPlaceholder();
        $placeholder.find(".navigation-control").remove();
        
        $(control).html(horizontalZoomin + zoomin + verticalZoomin + whitebox + panup + whitebox + panleft + home + panright + whitebox + pandown + whitebox + horizontalZoomout + zoomout + verticalZoomout).appendTo($placeholder);

        $placeholder.find(".zoom-in-horizontal").click(function () { zoomIn(plot, 'xaxis', 'yaxis'); });
        $placeholder.find(".zoom-in").click(function () { zoomIn(plot); });
        $placeholder.find(".zoom-in-vertical").click(function () { zoomIn(plot, 'yaxis', 'xaxis'); });
        $placeholder.find('.zoom-out-horizontal').click(function () { zoomOut(plot, 'xaxis', 'yaxis'); });
        $placeholder.find(".zoom-out").click(function () { zoomOut(plot); });
        $placeholder.find('.zoom-out-vertical').click(function() { zoomOut(plot, 'yaxis', 'xaxis'); });
        $placeholder.find(".zoom-home").click(function () { zoomHome(plot); });

        $placeholder.find(".pan-up").click(function () { panUp(plot); });
        $placeholder.find(".pan-right").click(function () { panRight(plot); });
        $placeholder.find(".pan-down").click(function () { panDown(plot); });
        $placeholder.find(".pan-left").click(function () { panLeft(plot); });
    }

    function shutdown(plot, eventHolder) {
        var $placeholder = plot.getPlaceholder();

        $placeholder.find(".zoom-in-horizontal").unbind("click");
        $placeholder.find(".zoom-in").unbind("click");
        $placeholder.find(".zoom-in-vertical").unbind("click");
        $placeholder.find('.zoom-out-horizontal').unbind('click');
        $placeholder.find(".zoom-out").unbind("click");
        $placeholder.find('.zoom-out-vertical').unbind('click');
        $placeholder.find(".zoom-home").unbind("click");

        $placeholder.find(".pan-up").unbind("click");
        $placeholder.find(".pan-right").unbind("click");
        $placeholder.find(".pan-down").unbind("click");
        $placeholder.find(".pan-left").unbind("click");
    }

    var m_originalRatioXY = false;

    function zoomIn(plot, zoomAxis, notZoomAxis) {
        var axes = plot.getAxes();
        var xaxis = axes.xaxis;
        var yaxis = axes.yaxis;
        var center = plot.p2c({ x: (xaxis.min + xaxis.max) / 2, y: (yaxis.min + yaxis.max) / 2 });

        var originalZoomRange = null;

        if (notZoomAxis) {
            originalZoomRange = plot.getAxes()[notZoomAxis].options.zoomRange;
            plot.getAxes()[notZoomAxis].options.zoomRange = false;
            if (plot.getOptions().coordinate && plot.getOptions().coordinate.ratioXY) {
                m_originalRatioXY = plot.getOptions().coordinate.ratioXY;
                plot.getOptions().coordinate.ratioXY = false;
            }
        }

        //console.log('before zoom');
        $.each(plot.getAxes(), function (_, axis) {
            //console.log('axis: {0}, axis.min: {1}, axis.max: {2}, axis.options.min: {3}, axis.options.max: {4}.'
            //    .format(_, axis.min, axis.max, axis.options.min, axis.options.max));

            axis.options.min = axis.min;
            axis.options.max = axis.max;

            //console.log('axis: {0}, axis.min: {1}, axis.max: {2}, axis.options.min: {3}, axis.options.max: {4}.'
            //    .format(_, axis.min, axis.max, axis.options.min, axis.options.max));
        });

        plot.zoom({ amount: options.navigationControl.zoomAmount, center: center });

        //console.log('after zoom');
        if (notZoomAxis) {
            plot.getAxes()[notZoomAxis].options.zoomRange = originalZoomRange;

            //$.each(plot.getAxes(), function (_, axis) {
            //    console.log('axis: {0}, axis.min: {1}, axis.max: {2}, axis.options.min: {3}, axis.options.max: {4}.'
            //        .format(_, axis.min, axis.max, axis.options.min, axis.options.max));

            //    axis.options.min = axis.min;
            //    axis.options.max = axis.max;

            //    console.log('axis: {0}, axis.min: {1}, axis.max: {2}, axis.options.min: {3}, axis.options.max: {4}.'
            //        .format(_, axis.min, axis.max, axis.options.min, axis.options.max));
            //});
        }
    }

    function zoomOut(plot, zoomAxis, notZoomAxis) {
        var axes = plot.getAxes();
        var xaxis = axes.xaxis;
        var yaxis = axes.yaxis;
        var center = plot.p2c({ x: (xaxis.min + xaxis.max) / 2, y: (yaxis.min + yaxis.max) / 2 });
        var originalZoomRange = null;

        if (notZoomAxis) {
            originalZoomRange = plot.getAxes()[notZoomAxis].options.zoomRange;
            plot.getAxes()[notZoomAxis].options.zoomRange = false;
            if (plot.getOptions().coordinate && plot.getOptions().coordinate.ratioXY) {
                m_originalRatioXY = plot.getOptions().coordinate.ratioXY;
                plot.getOptions().coordinate.ratioXY = false;
            }
        }

        //console.log('before zoom');
        $.each(plot.getAxes(), function (_, axis) {
            //console.log('axis: {0}, axis.min: {1}, axis.max: {2}, axis.options.min: {3}, axis.options.max: {4}.'
            //    .format(_, axis.min, axis.max, axis.options.min, axis.options.max));

            axis.options.min = axis.min;
            axis.options.max = axis.max;

            //console.log('axis: {0}, axis.min: {1}, axis.max: {2}, axis.options.min: {3}, axis.options.max: {4}.'
            //    .format(_, axis.min, axis.max, axis.options.min, axis.options.max));
        });
        plot.zoomOut({ amount: options.navigationControl.zoomAmount, center: center });
        //console.log('after zoom');
        if (notZoomAxis) {
            plot.getAxes()[notZoomAxis].options.zoomRange = originalZoomRange;

            //$.each(plot.getAxes(), function (_, axis) {
            //    console.log('axis: {0}, axis.min: {1}, axis.max: {2}, axis.options.min: {3}, axis.options.max: {4}.'
            //        .format(_, axis.min, axis.max, axis.options.min, axis.options.max));

            //    axis.options.min = axis.min;
            //    axis.options.max = axis.max;

            //    console.log('axis: {0}, axis.min: {1}, axis.max: {2}, axis.options.min: {3}, axis.options.max: {4}.'
            //        .format(_, axis.min, axis.max, axis.options.min, axis.options.max));
            //});
        }
    }

    function zoomHome(plot) {
        var options = plot.getOptions();

        var axes = plot.getAxes();
        var xaxis = axes.xaxis;
        var yaxis = axes.yaxis;
        xaxis.options.min = options.navigationControl.homeRange.xmin;
        xaxis.options.max = options.navigationControl.homeRange.xmax;
        yaxis.options.min = options.navigationControl.homeRange.ymin;
        yaxis.options.max = options.navigationControl.homeRange.ymax;

        if (plot.getOptions().coordinate && m_originalRatioXY) {
            plot.getOptions().coordinate.ratioXY = m_originalRatioXY;
        }

        plot.setupGrid();
        plot.draw();
    }

    function panUp(plot) {
        plot.pan({ top: options.navigationControl.panAmount });
    }

    function panRight(plot) {
        plot.pan({ left: -options.navigationControl.panAmount });
    }

    function panDown(plot) {
        plot.pan({ top: -options.navigationControl.panAmount });
    }

    function panLeft(plot) {
        plot.pan({ left: options.navigationControl.panAmount });
    }

    var options = {
        navigationControl: {
            homeRange: { xmin: -10, xmax: 10, ymin: -10, ymax: 10 },
            panAmount: 100,
            zoomAmount: 1.5,
            position: { left: "20px", top: "45px" }
        }
    };

    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'navigationControl',
        version: '1.4'
    });

})(jQuery);
