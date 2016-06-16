
$(function(){
    var selectColorId = 'selectColor';
    var selectedClass = 'selected';

    var iconText = $('#iconText');
    var iconBackground = $('#iconBackground');

    var textColorSelector = $('#textColorSelector');
    var backgroundColorSelector = $('#backgroundColorSelector');

    var palette = $('#paletteImg');
    var write = $('#square-where-we-draw');

//    create a canvas for get the color
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');



    /* deal with the selection of tools. Witch one select the color and display the palette */
    textColorSelector.click(function(){
        if(!iconText.hasClass(selectColorId)){

            iconText.addClass(selectColorId);
            iconBackground.removeClass(selectColorId);

            $(this).addClass(selectedClass);
            backgroundColorSelector.removeClass(selectedClass);
            palette.show("slow");
        }
    });

    backgroundColorSelector.click(function(){
        iconBackground.addClass(selectColorId);
        iconText.removeClass(selectColorId);

        $(this).addClass(selectedClass);
        textColorSelector.removeClass(selectedClass);
        palette.show("slow");
    });

    function selectColor(img, e){
        if(canvas.width != img.width || canvas.height != img.height){
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0, img.width, img.height);
        }
        var coords = img.relMouseCoords(e);
        var data = context.getImageData(coords.x, coords.y - 16, 1, 1).data; // minus the misplace of the the brush
        var rgba = 'rgba(' + data[0] + ',' + data[1] + ',' + data[2] + ',' + data[3] + ')';

        $('.selectColor').css("color", rgba);

        // redraw the text with the right color
        write.focusout();
    }

    var down = false;

    /* deal with the color selection */
    palette.mouseup(function(e){
        var img = $(this).get(0);
        selectColor(img, e);
        down = false;
    });

    palette.click(function(e){
        var img = $(this).get(0);
        selectColor(img, e);
        down = false;
    });

    palette.mousedown(function(e){
        down = true;
        return false;
    });

    palette.mousemove(function(e){
        if(down) {
            var img = $(this).get(0);
            selectColor(img, e);
        }
        return false;
    });



    window.setTimeout(function(){
        backgroundColorSelector.click();
    }, 1000);

});



