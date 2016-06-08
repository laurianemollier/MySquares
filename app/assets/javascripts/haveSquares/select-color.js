
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

    var clickedOne = false;


    /* deal with the selection of tools. Witch one select the color and display the palette */
    textColorSelector.click(function(){
        if(!iconText.hasClass(selectColorId) && !clickedOne){
            clickedOne = true; 

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

    /* deal with the color selection */
    palette.click(function(e){
        var img = $(this).get(0);
        if(canvas.width != img.width || canvas.height != img.height){
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0, img.width, img.height);
        }
        var coords = img.relMouseCoords(e);
        var data = context.getImageData(coords.x, coords.y + 14, 1, 1).data; // minus the misplace of the the brush
        var rgba = 'rgba(' + data[0] + ',' + data[1] + ',' + data[2] + ',' + data[3] + ')';

        $('.selectColor').css("color", rgba);

        // redraw the text with the right color
        write.focusout();
    });

});



