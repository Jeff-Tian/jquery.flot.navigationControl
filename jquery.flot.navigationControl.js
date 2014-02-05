/* Flot plugin that adds some navigation controls on top of the canvas layer to allow users pan or zoom the graph. This is even more helpful 
    for the touch screen users.

Copyright (c) 2013 http://zizhujy.com.
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

    function init(plot, classes) {
        plot.hooks.draw.push(drawNavigationControl);

        plot.hooks.shutdown.push(shutdown);
    }

    function drawNavigationControl(plot, canvascontext) {
        var options = plot.getOptions();

        var display = options.navigationControl.display || "none";
        
        var control = "<div id='navigation-control' style='width: 0; height: 0; left: " + options.navigationControl.position.left + "; top: " + options.navigationControl.position.top + "; position: absolute; display: " + display + ";'>Control</div>";
        var zoomin = "<div id='zoom-in' style='box-sizing: border-box; position: absolute; left: 29px; top: 0; height: 28px; width: 28px; border: solid 1px #666;  padding: 0; line-height: 28px; border-radius: 5px; cursor: pointer; vertical-align: middle; background-color: #f5f5f5; display: inline-block; text-align: center; -webkit-box-shadow: 0 0 4px rgba(0, 0, 0, 0.15); box-shadow: 0 0 4px rgba(0, 0, 0, 0.15); text-shadow: 1px 1px 5px rgba(100, 100, 100, 0.75);'><div><span class='helper'></span><span class='icon' style='color: #666;'>+</span></div></div>";
        var home = "<div id='zoom-home' style='box-sizing: border-box; position: absolute; left: 29px; top: 58px; height: 28px; width: 28px; border: solid 1px #666;  padding: 0; line-height: 28px; border-radius: 5px; cursor: pointer; vertical-align: middle; background-color: #f5f5f5; display: inline-block; text-align: center; -webkit-box-shadow: 0 0 4px rgba(0, 0, 0, 0.15); box-shadow: 0 0 4px rgba(0, 0, 0, 0.15); text-shadow: 1px 1px 5px rgba(100, 100, 100, 0.75);'><div><span class='helper'></span><span class='icon' style='color: #666;'>⌂</span></div></div>";
        var zoomout = "<div id='zoom-out' style='box-sizing: border-box; position: absolute; left: 29px; top: 116px; height: 28px; width: 28px; border: solid 1px #666;  padding: 0; line-height: 28px; border-radius: 5px; cursor: pointer; vertical-align: middle; background-color: #f5f5f5; display: inline-block; text-align: center; -webkit-box-shadow: 0 0 4px rgba(0, 0, 0, 0.15); box-shadow: 0 0 4px rgba(0, 0, 0, 0.15); text-shadow: 1px 1px 5px rgba(100, 100, 100, 0.75);'><div><span class='helper'></span><span class='icon' style='color: #666;'>-</span></div></div>";

        var panup = "<div id='pan-up' style='box-sizing: border-box; position: absolute; left: 29px; top: 29px; height: 28px; width: 28px; border: solid 1px #666;  padding: 0; line-height: 28px; border-radius: 5px; cursor: pointer; vertical-align: middle; background-color: #f5f5f5; display: inline-block; text-align: center; -webkit-box-shadow: 0 0 4px rgba(0, 0, 0, 0.15); box-shadow: 0 0 4px rgba(0, 0, 0, 0.15); text-shadow: 1px 1px 5px rgba(100, 100, 100, 0.75);'><div><span class='helper'></span><span class='icon' style='color: #666;'>↑</span></div></div>";
        var panright = "<div id='pan-right' style='box-sizing: border-box; position: absolute; left: 58px; top: 58px; height: 28px; width: 28px; border: solid 1px #666;  padding: 0; line-height: 28px; border-radius: 5px; cursor: pointer; vertical-align: middle; background-color: #f5f5f5; display: inline-block; text-align: center; -webkit-box-shadow: 0 0 4px rgba(0, 0, 0, 0.15); box-shadow: 0 0 4px rgba(0, 0, 0, 0.15); text-shadow: 1px 1px 5px rgba(100, 100, 100, 0.75);'><div><span class='helper'></span><span class='icon' style='color: #666;'>→</span></div></div>";
        var pandown = "<div id='pan-down' style='box-sizing: border-box; position: absolute; left: 29px; top: 87px; height: 28px; width: 28px; border: solid 1px #666;  padding: 0; line-height: 28px; border-radius: 5px; cursor: pointer; vertical-align: middle; background-color: #f5f5f5; display: inline-block; text-align: center; -webkit-box-shadow: 0 0 4px rgba(0, 0, 0, 0.15); box-shadow: 0 0 4px rgba(0, 0, 0, 0.15); text-shadow: 1px 1px 5px rgba(100, 100, 100, 0.75);'><div><span class='helper'></span><span class='icon' style='color: #666;'>↓</span></div></div>";
        var panleft = "<div id='pan-left' style='box-sizing: border-box; position: absolute; left: 0; top: 58px; height: 28px; width: 28px; border: solid 1px #666;  padding: 0; line-height: 28px; border-radius: 5px; cursor: pointer; vertical-align: middle; background-color: #f5f5f5; display: inline-block; text-align: center; -webkit-box-shadow: 0 0 4px rgba(0, 0, 0, 0.15); box-shadow: 0 0 4px rgba(0, 0, 0, 0.15); text-shadow: 1px 1px 5px rgba(100, 100, 100, 0.75);'><div><span class='helper'></span><span class='icon' style='color: #666;'>←</span></div></div>";

        var whitebox = ""; // "<div class='navigation-control-placeholder' style='height: 28px; width: 28px; border: solid 1px transparent; margin-bottom: 1px; padding: 0; line-height: 28px; border-radius: 5px; vertical-align: middle; text-shadow: 0 1px 1px rgba(255, 255, 255, 0.75); background-color: transparent; display: inline-block; text-align: center; -webkit-box-shadow: 0 0 4px rgba(0, 0, 0, 0.15); box-shadow: 0 0 4px rgba(0, 0, 0, 0); text-shadow: 1px 1px 5px rgba(100, 100, 100, 0.75);'></div>";

        var $placeholder = plot.getPlaceholder();
        $("#navigation-control").remove();
        $(control).html(whitebox + zoomin + whitebox + whitebox + panup + whitebox + panleft + home + panright + whitebox + pandown + whitebox + whitebox + zoomout + whitebox).appendTo($placeholder);

        $("#navigation-control span.helper").css({
            "display": "inline-block",
            "height": "100%",
            "vertical-align": "middle",
            "position": "relative"
        });

        $placeholder.find("#zoom-in").click(function(){zoomIn(plot);});
        $placeholder.find("#zoom-out").click(function(){zoomOut(plot);});
        $placeholder.find("#zoom-home").click(function(){zoomHome(plot);});

        $placeholder.find("#pan-up").click(function(){panUp(plot);});
        $placeholder.find("#pan-right").click(function(){panRight(plot);});
        $placeholder.find("#pan-down").click(function(){panDown(plot);});
        $placeholder.find("#pan-left").click(function(){panLeft(plot);});
    }

    function shutdown(plot, eventHolder){
        var $placeholder = plot.getPlaceholder();

        $placeholder.find("#zoom-in").unbind("click");
        $placeholder.find("#zoom-out").unbind("click");
        $placeholder.find("#zoom-home").unbind("click");

        $placeholder.find("#pan-up").unbind("click");
        $placeholder.find("#pan-right").unbind("click");
        $placeholder.find("#pan-down").unbind("click");
        $placeholder.find("#pan-left").unbind("click");
    }

    function zoomIn(plot) {
        var axes = plot.getAxes();
        var xaxis = axes.xaxis;
        var yaxis = axes.yaxis;
        var center = plot.p2c({ x: (xaxis.min + xaxis.max) / 2, y: (yaxis.min + yaxis.max) / 2 });
        plot.zoom({ amount: options.navigationControl.zoomAmount, center: center });
    }

    function zoomOut(plot) {
        var axes = plot.getAxes();
        var xaxis = axes.xaxis;
        var yaxis = axes.yaxis;
        var center = plot.p2c({ x: (xaxis.min + xaxis.max) / 2, y: (yaxis.min + yaxis.max) / 2 });
        plot.zoomOut({ amount: options.navigationControl.zoomAmount, center: center });
    }

    function zoomHome(plot){
        var axes = plot.getAxes();
        var xaxis= axes.xaxis;
        var yaxis = axes.yaxis;
        xaxis.options.min = options.navigationControl.homeRange.xmin;
        xaxis.options.max = options.navigationControl.homeRange.xmax;
        yaxis.options.min = options.navigationControl.homeRange.ymin;
        yaxis.options.max = options.navigationControl.homeRange.ymax;

        plot.setupGrid();
        plot.draw();
    }

    function panUp(plot){
        plot.pan({ top: options.navigationControl.panAmount });
    }

    function panRight(plot){
        plot.pan({ left: -options.navigationControl.panAmount });
    }

    function panDown(plot){
        plot.pan({ top: -options.navigationControl.panAmount });
    }

    function panLeft(plot){
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
        version: '1.0'
    });

})(jQuery);
