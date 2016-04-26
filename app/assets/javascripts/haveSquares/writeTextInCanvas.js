function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    var lines = text.split('\n');
    for (var i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], x, y + lineHeight*i, maxWidth);
    }
}

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

function writeTextInCanvas(canvas, text, colorText, font, lineHeight, colorBackground){
    var ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.fillStyle = colorBackground;
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fill();

    ctx.font = lineHeight + "px " + font;
    ctx.fillStyle = colorText;


    var padding = 20;
    wrapText(ctx, text, padding, padding + lineHeight, canvas.width - 2*padding, lineHeight + 10);
};


$(function(){

    var text = $('#writeTextTextArea');
    var colorText = $('#iconText');
    var colorBackground = $('#iconBackground');

    var canvas = $('#square-where-we-draw');
    var writeDiv = $('#writeTextDiv');

    // if we click in the canvas, appears the textArea where we can draw
    canvas.click(function(){
        writeDiv.show("slow");
        text.focus();

        //selection the button text color
        $('#textColorSelector').click();
    });

    $('#writeTextButton').click(function(){
        writeDiv.hide("slow");
        writeTextInCanvas(canvas.get(0), text.val(), colorText.css('color'), "Calibri,Geneva,Arial", 30, colorBackground.css('color'));

    });
});
