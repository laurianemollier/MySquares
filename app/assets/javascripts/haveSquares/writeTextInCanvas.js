function scaleCanvas(canvas, ctx){

    devicePixelRatio = window.devicePixelRatio || 1,
    backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
                        ctx.mozBackingStorePixelRatio ||
                        ctx.msBackingStorePixelRatio ||
                        ctx.oBackingStorePixelRatio ||
                        ctx.backingStorePixelRatio || 1,

    ratio = devicePixelRatio / backingStoreRatio;

 // upscale the canvas if the two ratios don't match
    if (devicePixelRatio !== backingStoreRatio) {

        var oldWidth = canvas.width;
        var oldHeight = canvas.height;

        canvas.width = oldWidth * ratio;
        canvas.height = oldHeight * ratio;

        canvas.style.width = oldWidth + 'px';
        canvas.style.height = oldHeight + 'px';

        // now scale the ctx to counter
        // the fact that we've manually scaled
        // our canvas element
        ctx.scale(ratio, ratio);
    }
}

function wrapSentence(context, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';

    var maxTextWidth = 0;

    for(var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + ' ';
      var metrics = context.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        context.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      }
      else {
        line = testLine;
        var metrics = context.measureText(testLine);
        maxTextWidth = Math.max(metrics.width, maxTextWidth);
      }
    }
    context.fillText(line, x, y);

    return maxTextWidth - 9;
}

function wrapText(context, text, x, y, maxWidth, lineHeight, paddingBottomLine){
    var lines = text.split('\n');
    var maxTextWidth = 0;
    for (var i = 0; i < lines.length; i++) {
        var textWidth = wrapSentence(context, lines[i], x, y, maxWidth, lineHeight + paddingBottomLine);
        maxTextWidth = Math.max(textWidth, maxTextWidth);
        y += lineHeight;
    }
    return {y: y - lineHeight - paddingBottomLine, x: maxTextWidth};
}


function writeTextInCanvas(x, y, canvas, ctx, text, colorText, font, lineHeight, colorBackground){

    ctx.beginPath();
    ctx.fillStyle = colorBackground;
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fill();

    ctx.font = lineHeight + "px " + font;
    ctx.fillStyle = colorText;
    var padding = 20;

    if(x == null || y == null){
        x = padding;
        y = padding;
    }

    var textDimensions = wrapText(ctx, text, x, y + lineHeight, canvas.width - 2 * padding, lineHeight, 10);

    return {x: x, y: y, width: textDimensions.x, height: textDimensions.y};
};


function surroundTextColor(ctx, x, y, width, height, color){
    ctx.beginPath();
    ctx.setLineDash([5]);
    ctx.strokeStyle = color;
    ctx.lineWidth="1";
    ctx.rect(x, y, width, height);
    ctx.stroke();
};

function surroundText(ctx, x, y, width, height){
    surroundTextColor(ctx, x, y, width, height, "black");
    surroundTextColor(ctx, x-1, y-1, width+1, height+1, "white");
}




$(function(){

    var text = $('#writeTextTextArea');
    var colorText = $('#iconText');
    var colorBackground = $('#iconBackground');

    var canvas = $('#square-where-we-draw');
    var ctx = canvas.get(0).getContext("2d");
    var writeDiv = $('#writeTextDiv');

    // dimension of the text
    var x = null;
    var y = null;
    var width = null;
    var height = null;

    var drag = false;

    // set the event coordinate relatively to the text. Top-left of the text => (0, 0)
    var xEventText = 0;
    var yEventText = 0;

    canvas.mousedown(function(e){
        if(x != null){
            var coords = this.relMouseCoords(e);
            //if the mouse is inside the canvas
            if(x <= coords.x && coords.x <= x + width && y <= coords.y && coords.y <= y + height){
                //surroundText(ctx, x, y, width, height);
                drag = true;
                xEventText = coords.x - x;
                yEventText = coords.y - y;
            }
        }
    });

    canvas.mousemove(function(e){
        var coords = this.relMouseCoords(e);
        if(drag){
            x = coords.x - xEventText;
            y = coords.y - yEventText;
            writeText();

        //if the mouse is inside the canvas put an other cursor
        }else if(x <= coords.x && coords.x <= x + width && y <= coords.y && coords.y <= y + height){
            canvas.css('cursor', 'move');
        }
        else{
            canvas.css('cursor', 'text');
        }
    });



    canvas.mouseup(function(e){
        if(drag) drag = false;
        else{
        // if we click in the canvas, appears the textArea where we can draw
            writeDiv.show("slow");
            text.focus();

            //selection the button text color
            $('#textColorSelector').click();
        }
    });

    canvas.click(function(e){
        if(!drag){
            // if we click in the canvas, appears the textArea where we can draw
            writeDiv.show("slow");
            text.focus();

            //selection the button text color
            $('#textColorSelector').click();
        }
    });

    // When we click "ok", the text we have entered is written over the canvas
    $('#writeTextButton').click(function(){
        writeDiv.hide("slow");
        var txt = writeText();
        x = txt.x;
        y = txt.y;
        width = txt.width;
        height = txt.height;
        var dataURL = canvas.get(0).toDataURL();
    });

    function writeText(){
        var txt = writeTextInCanvas(x, y, canvas.get(0), ctx, text.val(), colorText.css('color'), "Calibri,Geneva,Arial", 30, colorBackground.css('color'));
        return txt;
    }
});
