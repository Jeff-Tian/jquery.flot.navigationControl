/* Flot plugin that adds some navigation controls on top of the canvas layer to allow users pan or zoom the graph. This is even more helpful 
    for the touch screen users.

Copyright (c) 2013 http://zizhujy.com.
Licensed under the MIT license.

Usage:
Inside the <head></head> area of your html page, add the following line:

<script type="text/javascript" src="http://zizhujy.com/Scripts/flot/jquery.flot.navigationControl.js"></script>

Now you are all set, there will be pan and zooming controls appear on your canvas.

Online examples:
http://zizhujy.com/FunctionGrapher is using it.

Dependencies:
These navigation controls would only work if you have referenced jquery.flot.navigation.js plugin and enabled it already.

Customizations:
    options = {
        homeRange: {xmin:-10,xmax:10,ymin:-10,ymax:10},
        panAmount: 100,
        zoomAmount: 1.5,
        position: {left: "20px", top: "20px"}
    };

To make the control symbols (+, -, ←, ↑, →, ↓, ⌂) more beautiful, you may include your own icon fonts css file, the symbols 
have the css class 'icon' for you to hook.

*/

; (function ($) {

    function init(plot, classes) {
        plot.hooks.draw.push(drawNavigationControl);

        plot.hooks.shutdown.push(shutdown);
    }

    function drawNavigationControl(plot, canvascontext){
        var control = "<div id='navigation-control' style='width: 0; height: 0; left: " + options.position.left + "; top: " + options.position.top + "; position: absolute;'>Control</div>";
        var zoomin = "<div id='zoom-in' style='position: absolute; left: 32px; top: 0; height: 28px; width: 28px; border: solid 1px #666;  padding: 0; line-height: 28px; border-radius: 5px; cursor: pointer; vertical-align: middle; text-shadow: 0 1px 1px rgba(255, 255, 255, 0.75); background-color: #f5f5f5; display: inline-block; text-align: center; -webkit-box-shadow: 0 0 4px rgba(0, 0, 0, 0.15); box-shadow: 0 0 4px rgba(0, 0, 0, 0.15); text-shadow: 1px 1px 5px rgba(100, 100, 100, 0.75);'><div><span class='icon' style='font-size: normal; color: #666;'>+</span></div></div>";
        var home = "<div id='zoom-home' style='position: absolute; left: 32px; top: 64px; height: 28px; width: 28px; border: solid 1px #666;  padding: 0; line-height: 28px; border-radius: 5px; cursor: pointer; vertical-align: middle; text-shadow: 0 1px 1px rgba(255, 255, 255, 0.75); background-color: #f5f5f5; display: inline-block; text-align: center; -webkit-box-shadow: 0 0 4px rgba(0, 0, 0, 0.15); box-shadow: 0 0 4px rgba(0, 0, 0, 0.15); text-shadow: 1px 1px 5px rgba(100, 100, 100, 0.75);'><div><span class='icon' style='font-size: normal; color: #666;'>⌂</span></div></div>";
        var zoomout = "<div id='zoom-out' style='position: absolute; left: 32px; top: 128px; height: 28px; width: 28px; border: solid 1px #666;  padding: 0; line-height: 28px; border-radius: 5px; cursor: pointer; vertical-align: middle; text-shadow: 0 1px 1px rgba(255, 255, 255, 0.75); background-color: #f5f5f5; display: inline-block; text-align: center; -webkit-box-shadow: 0 0 4px rgba(0, 0, 0, 0.15); box-shadow: 0 0 4px rgba(0, 0, 0, 0.15); text-shadow: 1px 1px 5px rgba(100, 100, 100, 0.75);'><div><span class='icon' style='font-size: normal; color: #666;'>-</span></div></div>";

        var panup = "<div id='pan-up' style='position: absolute; left: 32px; top: 32px; height: 28px; width: 28px; border: solid 1px #666;  padding: 0; line-height: 28px; border-radius: 5px; cursor: pointer; vertical-align: middle; text-shadow: 0 1px 1px rgba(255, 255, 255, 0.75); background-color: #f5f5f5; display: inline-block; text-align: center; -webkit-box-shadow: 0 0 4px rgba(0, 0, 0, 0.15); box-shadow: 0 0 4px rgba(0, 0, 0, 0.15); text-shadow: 1px 1px 5px rgba(100, 100, 100, 0.75);'><div><span class='icon' style='font-size: normal; color: #666;'>↑</span></div></div>";
        var panright = "<div id='pan-right' style='position: absolute; left: 64px; top: 64px; height: 28px; width: 28px; border: solid 1px #666;  padding: 0; line-height: 28px; border-radius: 5px; cursor: pointer; vertical-align: middle; text-shadow: 0 1px 1px rgba(255, 255, 255, 0.75); background-color: #f5f5f5; display: inline-block; text-align: center; -webkit-box-shadow: 0 0 4px rgba(0, 0, 0, 0.15); box-shadow: 0 0 4px rgba(0, 0, 0, 0.15); text-shadow: 1px 1px 5px rgba(100, 100, 100, 0.75);'><div><span class='icon' style='font-size: normal; color: #666;'>→</span></div></div>";
        var pandown = "<div id='pan-down' style='position: absolute; left: 32px; top: 96px; height: 28px; width: 28px; border: solid 1px #666;  padding: 0; line-height: 28px; border-radius: 5px; cursor: pointer; vertical-align: middle; text-shadow: 0 1px 1px rgba(255, 255, 255, 0.75); background-color: #f5f5f5; display: inline-block; text-align: center; -webkit-box-shadow: 0 0 4px rgba(0, 0, 0, 0.15); box-shadow: 0 0 4px rgba(0, 0, 0, 0.15); text-shadow: 1px 1px 5px rgba(100, 100, 100, 0.75);'><div><span class='icon' style='font-size: normal; color: #666;'>↓</span></div></div>";
        var panleft = "<div id='pan-left' style='position: absolute; left: 0; top: 64px; height: 28px; width: 28px; border: solid 1px #666;  padding: 0; line-height: 28px; border-radius: 5px; cursor: pointer; vertical-align: middle; text-shadow: 0 1px 1px rgba(255, 255, 255, 0.75); background-color: #f5f5f5; display: inline-block; text-align: center; -webkit-box-shadow: 0 0 4px rgba(0, 0, 0, 0.15); box-shadow: 0 0 4px rgba(0, 0, 0, 0.15); text-shadow: 1px 1px 5px rgba(100, 100, 100, 0.75);'><div><span class='icon' style='font-size: normal; color: #666;'>←</span></div></div>";

        var whitebox = ""; // "<div class='navigation-control-placeholder' style='height: 28px; width: 28px; border: solid 1px transparent; margin-bottom: 1px; padding: 0; line-height: 28px; border-radius: 5px; vertical-align: middle; text-shadow: 0 1px 1px rgba(255, 255, 255, 0.75); background-color: transparent; display: inline-block; text-align: center; -webkit-box-shadow: 0 0 4px rgba(0, 0, 0, 0.15); box-shadow: 0 0 4px rgba(0, 0, 0, 0); text-shadow: 1px 1px 5px rgba(100, 100, 100, 0.75);'></div>";

        var $placeholder = plot.getPlaceholder();
        $("#navigation-control").remove();
        $(control).html(whitebox + zoomin + whitebox + whitebox + panup + whitebox + panleft + home + panright + whitebox + pandown + whitebox + whitebox + zoomout + whitebox).appendTo($placeholder);

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

    function zoomIn(plot){
        var center = plot.p2c({x:0, y:0});
        plot.zoom({amount: options.zoomAmount, center: center});
    }

    function zoomOut(plot){
        var center = plot.p2c({x:0, y:0});
        plot.zoomOut({amount: options.zoomAmount, center: center});
    }

    function zoomHome(plot){
        var axes = plot.getAxes();
        var xaxis= axes.xaxis;
        var yaxis = axes.yaxis;
        xaxis.options.min = options.homeRange.xmin;
        xaxis.options.max = options.homeRange.xmax;
        yaxis.options.min = options.homeRange.ymin;
        yaxis.options.max = options.homeRange.ymax;

        plot.setupGrid();
        plot.draw();
    }

    function panUp(plot){
        plot.pan({top:options.panAmount});
    }

    function panRight(plot){
        plot.pan({left: -options.panAmount});
    }

    function panDown(plot){
        plot.pan({top:-options.panAmount});
    }

    function panLeft(plot){
        plot.pan({left: options.panAmount});
    }

    var options = {
        homeRange: {xmin:-10,xmax:10,ymin:-10,ymax:10},
        panAmount: 100,
        zoomAmount: 1.5,
        position: {left: "20px", top: "20px"}
    };

    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'navigationControl',
        version: '0.1'
    });

})(jQuery);
