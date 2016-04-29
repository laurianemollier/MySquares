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
      }
    }
    context.fillText(line, x, y);
}

function wrapText(context, text, x, y, maxWidth, lineHeight){
    var lines = text.split('\n');
    for (var i = 0; i < lines.length; i++) {
        wrapSentence(context, lines[i], x, y, maxWidth, lineHeight);
        y += lineHeight;
    }
    return y - lineHeight;
}


function writeTextInCanvas(canvas, ctx, text, colorText, font, lineHeight, colorBackground){

    ctx.beginPath();
    ctx.fillStyle = colorBackground;
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fill();

    ctx.font = lineHeight + "px " + font;
    ctx.fillStyle = colorText;
    var padding = 20;

    var x = padding;
    var y = padding;
    var textWidth = canvas.width - 2 * padding;
    var textHeight = wrapText(ctx, text, x, y + lineHeight, textWidth, lineHeight + 10);

    return {x: x, y: y, width: textWidth, height: textHeight};
};


function surroundText(ctx, x, y, width, height){
    ctx.beginPath();
    ctx.setLineDash([5]);
    ctx.strokeStyle = "black";
    ctx.lineWidth="2";
    ctx.rect(x, y, width, height);
    ctx.stroke();
};


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

    // if we click in the canvas, appears the textArea where we can draw
    canvas.click(function(){
        writeDiv.show("slow");
        text.focus();

        //selection the button text color
        $('#textColorSelector').click();
    });

    canvas.mousedown(function(e){
        if(x != null){
            var coords = this.relMouseCoords(e);
            //if the mouse is inside the canvas
            if(x <= coords.x && coords.x <= x + width && y <= coords.y && coords.y <= y + height){
                surroundText(ctx, x, y, width, height);
            }
        }
    });


    // When we click "ok", the text we have entered is written over the canvas
    $('#writeTextButton').click(function(){
        writeDiv.hide("slow");
        var txt = writeTextInCanvas(canvas.get(0), ctx, text.val(), colorText.css('color'), "Calibri,Geneva,Arial", 30, colorBackground.css('color'));
        x = txt.x;
        y = txt.y;
        width = txt.width;
        height = txt.height;
        var dataURL = canvas.get(0).toDataURL();
    });
});
