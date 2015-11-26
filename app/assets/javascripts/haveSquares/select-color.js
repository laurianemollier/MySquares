(function(){


//    create a canvas for get the color
    var img = document.getElementById('paletteImg');
    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    var context = canvas.getContext('2d')
    context.drawImage(img, 0, 0, img.width, img.height);

//  tool
    var pipette = document.getElementById("pipetteIcon");
    var eraser = document.getElementById("eraserIcon");
    var selectedSquare = document.getElementById("selectedSquare");

//   display the color in the square for the color colected
    var selectedColor = document.getElementById('selectedColor');

    img.addEventListener('click', function(e) {
        var coords = this.relMouseCoords(e);
        var data = context.getImageData(coords.x, coords.y + 14, 1, 1).data; // minus the misplace of the the brush
        var rgba = 'rgba(' + data[0] + ',' + data[1] + ',' + data[2] + ',' + data[3] + ')';
        selectedColor.style.backgroundColor = rgba;

        // unselect tool
        pipette.className = "";
        eraser.className = "";
        selectedSquare.style.cursor = "url(\"/assets/images/brush.png\"), copy";

    }, false);


})();


